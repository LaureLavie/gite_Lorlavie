import nodemailer from "nodemailer";

// Fonction utilitaire pour envoyer un email via le service Gmail, avec authentification par variables d'environnement.
export const sendMail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
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
      <body style="font-family: Montserrat, sans-serif; text-align: center; padding: 20px; background: #7A5C43;">
        <h1>Bienvenue ${surname} au Gîte Lorlavie !</h1>
        <p>Pour activer votre compte administrateur, veuillez cliquer sur le lien ci-dessous :</p>
        <a href="${link}" style="background-color: #EAE7DD; color: black; padding: 10px 20px; text-decoration: none; border-radius: 30px; display: inline-block; margin: 20px 0;">Activer mon compte</a>
        <p>Merci et bonne gestion !</p>
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
      <body style="font-family: Montserrat, sans-serif; text-align: center; padding: 20px; background: #7A5C43;">
        <h1>Réinitialisation de votre mot de passe</h1>
        <p>Bonjour ${surname},</p>
        <p>Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien ci-dessous :</p>
        <a href="${link}" style="background-color: #EAE7DD; color: black; padding: 10px 20px; text-decoration: none; border-radius: 30px; display: inline-block; margin: 20px 0;">Réinitialiser mon mot de passe</a>
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
      <body style="font-family: Montserrat, sans-serif; text-align: center; padding: 20px; background: #7A5C43;">
        <h2 style="color: #007BFF;">Confirmation de réservation – ${
          Confirmation.client
        }</h2>
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
