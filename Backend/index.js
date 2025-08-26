import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

// Import des Routes
import reservationRoutes from "./routes/reservationRoutes.js";
import clientRoutes from "./routes/clientRoute.js";
import tarifRoutes from "./routes/tarifRoute.js";
import authRoutes from "./routes/authRoute.js";
import avisRoutes from "./routes/avisRoute.js";

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/reservations", reservationRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/tarifs", tarifRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/avis", avisRoutes);

mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => {
    console.error("Erreur lors de la connextion à MongoDB");
  });

app.listen(process.env.PORT, () =>
  console.log(`Le serveur tourne sur le port ${process.env.PORT}`)
);
