/**
 * Routeur Réservation
 * - Gère toutes les opérations CRUD pour les réservations
 */

import express from "express";
import {
  createReservation,
  getReservations,
  getReservationById,
  deleteReservation,
} from "../controllers/reservationController.js";

const reservationRouter = express.Router();

// Création d'une réservation
reservationRouter.post("/", createReservation);

// Liste de toutes les réservations
reservationRouter.get("/", getReservations);

// Détail d'une réservation par ID
reservationRouter.get("/:id", getReservationById);
// Suppression d'une réservation
reservationRouter.delete("/:id", deleteReservation);

export default reservationRouter;
