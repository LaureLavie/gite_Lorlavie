import { calculPrixReservation } from "../middlewares/calculReservation.js";
import Reservation from "../models/reservation.js";
import Client from "../models/client.js";
import * as CalendrierService from "../services/calendrierService.js";
import * as ReservationService from "../services/reservationService.js";
import {
  sendMail,
  htmlReservationEnAttente,
  htmlReservationConfirmee,
  htmlReservationModifiee,
  htmlReservationRefusee,
} from "../middlewares/mail.js";

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
      !nombrePersonnes
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
    const disponible = await CalendrierService.verifierDisponibilite(
      dateArrivee,
      dateDepart
    );
    if (!disponible) {
      return res.status(409).json({
        error: "Les dates sélectionnées ne sont pas disponibles",
      });
    }

    // Calculer le prix total
    const nuits = ReservationService.calculerNombreNuits(
      dateArrivee,
      dateDepart
    );
    const prixTotal = calculPrixReservation(
      nombrePersonnes,
      nuits,
      personnesSupplementaires,
      options
    );

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
    await CalendrierService.bloquerPeriode(
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

//Valider une réservation (admin)
export const validerReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const modificationsAdmin = req.body?.modificationsAdmin;

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
    await CalendrierService.bloquerPeriode(
      reservation.dateArrivee,
      reservation.dateDepart,
      reservation._id
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

//réfuser une réservation (admin)
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
    await CalendrierService.libererPeriode(
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

//Modifier une réservation (admin)
export const modifierReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const modifications = req.body;

    const reservation = await Reservation.findById(id).populate("client");
    if (!reservation) {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }

    if (!ReservationService.peutEtreModifiee(reservation)) {
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
      await CalendrierService.libererPeriode(
        reservation.dateArrivee,
        reservation.dateDepart
      );

      // Vérifier disponibilité nouvelles dates
      const disponible = await CalendrierService.verifierDisponibilite(
        nouvelleDateArrivee,
        nouvelleDateDepart
      );

      if (!disponible) {
        // Rebloquer les anciennes dates si les nouvelles ne sont pas dispo
        await CalendrierService.bloquerPeriode(
          reservation.dateArrivee,
          reservation.dateDepart,
          reservation._id
        );

        return res.status(409).json({
          error: "Les nouvelles dates ne sont pas disponibles",
        });
      }

      // Bloquer les nouvelles dates
      await CalendrierService.bloquerPeriode(
        nouvelleDateArrivee,
        nouvelleDateDepart,
        reservation._id
      );
    }

    // Appliquer les modifications
    Object.assign(reservation, modifications);
    reservation.dateModification = new Date();

    // Recalculer le prix si nécessaire (utilisation de la fonction utilitaire)
    if (
      modifications.nombrePersonnes ||
      modifications.personnesSupplementaires ||
      modifications.dateArrivee ||
      modifications.dateDepart ||
      modifications.options
    ) {
      const arrivee = new Date(reservation.dateArrivee);
      const depart = new Date(reservation.dateDepart);
      const nuits = Math.ceil((depart - arrivee) / (1000 * 60 * 60 * 24));

      reservation.prixTotal = calculPrixReservation(
        reservation.nombrePersonnes,
        nuits,
        reservation.personnesSupplementaires,
        reservation.options
      );
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

// Récupérer toutes les réservations (admin)
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

//récupérer une réservation par son id (admin)
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

//Supprimer une réservation (admin)
export const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }

    // Libérer les dates
    await CalendrierService.libererPeriode(
      reservation.dateArrivee,
      reservation.dateDepart
    );

    await Reservation.findByIdAndDelete(req.params.id);

    res.json({ message: "Réservation supprimée" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
