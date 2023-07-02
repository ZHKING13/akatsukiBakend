const { Telegraf, session, Scenes, Composer } = require('telegraf');
const { Stage, WizardScene } = Scenes;
const { message } = require('telegraf/filters');
const { enter, leave } = Stage;
const menu = require('./menu');
const bot = new Telegraf(process.env.BOT_TOKEN);
const userModel = require('./Models/user');
const confirmScene = require('./ConfirmeStage');
const cancelScene = require('./CancelStage');

bot.use(session());
const stage = new Stage([confirmScene, cancelScene])
bot.use(stage.middleware());
bot.start((ctx) => ctx.reply('bienvenu sur notre bot de gestion des verification de  paiement vous recevrez un message dès qu une personne fait une demande de verification'));
bot.action('confirmer ✅', (ctx) => {
    ctx.scene.enter('valider');
})
bot.action('Annuler ❌', (ctx) => {
    ctx.scene.enter('annuler');
})
bot.hears('statistique 📊', async(ctx) => {
    const vipUser = await userModel.find({ isPremium: true });
    let totalusers = await userModel.find();
    ctx.reply(`voici les statistique de votre base de donnée \n <b>total utilisateur</b> : <b>${totalusers.length}</b> \n <b>nombre de VIP</b>: ${vipUser.length}`)
})
bot.hears('valider Achat ✅', async(ctx) => {
    ctx.scene.enter('valider');
})
bot.hears('Annuler achat ❌', async(ctx) => {
    ctx.scene.enter('annuler');
})

bot.on(message("text"), ctx => menu(ctx));
module.exports = bot;
bot.launch(console.log('bot is running'));
bot.catch(err => console.error(err));
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));