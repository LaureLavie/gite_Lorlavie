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
} from "../controllers/reservationController.js";

const router = express.Router();

// Création d'une réservation
router.post("/", createReservation);

// Liste de toutes les réservations
router.get("/", getReservations);

// Détail d'une réservation par ID
router.get("/:id", getReservationById);

// Modification d'une réservation
router.put("/:id", updateReservation);

// Suppression d'une réservation
router.delete("/:id", deleteReservation);

export default router;
