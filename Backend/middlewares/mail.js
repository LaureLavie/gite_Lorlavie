import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const EMAIL_STYLE = `
  font-family: Montserrat, sans-serif;
  color: black;
  text-align: center;
  padding: 1rem;
  background: #7a5c43;
  `;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// Fonction utilitaire pour envoyer un email via le service Gmail, avec authentification par variables d'environnement.
export const sendMail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

// Génère le contenu HTML pour l'email d'activation de compte.
export const htmlActivateAccount = (surname, link) => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <title>Activation de compte</title>
      </head>
      <body style="${EMAIL_STYLE}">
        <h1>Bienvenue ${surname} au Gîte Lorlavie !</h1>
        <p>Pour activer votre compte administrateur, veuillez cliquer sur le lien ci-dessous :</p>
        <a href="${link}" style="background-color: #EAE7DD; color: black; padding: 1rem; text-decoration: none; border-radius: 50px; display: inline-block; margin: 2rem;">Activer mon compte</a>
        <p>Merci</p>
      </body>
    </html>
  `;
};

// Génère le contenu HTML pour l'email de réinitialisation de mot de passe.
export const htmlResetPassword = (surname, link) => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <title>Réinitialisation du mot de passe</title>
      </head>
      <body style="${EMAIL_STYLE}">
        <h1>Réinitialisation de votre mot de passe</h1>
        <p>Bonjour ${surname},</p>
        <p>Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien ci-dessous :</p>
        <a href="${link}" style="background-color: #EAE7DD; color: black; padding: 1rem; text-decoration: none; border-radius: 50px; display: inline-block; margin: 2rem;">Réinitialiser mon mot de passe</a>
        <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer ce message.</p>
      </body>
    </html>
  `;
};

// Génère le contenu HTML pour l'email de confirmation de réservation.
export const htmlReceiptTemplate = (Confirmation) => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <title>Votre confirmation de réservation</title>
      </head>
      <body style="${EMAIL_STYLE}">
        <h2>Confirmation de réservation – ${Confirmation.client}</h2>
        <p><strong>Date d'arrivée :</strong> ${Confirmation.dateArrivee}</p>
        <p><strong>Date de départ :</strong> ${Confirmation.dateDepart}</p>
        <p><strong>Nombre de personnes :</strong> ${
          Confirmation.nombrePersonnes
        }</p>
        <p><strong>Prix total :</strong> ${Confirmation.prixTotal} €</p>
        <p><strong>Statut de la réservation :</strong> ${
          Confirmation.statut
        }</p>
        <p><strong>Date :</strong> ${new Date().toLocaleDateString()}</p>
      </body>
    </html>
  `;
};

export const htmlReservationEnAttente = (reservation, client) => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <title>Réservation en attente</title>
      </head>
      <body style="${EMAIL_STYLE}">
        <h2>Bonjour ${client.surname},</h2>
        <p>Votre demande de réservation au Gîte Lorlavie a bien été reçue.</p>
        <p><strong>Date d'arrivée :</strong> ${reservation.dateArrivee}</p>
        <p><strong>Date de départ :</strong> ${reservation.dateDepart}</p>
        <p><strong>Nombre de personnes :</strong> ${reservation.nombrePersonnes}</p>
        <p><strong>Prix total :</strong> ${reservation.prixTotal} €</p>
        <p>Votre réservation est en attente de validation par l'administrateur.</p>
        <p>Vous recevrez un email dès qu'elle sera confirmée.</p>
        <p>Merci et à bientôt !</p>
      </body>
    </html>
  `;
};

// Fonction pour l'email de confirmation
export const htmlReservationConfirmee = (reservation, client) => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <title>Réservation confirmée</title>
      </head>
      <body style="font-family: Montserrat, sans-serif; color: black; text-align: center; padding: 1rem; background: #7a5c43;">
        <h2>Bonjour ${client.surname},</h2>
        <p>Votre réservation au Gîte Lorlavie a été <strong>confirmée</strong> !</p>
        <div style="background: white; padding: 2rem; margin: 2rem auto; max-width: 500px; border-radius: 10px;">
          <p><strong>Date d'arrivée :</strong> ${new Date(
            reservation.dateArrivee
          ).toLocaleDateString("fr-FR")}</p>
          <p><strong>Date de départ :</strong> ${new Date(
            reservation.dateDepart
          ).toLocaleDateString("fr-FR")}</p>
          <p><strong>Nombre de personnes :</strong> ${
            reservation.nombrePersonnes
          }</p>
          <p><strong>Prix total :</strong> ${reservation.prixTotal} €</p>
          <p><strong>Mode de paiement :</strong> ${reservation.modePaiement}</p>
        </div>
        <p>Nous avons hâte de vous accueillir !</p>
        <p>L'équipe du Gîte Lorlavie</p>
      </body>
    </html>
  `;
};

// Fonction pour l'email de refus
export const htmlReservationRefusee = (reservation, client, raison) => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <title>Concernant votre réservation</title>
      </head>
      <body style="font-family: Montserrat, sans-serif; color: black; text-align: center; padding: 1rem; background: #7a5c43;">
        <h2>Bonjour ${client.surname},</h2>
        <p>Nous sommes désolés de vous informer que votre demande de réservation ne peut être acceptée.</p>
        <div style="background: white; padding: 2rem; margin: 2rem auto; max-width: 500px; border-radius: 10px;">
          <p><strong>Raison :</strong> ${raison || "Non spécifiée"}</p>
        </div>
        <p>N'hésitez pas à nous contacter pour plus d'informations.</p>
        <p>L'équipe du Gîte Lorlavie</p>
      </body>
    </html>
  `;
};

// Fonction pour l'email de modification
export const htmlReservationModifiee = (reservation, client) => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <title>Réservation modifiée</title>
      </head>
      <body style="font-family: Montserrat, sans-serif; color: black; text-align: center; padding: 1rem; background: #7a5c43;">
        <h2>Bonjour ${client.surname},</h2>
        <p>Votre réservation au Gîte Lorlavie a été modifiée.</p>
        <div style="background: white; padding: 2rem; margin: 2rem auto; max-width: 500px; border-radius: 10px;">
          <p><strong>Nouvelles dates :</strong></p>
          <p><strong>Date d'arrivée :</strong> ${new Date(
            reservation.dateArrivee
          ).toLocaleDateString("fr-FR")}</p>
          <p><strong>Date de départ :</strong> ${new Date(
            reservation.dateDepart
          ).toLocaleDateString("fr-FR")}</p>
          <p><strong>Nombre de personnes :</strong> ${
            reservation.nombrePersonnes
          }</p>
          <p><strong>Prix total :</strong> ${reservation.prixTotal} €</p>
        </div>
        <p>L'équipe du Gîte Lorlavie</p>
      </body>
    </html>
  `;
};

// Fonction pour envoyer le mail de contact
export async function sendContactMail(nom, mail, message) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Nouveau message de contact - ${nom}`,
    html: `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8" />
          <title>Nouveau message de contact</title>
        </head>
        <body style="${EMAIL_STYLE}">
          <h2>Nouveau message de contact</h2>
          <div style="background: white; padding: 2rem; margin: 2rem auto; max-width: 500px; border-radius: 10px; color: black;">
            <p><strong>Nom :</strong> ${nom}</p>
            <p><strong>Email :</strong> ${mail}</p>
            <p><strong>Message :</strong></p>
            <p style="text-align: left; padding: 1rem; background: #f5f5f5; border-radius: 5px;">${message}</p>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email de contact envoyé avec succès");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de contact:", error);
    throw error;
  }
}
