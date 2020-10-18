const Handler = require("./Handler");
const BotManager = require("../BotManager");

class HandlerVoiceUpdate extends Handler{

    handle(discClient){
        discClient.on("voiceStateUpdate", (oldMember, newMember) => {

            let botManager = BotManager.getInstance();

            if(oldMember != undefined && oldMember != null){

                let voiceChannel = oldMember.channel;
        
                if(voiceChannel != undefined && voiceChannel != null){
                    botManager.checkEmptyChannel(voiceChannel);
                }
                
            }

        });
    }

}

module.exports = HandlerVoiceUpdate
