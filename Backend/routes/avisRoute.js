/**
 * Routeur Avis Client
 * - Gère la création, la consultation, la validation, la réponse et la suppression des avis
 * - Les actions admin sont protégées par verifyAdmin
 * - Conforme au cahier des charges : sécurité, clarté, organisation MVC
 */

import express from "express";
import {
  createAvis,
  getAvis,
  validerAvis,
  repondreAvis,
  deleteAvis,
} from "../controllers/avisController.js";
import { verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Création d'un avis client (public)
router.post("/", createAvis);

// Consultation des avis (public ou admin)
router.get("/", getAvis);

// Validation d'un avis (admin uniquement)
router.put("/:id/valider", verifyAdmin, validerAvis);

// Réponse à un avis (admin uniquement)
router.put("/:id/repondre", verifyAdmin, repondreAvis);

// Suppression d'un avis (admin uniquement)
router.delete("/:id", verifyAdmin, deleteAvis);

export default router;
