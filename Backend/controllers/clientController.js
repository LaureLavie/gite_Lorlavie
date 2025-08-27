/**
 * Contrôleur Client
 * Gère toutes les opérations CRUD pour les clients du site.
 * Respecte le modèle MVC, la validation des données, et la clarté pour la certification.
 */

import Client from "../models/client.js";

/**
 * Créer un client
 * - Validation des champs requis (nom, email, adresse, modePaiement)
 * - Création en base MongoDB
 * - Retourne le client créé
 */
export const createClient = async (req, res) => {
  try {
    const { nom, email, adresseComplete, modePaiement } = req.body;
    // Validation des champs obligatoires
    if (
      !nom ||
      !email ||
      !adresseComplete ||
      !adresseComplete.adresse ||
      !adresseComplete.ville ||
      !adresseComplete.codePostal ||
      !adresseComplete.pays ||
      !modePaiement
    ) {
      return res
        .status(400)
        .json({ error: "Tous les champs requis doivent être renseignés" });
    }
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Récupérer tous les clients
 * - Utilisé pour l'interface d'administration
 */
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Récupérer un client par ID
 * - Permet d'afficher les détails d'un client
 */
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ error: "Client non trouvé" });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Modifier un client
 * - Met à jour les informations du client
 * - Validation des champs si besoin
 */
export const updateClient = async (req, res) => {
  try {
    // Optionnel : valider les champs modifiés ici
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!client) return res.status(404).json({ error: "Client non trouvé" });
    res.json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Supprimer un client
 * - Supprime le client de la base
 */
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ error: "Client non trouvé" });
    res.json({ message: "Client supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
