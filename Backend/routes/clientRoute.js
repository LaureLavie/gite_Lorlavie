
import express from "express";
import { getClients, getClientById, 
  createClient,
  updateClient,
  deleteClient } from "../controllers/clientController.js";

const clientRouter = express.Router();

// Liste de tous les clients
clientRouter.get("/", getClients);

// Détail d'un client par ID
clientRouter.get("/:id", getClientById);

//Créer un client
clientRouter.post("/", createClient);

//Modifier un client
clientRouter.put("/:id", updateClient);

//Supprimer un client
clientRouter.delete("/:id", deleteClient);

export default clientRouter;
