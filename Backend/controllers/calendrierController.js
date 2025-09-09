// *Contrôleur Calendrier
//  *Gère les disponibilités et les blocages de dates
//

import CalendrierStatus from "../models/calendrier.js";

/**
 * Récupérer le statut du calendrier pour une période
 * Utilisé par l'admin et les visiteurs
 */
export const getCalendrierStatus = async (req, res) => {
  try {
    const { annee, mois } = req.params;
    const dateDebut = new Date(annee, mois - 1, 1); // mois - 1 car les mois JS commencent à 0
    const dateFin = new Date(annee, mois, 0); // Dernier jour du mois

    const statuts = await CalendrierStatus.find({
      date: { $gte: dateDebut, $lte: dateFin },
    }).populate("reservationId", "numero client");

    // Créer un objet avec tous les jours du mois
    const calendrier = {};
    for (
      let d = new Date(dateDebut);
      d <= dateFin;
      d.setDate(d.getDate() + 1)
    ) {
      const dateKey = d.toISOString().split("T")[0]; // YYYY-MM-DD
      calendrier[dateKey] = {
        date: dateKey,
        statut: "disponible",
        reservationInfo: null,
      };
    }

    // Appliquer les statuts depuis la base
    statuts.forEach((status) => {
      const dateKey = status.date.toISOString().split("T")[0];
      calendrier[dateKey] = {
        date: dateKey,
        statut: status.statut,
        reservationInfo: status.reservationId
          ? {
              numero: status.reservationId.numero,
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
