import Reservation from "../models/reservation.js";
// Import du modèle Mongoose `Reservation`
// utilisé par `creerReservation` si on veut créer un document via le service.
// Les utilitaires purs n'ont pas besoin du modèle, mais l'orchestration peut s'en servir.

export function calculerNombreNuits(dateArrivee, dateDepart) {
  // Entrées : dateArrivee, dateDepart (string ou Date)
  // Retourne : entier = nombre de nuits entre arrivée et départ
  const arrivee = new Date(dateArrivee);
  const depart = new Date(dateDepart);
  return Math.ceil((depart - arrivee) / (1000 * 60 * 60 * 24));
  // Logique :
  // - depart - arrivee donne la durée en millisecondes
  // - division par 1000*60*60*24 convertit en jours
  // - Math.ceil arrondit à l'entier supérieur (pour gérer fractions de jour)
  // Remarque : selon la convention métier, on pourrait utiliser Math.floor si on
  // souhaite compter les nuits complètes. Ici on utilise `ceil` comme dans l'implémentation.
}

export function peutEtreModifiee(reservation) {
  // Entrée : reservation (document mongoose ou plain object)
  // But : retourner booléen si la réservation peut être modifiée par l'admin ou client
  const statut =
    reservation?.statut ||
    (reservation?.toObject ? reservation.toObject().statut : undefined);
  // On récupère `statut` soit directement (objet), soit via toObject() (document mongoose)
  return statut === "En Attente" || statut === "Confirmee";
  // On autorise la modification uniquement si la réservation est en attente ou confirmée.
  // Si elle est annulée/refusée, on refuse les modifications.
}

export async function creerReservation(data) {
  // Orchestration minimale : création d'une réservation en base.
  // data : objet contenant les champs conformes au schema Reservation.
  return Reservation.create(data);
  // Retourne le document créé (Promise).
  // Note : cette fonction peut être étendue pour faire :
  // - validation business (prix recalculé serveur)
  // - bloquer la période dans le calendrier (via calendrierService)
  // - envoyer des emails (via mail middleware)
  // Je l'ai laissé volontairement simple pour que le controller conserve la logique d'orchestration actuelle.
}
