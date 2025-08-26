import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true },
  telephone: { type: String },
  adresseComplete: {
    adresse: { type: String, required: true },
    ville: { type: String, required: true },
    codePostal: { type: String, required: true },
    pays: { type: String, required: true },
  },
  modePaiement: {
    type: String,
    enum: ["carte", "espece", "en ligne"],
    required: true,
  },
});

export default mongoose.model("Client", ClientSchema);
