/**
 * Contrôleur Reservation
 * Gère tout le cycle de vie des réservations avec la nouvelle logique métier
 */

import Reservation from "../models/reservation.js";
import Client from "../models/client.js";
import CalendrierStatus from "../models.calendrier.js";
import {
  sendMail,
  htmlReservationEnAttente,
  htmlReservationConfirmee,
  htmlReservationRefusee,
  htmlReservationModifiee,
} from "../middlewares/mail.js";

/**
 *Créer une réservation
 * - Vérifier la disponibilité
 * - Créer client et réservation
 * - bloquer temporairement les dates
 * - envoyer email "en attente"
 */

export const createReservation = async (req, res) => {
  try {
    const {
      client,
      dateArrivee,
      dateDepart,
      nombrePersonnes,
      personnesSupplementaires = 0,
      options = {},
      modePaiement,
    } = req.body;

    // Validation des champs obligatoires
    if (
      !client ||
      !client.name ||
      !client.surname ||
      !client.email ||
      !dateArrivee ||
      !dateDepart ||
      !nombrePersonnes ||
      !modePaiement
    ) {
      return res.status(400).json({
        error: "Tous les champs requis doivent être renseignés",
      });
    }

    // Vérifier que les dates sont cohérentes
    const arrivee = new Date(dateArrivee);
    const depart = new Date(dateDepart);
    if (arrivee >= depart) {
      return res.status(400).json({
        error: "La date de départ doit être après la date d'arrivée",
      });
    }

    // Vérifier disponibilité des dates
    const disponible = await CalendrierStatus.verifierDisponibilite(
      dateArrivee,
      dateDepart
    );
    if (!disponible) {
      return res.status(409).json({
        error: "Les dates sélectionnées ne sont pas disponibles",
      });
    }

    // Calculer le prix total
    const tarifs = [65, 75, 85, 95, 105, 115]; // Prix par nombre de personnes
    const nuits = Math.ceil((depart - arrivee) / (1000 * 60 * 60 * 24));
    let prixTotal = tarifs[nombrePersonnes - 1] * nuits;

    if (options.menage) prixTotal += 30;
    prixTotal += personnesSupplementaires * 30;

    // Créer le client
    const newClient = await Client.create(client);

    // Créer la réservation
    const reservation = await Reservation.create({
      client: newClient._id,
      dateArrivee,
      dateDepart,
      nombrePersonnes,
      personnesSupplementaires,
      options,
      prixTotal,
      modePaiement,
      statut: "En Attente",
    });

    // Bloquer temporairement les dates dans le calendrier
    await CalendrierStatus.bloquerPeriode(
      dateArrivee,
      dateDepart,
      reservation._id
    );

    // Envoyer email de confirmation temporaire
    const html = htmlReservationEnAttente(reservation, newClient);
    await sendMail(
      newClient.email,
      "Votre réservation est en cours de traitement",
      html
    );

    res.status(201).json({
      message:
        "Réservation créée avec succès. Un email de confirmation vous a été envoyé.",
      reservation: {
        numero: reservation.numero,
        statut: reservation.statut,
        prixTotal: reservation.prixTotal,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la création de la réservation:", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
      error: error.message,
    });
  }
};

/**
 * Valider une réservation (admin)
 * 1. Changer statut à "Confirmee"
 * 2. Confirmer le blocage des dates
 * 3. Envoyer email de confirmation
 */
export const validerReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { modificationsAdmin } = req.body;

    const reservation = await Reservation.findById(id).populate("client");
    if (!reservation) {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }

    if (reservation.statut !== "En Attente") {
      return res.status(400).json({
        error: "Cette réservation ne peut plus être validée",
      });
    }

    // Mettre à jour la réservation
    reservation.statut = "Confirmee";
    reservation.dateValidation = new Date();
    if (modificationsAdmin) {
      reservation.modificationsAdmin = modificationsAdmin;
    }
    await reservation.save();

    // Les dates sont déjà bloquées, juste confirmer le statut
    await CalendrierStatus.updateMany(
      {
        date: {
          $gte: reservation.dateArrivee,
          $lt: reservation.dateDepart,
        },
        reservationId: reservation._id,
      },
      { statut: "reserve" }
    );

    // Envoyer email de confirmation
    const html = htmlReservationConfirmee(reservation, reservation.client);
    await sendMail(
      reservation.client.email,
      "Votre réservation est confirmée !",
      html
    );

    res.json({
      message: "Réservation validée avec succès",
      reservation,
    });
  } catch (error) {
    console.error("Erreur lors de la validation:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Refuser une réservation (admin)
 * 1. Changer statut à "Refusee"
 * 2. Libérer les dates
 * 3. Envoyer email de refus
 */
export const refuserReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { raisonRefus } = req.body;

    const reservation = await Reservation.findById(id).populate("client");
    if (!reservation) {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }

    // Mettre à jour la réservation
    reservation.statut = "Refusee";
    reservation.raisonRefus = raisonRefus || "Non spécifiée";
    reservation.dateValidation = new Date();
    await reservation.save();

    // Libérer les dates dans le calendrier
    await CalendrierStatus.libererPeriode(
      reservation.dateArrivee,
      reservation.dateDepart
    );

    // Envoyer email de refus
    const html = htmlReservationRefusee(
      reservation,
      reservation.client,
      raisonRefus
    );
    await sendMail(
      reservation.client.email,
      "Concernant votre demande de réservation",
      html
    );

    res.json({
      message: "Réservation refusée",
      reservation,
    });
  } catch (error) {
    console.error("Erreur lors du refus:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Modifier une réservation (admin)
 * 1. Vérifier nouvelles dates si modifiées
 * 2. Mettre à jour calendrier
 * 3. Recalculer prix si nécessaire
 * 4. Envoyer email de modification
 */
export const modifierReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const modifications = req.body;

    const reservation = await Reservation.findById(id).populate("client");
    if (!reservation) {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }

    if (!reservation.peutEtreModifiee()) {
      return res.status(400).json({
        error: "Cette réservation ne peut plus être modifiée",
      });
    }

    // Si les dates changent, vérifier disponibilité
    if (modifications.dateArrivee || modifications.dateDepart) {
      const nouvelleDateArrivee =
        modifications.dateArrivee || reservation.dateArrivee;
      const nouvelleDateDepart =
        modifications.dateDepart || reservation.dateDepart;

      // Libérer les anciennes dates
      await CalendrierStatus.libererPeriode(
        reservation.dateArrivee,
        reservation.dateDepart
      );

      // Vérifier disponibilité nouvelles dates
      const disponible = await CalendrierStatus.verifierDisponibilite(
        nouvelleDateArrivee,
        nouvelleDateDepart
      );

      if (!disponible) {
        // Rebloquer les anciennes dates si les nouvelles ne sont pas dispo
        await CalendrierStatus.bloquerPeriode(
          reservation.dateArrivee,
          reservation.dateDepart,
          reservation._id
        );

        return res.status(409).json({
          error: "Les nouvelles dates ne sont pas disponibles",
        });
      }

      // Bloquer les nouvelles dates
      await CalendrierStatus.bloquerPeriode(
        nouvelleDateArrivee,
        nouvelleDateDepart,
        reservation._id
      );
    }

    // Appliquer les modifications
    Object.assign(reservation, modifications);
    reservation.dateModification = new Date();

    // Recalculer le prix si nécessaire
    if (
      modifications.nombrePersonnes ||
      modifications.personnesSupplementaires ||
      modifications.dateArrivee ||
      modifications.dateDepart ||
      modifications.options
    ) {
      const tarifs = [65, 75, 85, 95, 105, 115];
      const arrivee = new Date(reservation.dateArrivee);
      const depart = new Date(reservation.dateDepart);
      const nuits = Math.ceil((depart - arrivee) / (1000 * 60 * 60 * 24));

      let nouveauPrix = tarifs[reservation.nombrePersonnes - 1] * nuits;
      if (reservation.options.menage) nouveauPrix += 30;
      nouveauPrix += reservation.personnesSupplementaires * 30;

      reservation.prixTotal = nouveauPrix;
    }

    await reservation.save();

    // Envoyer email de modification
    const html = htmlReservationModifiee(reservation, reservation.client);
    await sendMail(
      reservation.client.email,
      "Votre réservation a été modifiée",
      html
    );

    res.json({
      message: "Réservation modifiée avec succès",
      reservation,
    });
  } catch (error) {
    console.error("Erreur lors de la modification:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Récupérer toutes les réservations (admin)
 */
export const getReservations = async (req, res) => {
  try {
    const { statut } = req.query;
    const filter = statut ? { statut } : {};

    const reservations = await Reservation.find(filter)
      .populate("client")
      .sort({ dateCreation: -1 });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Récupérer une réservation par ID
 */
export const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate(
      "client"
    );
    if (!reservation) {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Supprimer une réservation (admin)
 */
export const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }

    // Libérer les dates
    await CalendrierStatus.libererPeriode(
      reservation.dateArrivee,
      reservation.dateDepart
    );

    await Reservation.findByIdAndDelete(req.params.id);

    res.json({ message: "Réservation supprimée" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
