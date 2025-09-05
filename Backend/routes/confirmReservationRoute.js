/**
 * Routeur Réservation
 * - Gère toutes les opérations CRUD pour les réservations
 * - Conforme au cahier des charges : clarté, organisation MVC
 */

import express from "express";
import {
  getAllConfirmation,
  getConfirmationById,
  deleteConfirmation,
} from "../controllers/confirmReservationController.js";

const confirmationRouter = express.Router();

// Liste de toutes les confirmations
confirmationRouter.get("/", getAllConfirmation);

// Détail d'une confirmation par ID
confirmationRouter.get("/:id", getConfirmationById);

// Suppression d'une confirmation
confirmationRouter.delete("/:id", deleteConfirmation);

export default confirmationRouter;
