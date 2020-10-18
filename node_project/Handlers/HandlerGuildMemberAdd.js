const Handler = require("./Handler");
const BotManager = require("../BotManager");

class HandlerGuildMemberAdd extends Handler{

    handle(discClient){
        discClient.on("guildMemberAdd", member => {

            let botManager = BotManager.getInstance();

            if(botManager.isBotDJ(member.id)){
                botManager.addDJToServer(member.guild.id,member.id);
            }

        });
    }

}

module.exports = HandlerGuildMemberAdd
