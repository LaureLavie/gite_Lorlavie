import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

// Import des routeurs
import reservationRouter from "./routes/reservationRoute.js";
import clientRouter from "./routes/clientRoute.js";
import authRouter from "./routes/authRoute.js";
import calendrierRouter from "./routes/calendrierRoute.js";

// Initialisation de l'application Express
const app = express();

// Middleware pour parser le JSON des requêtes
app.use(express.json());

// Middleware CORS pour sécuriser les échanges entre frontend et backend
const allowedOrigins = [
  "http://127.0.0.1:5500", // Live Server local
  "http://localhost:5500", // Variante locale
  "https://gite-lorlavie.onrender.com", // Frontend déployé
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Autorise les requêtes sans origin (ex: Postman) ou si l'origine est dans la liste
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:;"
  );
  next();
});

// Définition des routes principales de l'API
app.use("/api/calendrier", calendrierRouter); //gestion du calendrier
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
