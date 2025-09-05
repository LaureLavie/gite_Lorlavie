/**
 * Routeur Réservation
 * - Gère toutes les opérations CRUD pour les réservations
 * - Conforme au cahier des charges : clarté, organisation MVC
 */

import express from "express";
import {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
  annulerReservation,
} from "../controllers/reservationController.js";

const reservationRouter = express.Router();

// Création d'une réservation
reservationRouter.post("/", createReservation);

// Liste de toutes les réservations
reservationRouter.get("/", getReservations);

// Détail d'une réservation par ID
reservationRouter.get("/:id", getReservationById);

// Modification d'une réservation
reservationRouter.put("/:id", updateReservation);

// Suppression d'une réservation
reservationRouter.delete("/:id", deleteReservation);

//Annuler une réservation
// ...existing code...
reservationRouter.put("/:id/annuler", annulerReservation);

export default reservationRouter;
