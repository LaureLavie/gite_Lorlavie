import express from "express";
import {
  createAvis,
  getAvis,
  validerAvis,
  repondreAvis,
  deleteAvis,
} from "../controllers/avisController.js";
import { verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", createAvis); // client
router.get("/", getAvis); // public ou admin
router.put("/:id/valider", verifyAdmin, validerAvis); // admin
router.put("/:id/repondre", verifyAdmin, repondreAvis); // admin
router.delete("/:id", verifyAdmin, deleteAvis); // admin

export default router;
