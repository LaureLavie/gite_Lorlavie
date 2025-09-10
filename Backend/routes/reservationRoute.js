import express from "express";
import {
  createReservation,
  getReservations,
  getReservationById,
  modifierReservation,
  validerReservation,
  refuserReservation,
  deleteReservation,
} from "../controllers/reservationController.js";

const reservationRouter = express.Router();

// Routes publiques (visiteurs)
reservationRouter.post("/", createReservation); // Créer une réservation

// Routes admin
reservationRouter.get("/", getReservations); // Liste des réservations
reservationRouter.get("/:id", getReservationById); // Détail d'une réservation
reservationRouter.put("/:id", modifierReservation); // Modifier une réservation
reservationRouter.put("/:id/valider", validerReservation); // Valider une réservation
reservationRouter.put("/:id/refuser", refuserReservation); // Refuser une réservation
reservationRouter.delete("/:id", deleteReservation); // Supprimer une réservation

export default reservationRouter;
