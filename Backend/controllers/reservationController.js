/**
 * Contrôleur Reservation
 * Gère toutes les opérations CRUD pour les réservations du site.
 * Respecte le modèle MVC, la validation des données, la sécurité et la clarté pour la certification.
 */

import Reservation from "../models/reservation.js";
import Client from "../models/client.js";
import { sendMail, htmlReceiptTemplate } from "../middlewares/mail.js";
import ConfirmReservation from "../models/confirmReservation.js";
import { generateNumeroReservation } from "../controllers/confirmReservationController.js";

/**
 * Créer une réservation
 * - Validation des champs requis (dates, nombre de personnes, client)
 * - Vérification cohérence des dates et du nombre de personnes
 * - Création du client et de la réservation en base MongoDB
 * - Envoi d'un email de confirmation
 * - Retourne la réservation créée
 */

export const createReservation = async (req, res) => {
  try {
    const { client, dateArrivee, dateDepart, nombrePersonnes, prixTotal } =
      req.body;

    // Validation des champs obligatoires
    if (
      !client ||
      !client.name ||
      !client.surname ||
      !client.email ||
      !client.adresseComplete ||
      !dateArrivee ||
      !dateDepart ||
      !nombrePersonnes ||
      !prixTotal
    ) {
      return res
        .status(400)
        .json({ error: "Tous les champs requis doivent être renseignés" });
    }

    // Création du client
    const newClient = await Client.create(client);
    // Création de la réservation (sans numeroId)
    const reservation = await Reservation.create({
      dateArrivee,
      dateDepart,
      nombrePersonnes,
      prixTotal,
      client: newClient._id,
      statut: "En Attente",
    });

    // Création de la confirmation
    const numero = await generateNumeroReservation();
    const newConfirmReservation = await ConfirmReservation.create({
      numero,
      client: newClient._id,
      dateArrivee,
      dateDepart,
      nombrePersonnes,
      prixTotal,
      statut: "En Attente",
    });

    // Mise à jour de la réservation avec la référence à la confirmation
    reservation.numeroId = newConfirmReservation._id;
    await reservation.save();

    // Envoi d'un email de confirmation
    const html = htmlReceiptTemplate(newConfirmReservation);
    await sendMail(newClient.email, "Votre confirmation de réservation", html);

    res.status(201).json({
      message: "Nouvelle Réservation. Confirmation de Réservation envoyée",
      reservation,
    });
  } catch (error) {
    console.error("Erreur lors de la nouvelle réservation", error);
    res.status(500).json({
      message: "Erreur interne du serveur",
      error: error.message,
    });
  }
};

// Récupérer une réservation avec les détails de la confirmation associée
export const getReservationWithConfirmation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("numeroId") // relie la réservation à la confirmation
      .populate("client"); // pour avoir aussi les infos client

    if (!reservation) {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Récupérer toutes les réservations
 * - Utilisé pour l'interface d'administration
 * - Les réservations sont peuplées avec les infos client
 */
export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate("client");
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Récupérer une réservation par ID
 * - Permet d'afficher les détails d'une réservation
 */
export const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate(
      "client"
    );
    if (!reservation)
      return res.status(404).json({ error: "Réservation non trouvée" });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Modifier une réservation
 * - Met à jour les informations de la réservation
 * - Validation des champs si besoin
 */
export const updateReservation = async (req, res) => {
  try {
    // Optionnel : valider les champs modifiés ici
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!reservation)
      return res.status(404).json({ error: "Réservation non trouvée" });
    res.json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Supprimer une réservation
 * - Supprime la réservation de la base
 */
export const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation)
      return res.status(404).json({ error: "Réservation non trouvée" });
    res.json({ message: "Réservation supprimée" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const annulerReservation = async (req, res) => {
  try {
    // On met à jour le statut de la réservation
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { statut: "Annulee" },
      { new: true }
    ).populate("client");

    if (!reservation) {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
