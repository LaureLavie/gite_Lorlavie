/**
 * Contrôleur Tarif
 * Gère toutes les opérations CRUD et le calcul automatique des tarifs pour le site.
 * Respecte le modèle MVC, la validation des données, la sécurité et la clarté pour la certification.
 */

import Tarif from "../models/tarif.js";

/**
 * Créer un tarif
 * - Validation des champs requis (dates, nombrePersonnes, prixNuit, période)
 * - Création en base MongoDB
 * - Retourne le tarif créé
 */
export const createTarif = async (req, res) => {
  try {
    const { dateArrivee, dateDepart, nombrePersonnes, prixNuit, periode } =
      req.body;
    // Validation des champs obligatoires
    if (
      !dateArrivee ||
      !dateDepart ||
      typeof nombrePersonnes !== "number" ||
      typeof prixNuit !== "number" ||
      !periode
    ) {
      return res
        .status(400)
        .json({ error: "Tous les champs requis doivent être renseignés" });
    }
    const tarif = await Tarif.create(req.body);
    res.status(201).json(tarif);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Lire tous les tarifs
 * - Utilisé pour l'interface d'administration
 */
export const getTarifs = async (req, res) => {
  try {
    const tarifs = await Tarif.find();
    res.json(tarifs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lire un tarif par ID
 * - Permet d'afficher les détails d'un tarif
 */
export const getTarifById = async (req, res) => {
  try {
    const tarif = await Tarif.findById(req.params.id);
    if (!tarif) return res.status(404).json({ error: "Tarif non trouvé" });
    res.json(tarif);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Modifier un tarif
 * - Met à jour les informations du tarif
 * - Validation des champs si besoin
 */
export const updateTarif = async (req, res) => {
  try {
    // Optionnel : valider les champs modifiés ici
    const tarif = await Tarif.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!tarif) return res.status(404).json({ error: "Tarif non trouvé" });
    res.json(tarif);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Supprimer un tarif
 * - Supprime le tarif de la base
 */
export const deleteTarif = async (req, res) => {
  try {
    const tarif = await Tarif.findByIdAndDelete(req.params.id);
    if (!tarif) return res.status(404).json({ error: "Tarif non trouvé" });
    res.json({ message: "Tarif supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Calcul automatique du tarif
 * - Calcule le prix total selon les dates, le nombre de personnes et la période
 * - Vérifie la cohérence des dates et la présence du tarif
 * - Retourne le prix total, le nombre de nuits et le tarif utilisé
 */
export const calculerTarif = async (req, res) => {
  try {
    const { dateArrivee, dateDepart, nombrePersonnes, periode } = req.body;
    // Validation des champs
    if (
      !dateArrivee ||
      !dateDepart ||
      typeof nombrePersonnes !== "number" ||
      !periode
    ) {
      return res
        .status(400)
        .json({ error: "Champs requis manquants ou invalides" });
    }
    // Vérification cohérence des dates
    const debut = new Date(dateArrivee);
    const fin = new Date(dateDepart);
    if (isNaN(debut) || isNaN(fin) || debut >= fin) {
      return res.status(400).json({ error: "Dates invalides" });
    }
    // Recherche du tarif correspondant
    const tarif = await Tarif.findOne({ nombrePersonnes, periode });
    if (!tarif) return res.status(404).json({ error: "Tarif non trouvé" });

    // Calcul du nombre de nuits
    const nbNuits = Math.ceil((fin - debut) / (1000 * 60 * 60 * 24));
    const prixTotal = tarif.prixNuit * nbNuits;

    res.json({ prixTotal, nbNuits, tarif });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
