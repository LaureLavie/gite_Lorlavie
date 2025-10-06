import Reservation from "../models/reservation.js";

export function calculerNombreNuits(dateArrivee, dateDepart) {
  // Retourne : entier = nombre de nuits entre arrivée et départ
  const arrivee = new Date(dateArrivee);
  const depart = new Date(dateDepart);
  return Math.ceil((depart - arrivee) / (1000 * 60 * 60 * 24));
  // Logique :
  // - depart - arrivee donne la durée en millisecondes
  // - division par 1000*60*60*24 convertit en jours
  // - Math.ceil arrondit à l'entier supérieu
}
export function peutEtreModifiee(reservation) {
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
  // data : objet contenant les champs conformes au schema Reservation.
  return Reservation.create(data);
}
