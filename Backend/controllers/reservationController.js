import Reservation from "../models/reservation.js";
import Client from "../models/client.js";
import { sendMail } from "../middlewares/mail.js";

// Créer une réservation
export const createReservation = async (req, res) => {
  try {
    const { client, ...reservationData } = req.body;
    // Création de l'hôte
    const newHote = await Client.create(client);
    const reservation = await Reservation.create({
      ...reservationData,
      client: newHote._id,
    });
    await sendMail(
      client.email,
      "Confirmation de votre réservation",
      `<p>Bonjour ${client.nom},<br>Votre réservation est confirmée du ${reservationData.dateArrivee} au ${reservationData.dateDepart}.</p>`
    );
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lire toutes les réservations
export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate("client");
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lire une réservation par ID
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

// Modifier une réservation
export const updateReservation = async (req, res) => {
  try {
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

// Supprimer une réservation
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
