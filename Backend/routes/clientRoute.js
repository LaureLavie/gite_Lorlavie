import express from "express";
import { getClients, getClientById } from "../controllers/clientController.js";

const clientRouter = express.Router();

// Routes admin uniquement
clientRouter.get("/", getClients); // Liste de tous les clients
clientRouter.get("/:id", getClientById); // Détail d'un client par ID

export default clientRouter;
