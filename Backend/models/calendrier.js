import mongoose from "mongoose";

/**
 * Modèle CalendrierStatus
 * - Gère les statuts de chaque date du calendrier
 * - Permet à l'admin de bloquer des dates
 * - Lie les dates réservées aux réservations
 */
const CalendrierStatusSchema = new mongoose.Schema({
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
CalendrierStatusSchema.index({ statut: 1, date: 1 });

// Méthodes statiques utiles
CalendrierStatusSchema.statics.getDatesDisponibles = async function (
  dateDebut,
  dateFin
) {
  const dates = await this.find({
    date: { $gte: dateDebut, $lte: dateFin },
    statut: { $ne: "disponible" },
  });

  // Retourne les dates NON disponibles
  return dates.map((d) => d.date);
};

CalendrierStatusSchema.statics.verifierDisponibilite = async function (
  dateArrivee,
  dateDepart
) {
  const debut = new Date(dateArrivee);
  const fin = new Date(dateDepart);

  // Vérifier qu'aucune date dans la période n'est bloquée ou réservée
  const datesOccupees = await this.find({
    date: { $gte: debut, $lt: fin }, // $lt car la date de départ n'est pas incluse
    statut: { $in: ["reserve", "bloque"] },
  });

  return datesOccupees.length === 0;
};

CalendrierStatusSchema.statics.bloquerPeriode = async function (
  dateDebut,
  dateFin,
  reservationId = null
) {
  const debut = new Date(dateDebut);
  const fin = new Date(dateDepart);
  const statut = reservationId ? "reserve" : "bloque";

  const dates = [];
  for (let d = new Date(debut); d < fin; d.setDate(d.getDate() + 1)) {
    dates.push({
      date: new Date(d),
      statut: statut,
      ...(reservationId && { reservationId: reservationId }),
    });
  }

  // Upsert : met à jour si existe, créé sinon
  await Promise.all(
    dates.map((dateObj) =>
      this.findOneAndUpdate({ date: dateObj.date }, dateObj, { upsert: true })
    )
  );
};

CalendrierStatusSchema.statics.libererPeriode = async function (
  dateDebut,
  dateFin
) {
  await this.updateMany(
    {
      date: { $gte: new Date(dateDebut), $lt: new Date(dateFin) },
    },
    {
      $set: {
        statut: "disponible",
        $unset: { reservationId: "", notes: "" },
      },
    }
  );
};

export default mongoose.model("CalendrierStatus", CalendrierStatusSchema);
