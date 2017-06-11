const bot = require('./../bot');
const request = require('request-promise-native');
let ingame;
let guild;
const updateIngame = async function(){
  if(!guild)return;
  let playing = await request('http://localhost/v0/discord/online');
  playing = JSON.parse(playing);
  let toRemove = ingame.members.filter(function (m){
      if(!playing.includes(m.id))
        return m;
    });
   await Promise.all(toRemove.map(async function(m){
      await m.removeRole(ingame);
   }));
   await Promise.all(playing.map(async function(m){
      m = guild.members.get(m);
      if(m)
        await m.addRole(ingame);
   }));
};
bot.on('ready',()=>{
    guild =  bot.guilds.get("184536578654339072");
    ingame = guild.roles.get("322233107489226764");
});
setInterval(updateIngame,5000)
/**
bot.on('presenceUpdate',async function(om,m){
    if(m.guild.id != guild.id) return;
    if (om.presence.game && om.presence.game.name)
            if (om.presence.game.name.toLowerCase().includes("battlefield 2"))
                await m.removeRole(ingame);
    if (m.presence.game && m.presence.game.name)
            if (m.presence.game.name.toLowerCase().includes("battlefield 2"))
                await m.addRole(ingame);
})

*/
