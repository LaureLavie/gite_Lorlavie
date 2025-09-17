import mongoose from "mongoose";

/**
 * Modèle Client
 * - Stocke les informations des clients ayant réservé
 * - RGPD : aucune donnée sensible en clair
 * - Validation stricte des champs
 */
const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nom du client
  surname: { type: String, required: true }, //Prénom du client
  email: { type: String, required: true }, // Email du client
  telephone: { type: String }, // Téléphone (optionnel)
  adresseComplete: {
    adresse: { type: String, required: true },
    ville: { type: String, required: true },
    codePostal: { type: String, required: true },
    pays: { type: String, required: true },
  }, // Adresse complète structurée

});

export default mongoose.model("Client", ClientSchema);
