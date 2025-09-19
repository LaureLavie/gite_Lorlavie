export function calculPrixReservation(nombrePersonnes, nuits, personnesSupplementaires = 0, options = {}) {
  const tarifs = [65, 75, 85, 95, 105, 115];
  let prixTotal = tarifs[nombrePersonnes - 1] * nuits;
  if (options.menage) prixTotal += 30;
  prixTotal += personnesSupplementaires * 30;
  return prixTotal;
}