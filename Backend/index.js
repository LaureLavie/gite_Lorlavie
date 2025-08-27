/**
 * Point d'entrée principal du backend Gîte Lorlavie
 * - Initialise le serveur Express
 * - Configure la connexion à MongoDB
 * - Charge les routes principales de l'API
 * - Applique les middlewares de sécurité et de gestion des données
 *
 * Conforme au cahier des charges :
 * - Architecture MVC claire
 * - Sécurité RGPD (variables .env, CORS)
 * - Organisation et clarté pour la certification
 */

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Chargement des variables d'environnement (.env)
dotenv.config();

// Import des routeurs (organisation MVC)
import reservationRoutes from "./routes/reservationRoutes.js";
import clientRoutes from "./routes/clientRoute.js";
import tarifRoutes from "./routes/tarifRoute.js";
import authRoutes from "./routes/authRoute.js";
import avisRoutes from "./routes/avisRoute.js";

// Initialisation de l'application Express
const app = express();

// Middleware pour parser le JSON des requêtes
app.use(express.json());

// Middleware CORS pour sécuriser les échanges entre frontend et backend
app.use(cors());

// Définition des routes principales de l'API
app.use("/api/reservations", reservationRoutes); // Gestion des réservations
app.use("/api/clients", clientRoutes); // Gestion des clients
app.use("/api/tarifs", tarifRoutes); // Gestion des tarifs
app.use("/api/auth", authRoutes); // Authentification admin
app.use("/api/avis", avisRoutes); // Gestion des avis clients

// Connexion à la base MongoDB (sécurisée via .env)
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => {
    console.error("Erreur lors de la connexion à MongoDB");
  });

// Lancement du serveur sur le port défini dans .env
app.listen(process.env.PORT, () =>
  console.log(`Le serveur tourne sur le port ${process.env.PORT}`)
);
