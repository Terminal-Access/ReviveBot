var bot = require('../bot');
const m2e = require('./../lib/message2embed');
let messageDB = { data: [] };
bot.on('message', message => {
    if (message.author.bot == true) return; // prevent loop
    let attach = '';
    if (message.attachments.size > 0)
    { attach = '\n' + message.attachments.first(); }
    if (message.channel.id == '271350052188979201') {
        bot.channels.get('271349742099759104').sendEmbed(m2e(message), { files: [attach] })
            .then(msg => messageDB.data.push({ oldMessage: message.id, newMessage: msg.id, channel: msg.channel.id }));
    } else if (message.channel.id == '271349742099759104') {
        bot.channels.get('271350052188979201').sendEmbed(m2e(message), { files: [attach] })
            .then(msg => messageDB.data.push({ oldMessage: message.id, newMessage: msg.id, channel: msg.channel.id }));
    }
});
bot.on('messageUpdate', (oldMessage, newMessage) => {
    if (newMessage.author.bot == true) return; // prevent double messages
    console.log("executing");
    let attach = '';
    if (newMessage.attachments.size > 0)
    { attach = '\n' + newMessage.attachments.first(); }
    let m = messageDB.data.find(function (messageObj) {
        if (messageObj.oldMessage === oldMessage.id)
            return messageObj;
    });
    if (m) {
        //console.log(m);
        bot.channels.get(m.channel).fetchMessage(m.newMessage).edit('', { files: [attach], embed: m2e(newMessage) });;
    }
});
bot.on('messageDelete', message => {
    if (message.author.bot == true) return; // prevent double messages
    console.log("executing");
    let m = messageDB.data.find(function (messageObj) {
        if (messageObj.oldMessage === message.id)
            return messageObj;
    });
    if (m) {
        //console.log(m);
        bot.channels.get(m.channel).fetchMessage(m.newMessage).then(msg => msg.delete()).then(messageDB.data.splice(messageDB.data.indexOf(m), 1)).catch(console.log);
    }
});

