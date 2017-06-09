const bot = require('./../bot');
const request = require('request-promise-native');
let ingame;
let guild;
bot.on('ready',async function(){
  guild =  bot.guilds.get("184536578654339072");
  ingame = guild.roles.get("322233107489226764");
  let playing = guild.members.filterArray(function (m) {
        if (m.presence.game && m.presence.game.name)
            if (m.presence.game.name.toLowerCase().includes("battlefield 2"))
                return m.user.id;
    });
  let toRemove = ingame.members.filter(function (m){
      if(!playing.includes(m.id))
        return m;
    });
   await Promise.all(toRemove.map(async function(m){
      await m.removeRole(ingame);
   }));
   await Promise.all(playing.map(async function(m){
      await m.addRole(ingame);
   }));
  /**
  let online = await request('http://localhost/v0/discord/online');
  online = JSON.parse(online);
  console.log(online)
  if(online)
  {
    for(let i=0;i<online.length;i++)
    {
      let user = bot.users.get(online[i]);
      let member = guild.member(user);
      if(member)
         await member.addRole(ingame);
    }
  }
  **/
});

bot.on('presenceUpdate',async function(om,m){
    if(m.guild.id != guild.id) return;
    if (om.presence.game && om.presence.game.name)
            if (om.presence.game.name.toLowerCase().includes("battlefield 2"))
                await m.removeRole(ingame);
    if (m.presence.game && m.presence.game.name)
            if (m.presence.game.name.toLowerCase().includes("battlefield 2"))
                await m.addRole(ingame);
})
