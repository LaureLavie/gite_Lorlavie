import mongoose from "mongoose";

/**
 * Modèle Réservation
 * - Stocke chaque réservation effectuée sur le site
 * - Validation stricte des dates et du nombre de personnes
 * - RGPD : lien vers client, pas de données sensibles
 */
const confirmReservationSchema = new mongoose.Schema({
  numero: { type: String, unique: true, required: true },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  dateArrivee: { type: Date, required: true }, // Date d'arrivée
  dateDepart: { type: Date, required: true }, // Date de départ
  nombrePersonnes: { type: Number, required: true, min: 1, max: 6 }, // Nombre de personnes (1 à 6)
  prixTotal: { type: Number, required: true }, // Prix total calculé
  statut: {
    type: String,
    enum: ["Confirmee", "En Attente", "Annulee"],
    default: "En Attente",
  }, // Statut de la réservation
});

export default mongoose.model("ConfirmReservation", confirmReservationSchema);
