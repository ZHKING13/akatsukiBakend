const demandeVip = require('../Models/demandeVip');
const userModel = require('../Models/user');
const axios = require('axios');
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv').config()
const { TOKEN_KEY } = process.env
    //faire une demande vip
const addDemandeVip = async(req, res) => {
    // try catch block
    try {

        const { numero, email, document } = req.body;
        // verifier si le numero est fourni
        if (!numero || !email) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "le numero et l'email sont obligatoire",
            });
        }


        // enregistrer la demande vip
        const newDemandeVip = await demandeVip.create({
                email,
                numero,
            })
            // envoyer la réponse
        const message = `📩📩📩 Nouvelle demande de verification 📩📩📩 :\n document: ${document} \n email : ${email} . \n Numéro : ${numero} \n `;
        const inlineKeyboard = {
            inline_keyboard: [
                [
                    { text: "valider Achat ✅", callback_data: 'confirmer ✅' },
                    { text: "Annuler achat ❌", callback_data: 'Annuler ❌' }
                ],
            ],
        };
        const response = await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
            chat_id: process.env.CHAT_ID,
            text: message,
            reply_markup: inlineKeyboard

        });
        return res.json({
            success: true,
            status: 200,
            message: "demande de verification enregistrée avec succès",
            data: newDemandeVip,

        })


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Échec de l'ajout de la demande VIP",
            error: err.message,
        });
    }
}

//afficher les demandes vip 
const getDemandeVip = async(req, res) => {

    try {
        const demandeVips = await demandeVip.find();
        return res.json({
            success: true,
            status: 200,
            message: "demande vip affichée avec succès",
            data: demandeVips,
        })
    } catch (err) {
        console.log(err)
    }
}
module.exports = {
    addDemandeVip,
    getDemandeVip
}