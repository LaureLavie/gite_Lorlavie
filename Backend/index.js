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
import reservationRouter from "./routes/reservationRoute.js";
import clientRouter from "./routes/clientRoute.js";
import authRouter from "./routes/authRoute.js";

// Initialisation de l'application Express
const app = express();

// Middleware pour parser le JSON des requêtes
app.use(express.json());

// Middleware CORS pour sécuriser les échanges entre frontend et backend
app.use(cors());

// Définition des routes principales de l'API

app.use("/api/reservations", reservationRouter); // Gestion des réservations
app.use("/api/clients", clientRouter); // Gestion des clients
app.use("/api/auth", authRouter); // Authentification admin

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
