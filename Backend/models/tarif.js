import mongoose from "mongoose";

/**
 * Modèle Tarif
 * - Définit la tarification selon le nombre de personnes et la période
 * - Validation stricte des champs
 */
const TarifSchema = new mongoose.Schema({
  dateArrivee: { type: Date, required: true }, // Date de début de validité du tarif
  dateDepart: { type: Date, required: true }, // Date de fin de validité du tarif
  nombrePersonnes: { type: Number, required: true }, // Nombre de personnes concernées
  prixNuit: { type: Number, required: true }, // Prix par nuit
  periode: { type: String, enum: ["haute", "basse"], required: true }, // Période tarifaire
});

export default mongoose.model("Tarif", TarifSchema);
