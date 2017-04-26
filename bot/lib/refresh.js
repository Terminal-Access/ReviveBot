const request = require('request-promise-native');
const bot = require('./../bot');
module.exports = async function (user) {
    var guild = bot.guilds.get('184536578654339072');
    var member = guild.member(user);
    if(!member)
        return false;
    //console.log(user);
    var id = user.id;
    console.log(id);
    return request("http://revive-bot-discord.revive.systems/v0/discord/userinfo/" + id).then(body => {
        console.log(body);
        try { var info = JSON.parse(body); }
        catch (e) {
            throw e;
        }
        if (info.hasOwnProperty('error')) {
            user.sendMessage("To link your discord account with your battlelog account follow the link given below\n"
                + "https://battlelog.co/discord_link.php");
            console.log( "User " + user.username + " Not Linked. DMing user to link now");
            return false;
        }
        member.addRole(guild.roles.get('275317218911322112'));
        //member.removeRole(guild.roles.find("name", "members"));
        if (info.is_donator) {
            if(!member.roles.get("273105185566359562"))
            member.addRole(guild.roles.get("273105185566359562")).then(user.sendMessage('Role added: donators'));
        } else {
            if(member.roles.get("273105185566359562"))
            member.removeRole(guild.roles.get("273105185566359562")).then(user.sendMessage('Role removed: donators'));
        }
        if (info.is_admin) {
            if(!member.roles.get('200849956796497920'))
            member.addRole(guild.roles.get('200849956796497920')).then(user.sendMessage('Role added: admins'));
        }
        if (info.is_mod || (info.usergroup == 8)) {
            if(!member.roles.get('184676864630063104'))
            member.addRole(guild.roles.get('184676864630063104')).then(user.sendMessage('Role added: moderator'));
        }
        member.setNickname(info.username);
        return true;
    });
};
