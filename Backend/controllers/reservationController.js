/**
 * Contrôleur Reservation
 * Gère toutes les opérations CRUD pour les réservations du site.
 * Respecte le modèle MVC, la validation des données, la sécurité et la clarté pour la certification.
 */

import Reservation from "../models/reservation.js";
import Client from "../models/client.js";
import { sendMail } from "../middlewares/mail.js";

/**
 * Créer une réservation
 * - Validation des champs requis (dates, nombrePersonnes, client)
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
      !client.nom ||
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

    // Vérification cohérence des dates
    const debut = new Date(dateArrivee);
    const fin = new Date(dateDepart);
    if (isNaN(debut) || isNaN(fin) || debut >= fin) {
      return res.status(400).json({ error: "Dates de réservation invalides" });
    }

    // Vérification du nombre de personnes
    if (
      typeof nombrePersonnes !== "number" ||
      nombrePersonnes < 1 ||
      nombrePersonnes > 6
    ) {
      return res
        .status(400)
        .json({ error: "Nombre de personnes invalide (1 à 6)" });
    }

    // Création du client
    const newClient = await Client.create(client);

    // Création de la réservation
    const reservation = await Reservation.create({
      ...req.body,
      client: newClient._id,
    });

    // Envoi d'un email de confirmation
    await sendMail(
      client.email,
      "Confirmation de votre réservation",
      `<p>Bonjour ${client.nom},<br>Votre réservation est confirmée du ${dateArrivee} au ${dateDepart}.</p>`
    );

    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
