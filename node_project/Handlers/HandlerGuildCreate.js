const Handler = require("./Handler");

class HandlerGuildCreate extends Handler{

    handle(discClient){
        discClient.on("guildCreate", async () =>{
            await discClient.user.setActivity((discClient.guilds.cache.size).toString() + " servers a!help", {type: "PLAYING"});
        });
    }

}

module.exports = HandlerGuildCreate
