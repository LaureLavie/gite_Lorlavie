/**
 * Routeur Client
 * - Gère toutes les opérations CRUD pour les clients
 * - Conforme au cahier des charges : clarté, organisation MVC
 */

import express from "express";
import { getClients, getClientById } from "../controllers/clientController.js";

const clientRouter = express.Router();

// Liste de tous les clients
clientRouter.get("/", getClients);

// Détail d'un client par ID
clientRouter.get("/:id", getClientById);

export default clientRouter;
