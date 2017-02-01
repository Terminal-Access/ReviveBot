const request = require('request');
module.exports = {};
var exports = module.exports;
exports.getPlayers = function(nick,callback) {
    console.log("GET PLAYERS BF2");
    var playerlist = new Array();
    request('http://bf2web.game.bf2.us/ASP/searchforplayers.aspx?nick=' + nick + '&where=a&sort=a&debug=txs&transpose=0',function (error, response, body) {
    var collection = body.split("\n");
    console.log(collection);
    var index = collection.indexOf('H\tn\tpid\tnick\tscore')+1;
    if (index > collection.length) {
        return null;
    }
    while (collection[index].startsWith("D")) {
        /*
        if(index==30)
        {
        playerlist.push(collection.length-27+"more players found"+"\n"
        +"to Get a full list of players \n"
        +"<https://battlelog.co/player_search.php?q="+nick+">");
        break;
    }
    */
        //console.log(collection[index]);
        var p = collection[index].split("\t");
        //console.log(p[2],p[3],p[4]);
        p = new exports.player(p[2], p[3], p[4]);
        playerlist.push(p);

        index++;
    }
    console.log(playerlist);
    callback(playerlist);
	});
};
exports.player = function(pid_, nick_, score_) {
    this.nick = nick_;
    this.pid = pid_;
    this.score = score_;
    this.link =  "<https://battlelog.co/bfhq.php?pid=" + this.pid + ">";
};
exports.str = function(player)
{
		return player.nick+"\t"+player.score+"\t"+player.link;
}