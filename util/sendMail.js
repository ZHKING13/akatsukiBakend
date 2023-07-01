// send email with nodemailer 
const nodemailer = require('nodemailer');
const { AUTH_MAIL, AUTH_PASS } = process.env
    // Créer un objet transporter
let transporter = nodemailer.createTransport({

    host: 'smtp-mail.outlook.com',
    auth: {
        user: AUTH_MAIL,
        pass: AUTH_PASS
    }
});
transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Le serveur est prêt à prendre notre message');
        console.log(success);
    }

})

// Définir les informations de l'e-mail


// Envoyer l'e-mail
const sendEmail = async(mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
        return
    } catch (error) {
        throw error;
    }

}
module.exports = sendEmail;