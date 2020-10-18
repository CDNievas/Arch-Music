
const Handler = require("./Handler");
const BotManager = require("../BotManager");

class HandlerOn extends Handler{

    handle(discClient){
        discClient.on("ready", async () => {

            console.log("Arch Music Master by CDNievas");
            
            await discClient.user.setActivity((discClient.guilds.cache.size).toString() + " servers a!help", {type: "PLAYING"});
            
            BotManager.getInstance().init();
            
        });
    }

}

module.exports = HandlerOn
