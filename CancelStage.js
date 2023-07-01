const { Telegraf, session, Scenes, Composer } = require('telegraf');
const { Stage, WizardScene } = Scenes;
const { enter, leave } = Stage;
const { Keyboard } = require('telegram-keyboard');
const menu = require('./menu');
const sendEmail = require('./util/sendMail');
let userEmail
const cancelScene = new WizardScene('annuler', async(ctx) => {
    await ctx.reply(` 
  entrez l'email de l'utilisateur dont vous souhaitez signaler l'invalidation de l'achat
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
    await ctx.reply(` 
    appuyez sur le bouton pour confirmer pour envoyer l'email d'invalidation d'achat à \n
    <b>${userEmail}</b> 
    ou  /reset pour annuler le processus
   
        `, Keyboard.reply('confirmé ✅', {}, { parse_mode: 'HTML' }))
    return ctx.wizard.next()
}, new Composer().hears(
    'confirmé ✅', async(ctx) => {
        const mailOptions = {
            from: AUTH_MAIL,
            to: userEmail,
            subject: '❌Achat invalide',
            html: `<p>les données fournir ne nous ont malheureusement pas permis de verifier votre achat \n
            si vous pensez qu'il s'agit d'une erreur merci de repondre à ce mail en fournissant le numero utilisé pour le payement 
             </p>
                `
        }
        await sendEmail(mailOptions)
        ctx.telegram.sendChatAction(ctx.chat.id, 'typing');
        await ctx.reply(`✅✅l'email d'invalidation a bien été envoyer à <b>${userEmail}✅✅</b>  `, {...Keyboard.remove(), parse_mode: 'HTML' }, );
        return menu(ctx)
    }
))
confirmScene.command('reset', async(ctx) => {
    ctx.scene.leave();
    return menu(ctx)
})
module.exports = cancelScene;