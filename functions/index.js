
/**
 * Ce fichier doit être créé dans un projet Firebase Functions séparé.
 * Pour l'utiliser :
 * 1. Initialisez Firebase Functions avec "firebase init functions"
 * 2. Copiez ce code dans le fichier index.js
 * 3. Configurez les paramètres d'email dans le fichier .env ou directement dans la console Firebase
 * 4. Déployez avec "firebase deploy --only functions"
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configuration pour l'envoi d'emails
// Vous devez configurer un service SMTP comme Gmail, SendGrid, etc.
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.password
  }
});

// Adresse email de l'administrateur
const ADMIN_EMAIL = 'infosgowera@gmail.com';

// Fonction pour envoyer un email de notification à l'administrateur
exports.sendAdminNotificationEmail = functions.https.onCall(async (data, context) => {
  const { radioName, submitterId, suggestionId } = data;

  // Vérifier si les données nécessaires sont présentes
  if (!radioName || !submitterId || !suggestionId) {
    throw new functions.https.HttpsError(
      'invalid-argument', 
      'Les informations requises sont manquantes.'
    );
  }

  // Créer le mail
  const mailOptions = {
    from: `GOWERA <noreply@gowera.com>`,
    to: ADMIN_EMAIL,
    subject: `Nouvelle suggestion de radio: ${radioName}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #4338ca;">Nouvelle suggestion de radio</h2>
        <p>Une nouvelle radio a été suggérée sur la plateforme GOWERA et nécessite votre validation.</p>
        <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-left: 4px solid #4338ca;">
          <p><strong>Nom de la radio:</strong> ${radioName}</p>
          <p><strong>Suggérée par:</strong> ${submitterId}</p>
          <p><strong>ID de la suggestion:</strong> ${suggestionId}</p>
        </div>
        <p>Pour valider cette radio, veuillez vous connecter au <a href="https://gowera.app/pending-radios" style="color: #4338ca; text-decoration: none; font-weight: bold;">panneau d'administration</a>.</p>
        <p style="margin-top: 30px; font-size: 12px; color: #666;">Ce message a été envoyé automatiquement, merci de ne pas y répondre.</p>
      </div>
    `
  };

  try {
    await mailTransport.sendMail(mailOptions);
    console.log('Email de notification envoyé à l\'administrateur');
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw new functions.https.HttpsError('internal', 'Erreur lors de l\'envoi de l\'email.');
  }
});

// Cette fonction est une alternative qui s'exécute automatiquement à chaque création de document
// Décommentez si vous préférez une approche basée sur les événements plutôt que sur les appels explicites
/*
exports.onNewRadioSuggestion = functions.firestore
  .document('radioSuggestions/{suggestionId}')
  .onCreate(async (snap, context) => {
    const suggestionData = snap.data();
    const suggestionId = context.params.suggestionId;
    
    // Ne pas envoyer de notification si la radio est déjà validée
    if (suggestionData.sponsored) {
      return null;
    }
    
    const mailOptions = {
      from: `GOWERA <noreply@gowera.com>`,
      to: ADMIN_EMAIL,
      subject: `Nouvelle suggestion de radio: ${suggestionData.radioName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4338ca;">Nouvelle suggestion de radio</h2>
          <p>Une nouvelle radio a été suggérée sur la plateforme GOWERA et nécessite votre validation.</p>
          <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-left: 4px solid #4338ca;">
            <p><strong>Nom de la radio:</strong> ${suggestionData.radioName}</p>
            <p><strong>Suggérée par:</strong> ${suggestionData.senderEmail}</p>
            <p><strong>ID de la suggestion:</strong> ${suggestionId}</p>
          </div>
          <p>Pour valider cette radio, veuillez vous connecter au <a href="https://gowera.app/pending-radios" style="color: #4338ca; text-decoration: none; font-weight: bold;">panneau d'administration</a>.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #666;">Ce message a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
      `
    };
    
    try {
      await mailTransport.sendMail(mailOptions);
      console.log('Email de notification envoyé à l\'administrateur');
      return null;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return null;
    }
  });
*/
