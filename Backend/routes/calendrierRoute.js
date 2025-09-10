/**
 * Routes principales de l'API - Version complète
 * Inclut toutes les routes nécessaires pour le système de réservation
 */

import express from "express";
import cors from "cors";

// Import des routeurs
import reservationRouter from "./routes/reservationRoute.js";
import clientRouter from "./routes/clientRoute.js";
import calendrierRouter from "./routes/calendrierRoute.js";

// Middleware d'authentification (à implémenter)
import { authenticateAdmin, optionalAuth } from "./middlewares/auth.js";

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes publiques (visiteurs)
app.use("/api/reservations", reservationRouter);
app.use("/api/calendrier/disponibles", calendrierRouter);

// Routes privées (admin uniquement)
app.use("/api/admin/reservations", authenticateAdmin, reservationRouter);
app.use("/api/admin/clients", authenticateAdmin, clientRouter);
app.use("/api/admin/calendrier", authenticateAdmin, calendrierRouter);

// Route de santé
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "API Gîte Lorlavie opérationnelle",
    timestamp: new Date().toISOString()
  });
});

// Gestion des erreurs 404
app.use("*", (req, res) => {
  res.status(404).json({ 
    error: "Route non trouvée",
    requested: req.originalUrl
  });
});

// Gestion des erreurs globales
app.use((error, req, res, next) => {
  console.error("Erreur globale:", error);
  res.status(500).json({ 
    error: "Erreur interne du serveur",
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
});

export default app;

// ===== ROUTES DÉTAILLÉES =====

/**
 * reservationRoute.js - Routes pour les réservations
 */

import express from "express";
import {
  createReservation,
  getReservations,
  getReservationById,
  modifierReservation,
  validerReservation,
  refuserReservation,
  deleteReservation,
} from "../controllers/reservationController.js";

const reservationRouter = express.Router();

// Routes publiques (visiteurs)
reservationRouter.post("/", createReservation); // Créer une réservation

// Routes admin
reservationRouter.get("/", getReservations); // Liste des réservations
reservationRouter.get("/:id", getReservationById); // Détail d'une réservation
reservationRouter.put("/:id", modifierReservation); // Modifier une réservation
reservationRouter.put("/:id/valider", validerReservation); // Valider une réservation
reservationRouter.put("/:id/refuser", refuserReservation); // Refuser une réservation
reservationRouter.delete("/:id", deleteReservation); // Supprimer une réservation

export default reservationRouter;

/**
 * calendrierRoute.js - Routes pour le calendrier
 */

import express from "express";
import {
  getCalendrierStatus,
  verifierDisponibilite,
  updateStatusDates,
  bloquerPeriode,
  getDatesDisponibles,
  nettoyerAnciennesDates
} from "../controllers/calendrierController.js";

const calendrierRouter = express.Router();

// Routes publiques (visiteurs)
calendrierRouter.get("/disponibles/:annee/:mois", getDatesDisponibles); // Dates disponibles pour un mois
calendrierRouter.post("/verifier", verifierDisponibilite); // Vérifier disponibilité d'une période

// Routes admin
calendrierRouter.get("/:annee/:mois", getCalendrierStatus); // Statut complet d'un mois
calendrierRouter.put("/dates", updateStatusDates); // Modifier le statut de dates spécifiques
calendrierRouter.post("/bloquer", bloquerPeriode); // Bloquer une période
calendrierRouter.delete("/nettoyer", nettoyerAnciennesDates); // Maintenance

export default calendrierRouter;

/**
 * clientRoute.js - Routes pour les clients (inchangées)
 */

import express from "express";
import { getClients, getClientById } from "../controllers/clientController.js";

const clientRouter = express.Router();

/// Routes admin uniquement
clientRouter.get("/", getClients); // Liste de tous les clients
clientRouter.get("/:id", getClientById); // Détail d'un client par ID

export default clientRouter;