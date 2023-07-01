const { Keyboard } = require('telegram-keyboard');



module.exports = (bot, ctx) => {
    bot.telegram.sendMessage(process.env.CHAT_ID, `vous êtes au menu principal `, {
        reply_markup: {
            keyboard: [
                [

                    { text: 'valider Achat ✅' },
                    { text: 'Annuler achat ❌' },


                ],

                // [
                //     { text: 'statistique 📊' },
                //     { text: '❓ aide ' },
                // ]
            ],
            resize_keyboard: true,
        },
    })
}