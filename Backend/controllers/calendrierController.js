import CalendrierStat from "../models/calendrier.js";
import * as CalendrierService from "../services/calendrierService.js";

//Génération du calendrier
export function calendrierBase(dateDebut, dateFin) {
  const calendrier = {};
  for (let d = new Date(dateDebut); d <= dateFin; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toISOString().split("T")[0];
    calendrier[dateKey] = {
      date: dateKey,
      statut: "disponible",
      reservationInfo: null,
      notes: "",
    };
  }
  return calendrier;
}

// Récupérer le statut du calendrier pour une période (admin et visiteurs)
export const getCalendrierStat = async (req, res) => {
  try {
    const { annee, mois } = req.params;
    const dateDebut = new Date(annee, mois - 1, 1); // mois JS commence à 0
    const dateFin = new Date(annee, mois, 0); // dernier jour du mois
    // Utiliser une borne supérieure exclusive pour les requêtes : [dateDebut, dateFinExclusive)
    const dateFinExclusive = new Date(dateFin);
    dateFinExclusive.setDate(dateFinExclusive.getDate() + 1);

    // 1. Génère le calendrier de base
    const calendrier = calendrierBase(dateDebut, dateFin);

    // 2. Récupère les statuts en base
    const statuts = await CalendrierStat.find({
      date: { $gte: dateDebut, $lt: dateFinExclusive },
    }).populate("reservationId");

    // 3. Applique les statuts sur le calendrier
    statuts.forEach((status) => {
      const dateKey = status.date.toISOString().split("T")[0];
      calendrier[dateKey] = {
        date: dateKey,
        statut: status.statut,
        reservationInfo: status.reservationId
          ? {
              clientId: status.reservationId.client,
            }
          : null,
        notes: status.notes,
      };
    });

    res.json({
      annee: parseInt(annee),
      mois: parseInt(mois),
      calendrier: Object.values(calendrier),
    });
  } catch (error) {
    console.error("Erreur récupération calendrier:", error);
    res.status(500).json({ error: error.message });
  }
};

//Vérification de la disponibilité d'une période (pour les visiteurs)
export const verifierDisponibilite = async (req, res) => {
  try {
    const { dateArrivee, dateDepart } = req.body;

    if (!dateArrivee || !dateDepart) {
      return res.status(400).json({
        error: "Les dates d'arrivée et de départ sont requises",
      });
    }

    const arrivee = new Date(dateArrivee);
    const depart = new Date(dateDepart);

    if (arrivee >= depart) {
      return res.status(400).json({
        error: "La date de départ doit être après la date d'arrivée",
      });
    }

    const disponible = await CalendrierService.verifierDisponibilite(
      dateArrivee,
      dateDepart
    );

    if (!disponible) {
      // Récupérer les dates problématiques pour donner plus de détails
      const datesOccupees = await CalendrierStat.find({
        date: { $gte: arrivee, $lt: depart },
        statut: { $in: ["reserve", "bloque"] },
      }).populate("reservationId");

      res.json({
        disponible: false,
        message: "Certaines dates ne sont pas disponibles",
        datesOccupees: datesOccupees.map((d) => ({
          date: d.date.toISOString().split("T")[0],
          statut: d.statut,
        })),
      });
    } else {
      res.json({
        disponible: true,
        message: "Dates disponibles",
      });
    }
  } catch (error) {
    console.error("Erreur vérification disponibilité:", error);
    res.status(500).json({ error: error.message });
  }
};

//mettre a jour les dates spécifiques (admin uniquement)
export const updateStatusDates = async (req, res) => {
  try {
    const { dates, notes } = req.body;
    const adminName = req.user?.name || "Admin";

    if (!dates || !Array.isArray(dates) || dates.length === 0) {
      return res.status(400).json({
        error: "Une liste de dates est requise",
      });
    }

    const updates = [];
    for (const item of dates) {
      if (!item.date || !item.statut) continue;
      const date = new Date(item.date);
      const statut = item.statut;

      if (statut === "disponible") {
        updates.push(
          CalendrierStat.findOneAndUpdate(
            { date },
            {
              statut: "disponible",
              $unset: { reservationId: "", notes: "" },
              modifiePar: adminName,
              dateModification: new Date(),
            },
            { upsert: true }
          )
        );
      } else if (statut === "reserve") {
        // Ne pas permettre de réserver manuellement ici (optionnel)
        continue;
      } else if (statut === "ferme" || statut === "bloque") {
        updates.push(
          CalendrierStat.findOneAndUpdate(
            { date },
            {
              statut: "bloque",
              notes: notes || "",
              modifiePar: adminName,
              dateModification: new Date(),
              $unset: { reservationId: "" },
            },
            { upsert: true }
          )
        );
      }
    }

    await Promise.all(updates);

    res.json({
      message: `${dates.length} date(s) mise(s) à jour avec succès`,
      datesModifiees: dates,
    });
  } catch (error) {
    console.error("Erreur mise à jour calendrier:", error);
    res.status(500).json({ error: error.message });
  }
};

