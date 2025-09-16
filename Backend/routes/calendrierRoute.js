import express from "express";
import {
  getCalendrierStat,
  verifierDisponibilite,
  updateStatusDates,
  bloquerPeriode,
  getDatesDisponibles,
  nettoyerAnciennesDates,
} from "../controllers/calendrierController.js";

const calendrierRouter = express.Router();

// Routes publiques (visiteurs)
calendrierRouter.get("/disponibles/:annee/:mois", getDatesDisponibles); // Dates disponibles pour un mois
calendrierRouter.post("/verifier", verifierDisponibilite); // Vérifier disponibilité d'une période

// Routes admin
calendrierRouter.get("/:annee/:mois", getCalendrierStat); // Statut complet d'un mois
calendrierRouter.put("/dates", updateStatusDates); // Modifier le statut de dates spécifiques
calendrierRouter.post("/bloquer", bloquerPeriode); // Bloquer une période
calendrierRouter.delete("/nettoyer", nettoyerAnciennesDates); // Maintenance

export default calendrierRouter;
