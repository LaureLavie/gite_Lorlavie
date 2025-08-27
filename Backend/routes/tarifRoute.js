/**
 * Routeur Tarif
 * - Gère toutes les opérations CRUD et le calcul automatique des tarifs
 * - Conforme au cahier des charges : clarté, organisation MVC
 */

import express from "express";
import {
  createTarif,
  getTarifs,
  getTarifById,
  updateTarif,
  deleteTarif,
  calculerTarif,
} from "../controllers/tarifController.js";

const router = express.Router();

// Création d'un tarif
router.post("/", createTarif);

// Liste de tous les tarifs
router.get("/", getTarifs);

// Détail d'un tarif par ID
router.get("/:id", getTarifById);

// Modification d'un tarif
router.put("/:id", updateTarif);

// Suppression d'un tarif
router.delete("/:id", deleteTarif);

// Calcul automatique du tarif (prix total selon critères)
router.post("/calcul", calculerTarif);

export default router;
