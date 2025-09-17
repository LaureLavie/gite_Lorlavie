import Client from "../models/client.js";

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

//Ajouter un nouveau client
export const createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Modifier un client existant
export const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!client) return res.status(404).json({ error: "Client non trouvé" });
    res.json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Supprimer un client
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ error: "Client non trouvé" });
    res.json({ message: "Client supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};