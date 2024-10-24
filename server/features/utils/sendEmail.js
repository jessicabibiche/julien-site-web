import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text }) => {
  try {
    // Configuration du transporteur d'emails avec Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Options de l'email (destinataire, sujet, contenu)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    // Envoyer l'email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email envoyé avec succès :", info.response);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    throw new Error("Erreur lors de l'envoi de l'email");
  }
};

export default sendEmail;