//Bloquer une période complète (admin)
export const bloquerPeriode = async (req, res) => {
  try {
    const { dateDebut, dateFin, notes } = req.body;
    const adminName = req.user?.name || "Admin";

    if (!dateDebut || !dateFin) {
      return res.status(400).json({
        error: "Les dates de début et fin sont requises",
      });
    }

    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);

    if (debut >= fin) {
      return res.status(400).json({
        error: "La date de fin doit être après la date de début",
      });
    }

    // Vérifier s'il y a des réservations confirmées dans cette période
    const reservationsExistantes = await CalendrierStat.find({
      date: { $gte: debut, $lt: fin },
      statut: "reserve",
    }).populate("reservationId");

    const reservationsConfirmees = reservationsExistantes.filter(
      (r) => r.reservationId?.statut === "Confirmee"
    );

    if (reservationsConfirmees.length > 0) {
      return res.status(409).json({
        error:
          "Impossible de bloquer cette période, des réservations confirmées existent",
        reservationsConflictuelles: reservationsConfirmees.map((r) => ({
          date: r.date,
          reservation: r.reservationId,
        })),
      });
    }

    // Utiliser le service pour bloquer la période (upserts internes)
    const resultat = await CalendrierService.bloquerPeriode(debut, fin, null, {
      notes,
      modifiePar: adminName,
    });

    // Déterminer le nombre de jours bloqués
    let nombreJours;
    if (Array.isArray(resultat)) {
      nombreJours = resultat.length;
    } else {
      nombreJours = Math.ceil((fin - debut) / (1000 * 60 * 60 * 24));
    }

    res.json({
      message: `Période bloquée du ${dateDebut} au ${dateFin}`,
      nombreJours,
    });
  } catch (error) {
    console.error("Erreur blocage période:", error);
    res.status(500).json({ error: error.message });
  }
};

// Récupérer les dates disponibles pour un mois donné
export const getDatesDisponibles = async (req, res) => {
  try {
    const { annee, mois } = req.params;
    const dateDebut = new Date(annee, mois - 1, 1);
    const dateFin = new Date(annee, mois, 0);
    const dateFinExclusive = new Date(dateFin);
    dateFinExclusive.setDate(dateFinExclusive.getDate() + 1);

    // Récupérer seulement les dates NON disponibles
    const datesOccupees = await CalendrierStat.find({
      date: { $gte: dateDebut, $lt: dateFinExclusive },
      statut: { $ne: "disponible" },
    });

    const datesNonDisponibles = datesOccupees.map((d) => ({
      date: d.date.toISOString().split("T")[0],
      statut: d.statut,
    }));

    res.json({
      annee: parseInt(annee),
      mois: parseInt(mois),
      datesNonDisponibles,
    });
  } catch (error) {
    console.error("Erreur récupération dates disponibles:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Nettoyer les anciennes dates (tâche de maintenance)
 */
export const nettoyerAnciennesDates = async (req, res) => {
  try {
    const dateLimit = new Date();
    dateLimit.setMonth(dateLimit.getMonth() - 3); // Garder 3 mois d'historique

    const result = await CalendrierStat.deleteMany({
      date: { $lt: dateLimit },
      statut: "disponible", // Ne supprimer que les dates disponibles anciennes
    });

    res.json({
      message: `${result.deletedCount} anciennes dates supprimées`,
    });
  } catch (error) {
    console.error("Erreur nettoyage calendrier:", error);
    res.status(500).json({ error: error.message });
  }
};
