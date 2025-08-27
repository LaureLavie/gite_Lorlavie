/**
 * Routeur Client
 * - Gère toutes les opérations CRUD pour les clients
 * - Conforme au cahier des charges : clarté, organisation MVC
 */

import express from "express";
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";

const router = express.Router();

// Création d'un client
router.post("/", createClient);

// Liste de tous les clients
router.get("/", getClients);

// Détail d'un client par ID
router.get("/:id", getClientById);

// Modification d'un client
router.put("/:id", updateClient);

// Suppression d'un client
router.delete("/:id", deleteClient);

export default router;
