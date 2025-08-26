import express from "express";
import {
  createTarif,
  getTarifs,
  getTarifById,
  updateTarif,
  deleteTarif,
  calculerTarif,
} from "../controllers/tarifController.js";

const router = express.Router();

router.post("/", createTarif);
router.get("/", getTarifs);
router.get("/:id", getTarifById);
router.put("/:id", updateTarif);
router.delete("/:id", deleteTarif);

// Route pour le calcul automatique
router.post("/calcul", calculerTarif);

export default router;
