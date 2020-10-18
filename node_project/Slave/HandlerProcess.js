
const Handler = require("./Handler");
const DiscordBot = require("./DiscordBot");

class HandlerProcess extends Handler{

    handle(){

        process.on('message', message => {
            this.analizar(message);
        });

    }

    analizar(message){

        let discord = DiscordBot.getInstance();

        if (checkComm(message,"add")){
            discord.add(message);
        } else if (checkComm(message,"skip")){
            discord.skip(message);
        } else if (checkComm(message,"clear")){
            discord.clear(message);
        } else if (checkComm(message,"pause")){
            discord.pause(message);
        } else if (checkComm(message,"resume")){
            discord.resume(message);
        } else if (checkComm(message,"list")){
            discord.list(message);
        } else if (checkComm(message,"shuffle")){
            discord.shuffle(message);
        } else if (checkComm(message,"connect")){
            discord.connectToChannel(message);
        } else if (checkComm(message,"disconnect")){
            discord.disconnectFromChannel(message);
        }

    }

}

function checkComm(message,command){
    return message.header === command;
}

module.exports = HandlerProcess
