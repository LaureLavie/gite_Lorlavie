import mongoose from "mongoose";

const TarifSchema = new mongoose.Schema({
  dateArrivee: { type: Date, required: true },
  dateDepart: { type: Date, required: true },
  nombrePersonnes: { type: Number, required: true },
  prixNuit: { type: Number, required: true },
  periode: { type: String, enum: ["haute", "basse"], required: true },
});

export default mongoose.model("Tarif", TarifSchema);
