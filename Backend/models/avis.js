import mongoose from "mongoose";

/**
 * Modèle Avis Client
 * - Stocke les avis laissés par les clients
 * - Sécurité : modération via champ "valide"
 * - RGPD : aucune donnée sensible, lien vers client
 */
const AvisSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  }, // Référence au client ayant laissé l'avis
  contenu: { type: String, required: true }, // Texte de l'avis
  note: { type: Number, min: 1, max: 5, required: true }, // Note sur 5
  dateCreation: { type: Date, default: Date.now }, // Date de création de l'avis
  valide: { type: Boolean, default: false }, // Modération admin
  reponseAdmin: { type: String }, // Réponse éventuelle de l'admin
  dateReponse: { type: Date }, // Date de la réponse admin
});

export default mongoose.model("Avis", AvisSchema);
