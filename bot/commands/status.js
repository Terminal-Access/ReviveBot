
/**
 * This method should return the response directly to the channel
 * @param {*string array} params 
 * @param {*message} message
 */
const pm2 = require('pm2');
const moment = require('moment');
const settings = require('./../../settings.json');
const Discord = require('discord.js');

async function command(params, message) {
	if (!settings.owners.includes(message.author.id)) {
		await message.reply("You are not allowed to use this command");
		return false;
	}
	const embed = new Discord.MessageEmbed();
	embed.setAuthor("Melroy", "https://cdn.discordapp.com/avatars/184547913509109761/ef49e8f45dcb53cbe016393e842e7ee0.webp?size=256");
	embed.setTitle("ReviveBot");
	p = await getPm2List();
	//console.log(p);
	embed.addField("Process ID", p.pid);
	if (p.monit) {
		embed.addField("Memory", p.monit.memory / 1000000 + " MB");
		embed.addField("CPU", p.monit.cpu + " %");
	}
	let djs = require('./../../node_modules/discord.js/package.json');
	embed.addField("Uptime", moment.utc(process.uptime() * 1000).format('HH:mm:ss'));
	embed.addField("Node Version", process.version);
	embed.addField("Discord.js Version", djs.version);
	message.channel.send({ embed: embed });
}
getPm2List = function () {
	return new Promise(
		function (resolve, reject) {
			pm2.describe("revivebot",
				function (err, list) {
					if (err) reject(err);
					list = list.shift();
					resolve(list);
				}
			)
		}
	);
}
/**
 * description of the command
 */
const description = "shows bot stats";
/**
 * Define Exports
 */
module.exports = {
	execute: command,
	description: description,
	owner: true
};
