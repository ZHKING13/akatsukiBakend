const { Telegraf, session, Scenes, Composer } = require('telegraf');
const { Stage, WizardScene } = Scenes;
const { enter, leave } = Stage;
const { Keyboard } = require('telegram-keyboard');
const { AUTH_MAIL } = process.env
const menu = require('./menu');
const sendEmail = require('./util/sendMail');
let userEmail
let documentLink
const confirmScene = new WizardScene('valider', async(ctx) => {
    await ctx.reply(` 
  entrez l'email de l'utilisateur dont vous souhaitez confirmer l'achat
    `, { parse_mode: 'HTML' })
    return ctx.wizard.next()
}, async(ctx) => {
    ctx.telegram.sendChatAction(ctx.chat.id, 'typing');
    userEmail = ctx.message.text;
    // verifier si ces un mail valider avec regex
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!regex.test(userEmail)) {
        return ctx.reply(`entrer un email valide`);
    }
    await ctx.reply(` 
  entrez le lien du document 
    `, { parse_mode: 'HTML' })
    return ctx.wizard.next()
}, async(ctx) => {
    ctx.telegram.sendChatAction(ctx.chat.id, 'typing');
    documentLink = ctx.message.text;
    // verifier si ces un lien valider avec regex

    if (!documentLink) {
        return ctx.reply(`entrer un lien valide`);
    }

    await ctx.reply(` 
    appuyez sur le bouton pour confirmer l'achat du document par \n
    <b>${userEmail}</b> 
    ou  /reset pour annuler le processus
   
        `, Keyboard.reply('confirmé ✅', {}, { parse_mode: 'HTML' }))
    return ctx.wizard.next()
}, new Composer().hears(
    'confirmé ✅', async(ctx) => {
        ctx.telegram.sendChatAction(ctx.chat.id, 'typing');
        const mailOptions = {
            from: AUTH_MAIL,
            to: userEmail,
            subject: '✅Confirmation de l\'achat du document',
            html: `<p>votre achat a bien été validé le document est diponible au lien suivant </p>
                <p style="color:tomato; font-size:25px;"> <b>${documentLink}</b> </p>`
        }
        ctx.telegram.sendChatAction(ctx.chat.id, 'typing');

        await sendEmail(mailOptions)
        ctx.telegram.sendChatAction(ctx.chat.id, 'typing');
        await ctx.reply(`✅✅l'email contenant le lien du document a bien été envoyer à <b>${userEmail}✅✅</b>  `, {...Keyboard.remove(), parse_mode: 'HTML' }, );
        return menu(ctx)
    }
))
confirmScene.command('reset', async(ctx) => {
    ctx.scene.leave();
    return menu(ctx)
})
module.exports = confirmScene;