const Handler = require("./Handler");
const BotManager = require("../BotManager");

class HandlerGuildMemberRemove extends Handler{

    handle(discClient){

        let botManager = BotManager.getInstance();

        discClient.on("guildMemberRemove", member => {
            if(botManager.isBotDJ(member.id)){
                botManager.removeDJFromServer(member.guild.id,member.id);
            }
        });
    }

}

module.exports = HandlerGuildMemberRemove
