import nodemailer from "nodemailer";

/**
 * Middleware d'envoi d'email via Nodemailer
 * - Utilise le service Gmail avec authentification sécurisée (variables d'environnement)
 * - Permet d'envoyer des emails transactionnels (confirmation réservation, notifications)
 * - Conforme RGPD : aucune donnée sensible en dur, tout est dans .env
 *
 * Sécurité :
 * - Les identifiants ne sont jamais exposés dans le code source
 * - Les erreurs d'envoi sont gérées et loguées pour audit
 */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Email expéditeur stocké en variable d'environnement
    pass: process.env.EMAIL_PASS, // Mot de passe sécurisé
  },
});

/**
 * Fonction utilitaire pour envoyer un email
 * @param {string} to - Adresse email du destinataire
 * @param {string} subject - Sujet de l'email
 * @param {string} html - Contenu HTML du message
 * @returns {Promise<void>} - Résout si l'email est envoyé, rejette sinon
 */
export const sendMail = async (to, subject, html) => {
  try {
    // Validation basique des paramètres
    if (!to || !subject || !html) {
      throw new Error("Paramètres email manquants");
    }
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
  } catch (error) {
    // Log de sécurité pour audit et traçabilité
    console.error("Erreur d'envoi d'email :", error.message);
    throw error; // Permet au contrôleur d'afficher une erreur claire à l'utilisateur
  }
};
