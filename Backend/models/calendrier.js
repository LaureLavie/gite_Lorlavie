import mongoose from "mongoose";

/**
 * Modèle CalendrierStat
 * - Gère les statuts de chaque date du calendrier
 * - Permet à l'admin de bloquer des dates
 * - Lie les dates réservées aux réservations
 */
const CalendrierStatSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true, // Une seule entrée par date
  },

  statut: {
    type: String,
    enum: ["disponible", "reserve", "bloque"],
    default: "disponible",
  },

  // Si la date est réservée, référence à la réservation
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reservation",
    required: function () {
      return this.statut === "reserve";
    },
  },

  // Notes administratives (pourquoi bloquée, etc.)
  notes: { type: String },

  // Qui a fait la modification
  modifiePar: { type: String }, // nom de l'admin
  dateModification: { type: Date, default: Date.now },
});

// Index pour optimiser les requêtes par date
CalendrierStatSchema.index({ statut: 1, date: 1 });

// NOTE: Les méthodes statiques qui effectuent des requêtes et upserts ont été
// déplacées vers Backend/services/calendrierService.js pour séparer la logique
// métier de la définition du schema et faciliter les tests.

export default mongoose.model("CalendrierStat", CalendrierStatSchema);
