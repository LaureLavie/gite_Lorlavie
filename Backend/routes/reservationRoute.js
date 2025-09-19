/**
 * Routeur Réservation
 * - Gère toutes les opérations CRUD pour les réservations
 */

import express from "express";
import {
  createReservation,
  getReservations,
  getReservationById,
  modifierReservation,
  deleteReservation,
  validerReservation,
  refuserReservation,
} from "../controllers/reservationController.js";

const reservationRouter = express.Router();

// Création d'une réservation
reservationRouter.post("/", createReservation);

// Liste de toutes les réservations
reservationRouter.get("/", getReservations);

// Détail d'une réservation par ID
reservationRouter.get("/:id", getReservationById);

// Modifier une réservation
reservationRouter.put("/:id", modifierReservation);

// Suppression d'une réservation
reservationRouter.delete("/:id", deleteReservation);

// Valider une réservation
reservationRouter.post("/:id/valider", validerReservation);

//refuser une réservation
reservationRouter.post("/:id/refuser", refuserReservation);

export default reservationRouter;
