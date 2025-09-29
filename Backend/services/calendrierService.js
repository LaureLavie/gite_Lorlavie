import CalendrierStat from "../models/calendrier.js";
// import : on importe le modèle Mongoose `CalendrierStat` pour lire/écrire
// dans la collection qui stocke l'état (statut) de chaque date.
// Utilisé pour effectuer des requêtes (find, updateMany, findOneAndUpdate).

/**
 * Service pour la logique du calendrier. Correspond aux méthodes statiques
 * extraites du modèle pour faciliter les tests et l'orchestration.
 */

export async function getDatesDisponibles(dateDebut, dateFin) {
  // Entrée : dateDebut (Date ou string), dateFin (Date ou string)
  // But : récupérer les dates qui NE SONT PAS disponibles (statut != 'disponible')
  // Utiliser borne supérieure exclusive : [dateDebut, dateFin]
  const df = new Date(dateFin);
  df.setDate(df.getDate() + 1);
  const dates = await CalendrierStat.find({
    date: { $gte: dateDebut, $lt: df },
    statut: { $ne: "disponible" },
  });
  // `dates` : tableau de documents CalendrierStat correspondant à la période

  return dates.map((d) => d.date);
  // Retourne seulement les champs `date` (objets Date) des documents trouvés.
  // Usage typique : afficher quelles dates sont occupées pour un mois.
}

export async function verifierDisponibilite(dateArrivee, dateDepart) {
  // Entrées : dateArrivee, dateDepart (peuvent être strings ISO ou Date)
  // But : vérifier si aucune date entre [debut, fin) n'est réservée ou bloquée.
  const debut = new Date(dateArrivee);
  const fin = new Date(dateDepart);

  const datesOccupees = await CalendrierStat.find({
    date: { $gte: debut, $lt: fin },
    statut: { $in: ["reserve", "bloque"] },
  });
  // Requête : retourne les documents dont la date est dans l'intervalle et dont
  // le statut est 'reserve' ou 'bloque'. On utilise `$lt` pour exclure la date de départ.

  return datesOccupees.length === 0;
  // Si aucun document n'est retourné, la période est libre => true.
  // Sinon false (il y a au moins une date occupée).
}

export async function bloquerPeriode(
  dateDebut,
  dateFin,
  reservationId = null,
  options = {}
) {
  // Entrées :
  // - dateDebut, dateFin : intervalle [debut, fin)
  // - reservationId : si fourni, le blocage représente une réservation (statut 'reserve')
  // - options : objet optionnel { notes, modifiePar, ... }
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);
  const statut = reservationId ? "reserve" : "bloque";
  // Si on a un reservationId, on marque les dates comme 'reserve', sinon 'bloque'.

  const dates = [];
  for (let d = new Date(debut); d < fin; d.setDate(d.getDate() + 1)) {
    // Itération jour par jour : on construit un objet par date du début (inclu) au jour avant fin.
    dates.push({
      date: new Date(d),
      statut: statut,
      ...(reservationId && { reservationId: reservationId }),
      ...(options.notes && { notes: options.notes }),
      ...(options.modifiePar && { modifiePar: options.modifiePar }),
      dateModification: new Date(),
    });
    // Chaque objet contient :
    // - date : Date
    // - statut : 'reserve' ou 'bloque'
    // - reservationId : si existant (référence à la réservation)
    // - notes, modifiePar : métadonnées admin optionnelles
    // - dateModification : timestamp de la modification
  }

  await Promise.all(
    dates.map((dateObj) =>
      CalendrierStat.findOneAndUpdate({ date: dateObj.date }, dateObj, {
        upsert: true,
      })
    )
  );
  // Pour chaque date construite, on fait un upsert :
  // - findOneAndUpdate({ date }, dateObj, { upsert: true })
  // => met à jour l'entrée si elle existe, sinon la crée.
  // Promise.all pour exécuter toutes les opérations en parallèle (perf).

  // Retourner le tableau des dates affectées (objets Date) afin que l'appelant
  // puisse connaître précisément quelles dates ont été créées / mises à jour.
  return dates.map((d) => d.date);
}

export async function libererPeriode(dateDebut, dateFin) {
  // But : remettre le statut 'disponible' pour toutes les dates de l'intervalle.
  await CalendrierStat.updateMany(
    {
      date: { $gte: new Date(dateDebut), $lt: new Date(dateFin) },
    },
    {
      $set: {
        statut: "disponible",
        dateModification: new Date(),
      },
      $unset: { reservationId: "", notes: "" },
    }
  );
  // updateMany applique l'opération à tous les documents correspondant :
  // - $set statut = 'disponible'
  // - $unset reservationId et notes (on supprime ces champs s'ils existaient)
  // Note : dateModification n'est pas mise à jour ici (peut être utile d'ajouter).
}
