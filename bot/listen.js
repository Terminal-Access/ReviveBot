const refresh = require('./lib/refresh');
const bot = require('./bot.js');
const settings = require('./../settings.json');
const modules = require('./modules.js');
const Message = require('./../orm/Message')
const commands = require('./commands');
const request = require('request-promise-native');
let lock = false;
bot.on('error', (err) => {
    /**
     * Catch errors here
     */
    console.log("Stack Trace: " + err.stack);
})
process.on('unhandledRejection', (err) => {
    console.log("UNHANDLED REJECTION AT " + err.stack);
    if (err.toString().includes('Request to use token, but token was unavailable to the client'))
        process.exit();//restart
});
process.on('uncaughtException', (err) => console.log("UNHANDLED EXCEPTION AT " + err.stack));
bot.on('message', (message) => {
    /**
     * if locked, reject everything except dm
     */

    new Message({
        messageID: message.id,
        channel: message.channel.id
    }).save();
    if (message.author.bot) return;
    if (lock) {
        if (!settings.owners.includes(message.author.id))
            //  if (message.channel.guild)
            return;//not DM
    }
    /**
     * Listen to messages and convert into params
     */
    if (message.content.startsWith(settings.identifier)) {
        /**Extracting params */
        let params = message.content.substring(settings.identifier.length).trim();
        params = params.split(settings.delimiter || ' ');
        let cmd = params.shift().trim();
        commands.execute(cmd.toLowerCase(), params, message)
    }
    else if (message.isMentioned(bot.user)) {
        /**remove mentions and then get params */
        let params = message.cleancontent.trim().replace(bot.user.toString(), "").trim();
        params = params.split(settings.delimiter || ' ');
        let cmd = params.shift.trim();
        commands.execute(cmd.toLowerCase(), params, message)
    }
    else {
        //ignore because normal message
    }
});
bot.on('lock', () => { lock = true; });
bot.on('unlock', () => { lock = false; });
bot.on("guildMemberAdd", async function (member) {
    var user = member.user;
    if (member.guild.id === "184536578654339072") {
        if (member.user.bot) return console.log(member.user.tag + " is a bot who joined " + member.guild.name)
        user.send("Welcome to the Revive Network");
        if (! await refresh(user)) {
            await member.addRole(bot.guilds.get("184536578654339072").roles.get("317854639431221248"));
            const ma = await bot.channels.get("317859245309689856").send(user.toString() + "Type `accept` to continue. You will be kicked if you don't type `accept` within 10 minutes");
            ma.delete();
            // Await !vote messages
            const filter = (message) => {
                if (message.author.id === member.user.id)
                {
                    message.delete();
                    if (message.content.toLowerCase().includes("accept") && message.member.roles.get("317854639431221248")) {
                        message.member.removeRole("317854639431221248");
                        return message;
                    }
                }
            }
            // Errors: ['time'] treats ending because of the time limit as an error
            bot.channels.get("317859245309689856").awaitMessages(filter, { max: 1, time: 600000, errors: ['time'] })
                .then(collected => {
                    if (collected.size < 1  && !message.member.roles.get("317854639431221248")) {
                        member.kick();
                    }
                    return collected;
                })

        }
    }
});/**
bot.on('disconnect', function(event) {
    if (event.code === 0) return console.error(event);
    process.exit();//force restart
});*/

bot.on('ready', () => {
    console.log("ReviveBot Ready");
});
bot.on("guildMemberUpdate", async function (member, newMem) {
    let user = member.user;
    if (member.guild && (member.guild.id === "184536578654339072")) {
        let oldMem = member;
        if (!oldMem.roles.has("273105185566359562") && newMem.roles.has("273105185566359562")) return;
        if (!oldMem.roles.has("275317218911322112") && newMem.roles.has("275317218911322112")) return;
        if ((!oldMem.roles.has("184684916833779712") && newMem.roles.has("184684916833779712")) || (!oldMem.roles.has("200849956796497920") && newMem.roles.has("200849956796497920")) || (!oldMem.roles.has("184676864630063104") && newMem.roles.has("184676864630063104")) || (!oldMem.roles.has("286646245198528523") && newMem.roles.has("286646245198528523"))) {
            await request('http://revive-bot-discord.revive.systems/v0/discord/reverse_link/' + user.id);
        }
    }
});
