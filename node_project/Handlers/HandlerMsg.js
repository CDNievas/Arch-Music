const prefix = "a!";

const Handler = require("./Handler");
const BotManager = require("../BotManager");

class HandlerMsg extends Handler{

    handle(discClient){
        discClient.on("message", message => {
            this.analizar(message);
        });
    }

    analizar(message){

        if (message.author.bot) return;

        let botManager = BotManager.getInstance();

        if (checkComm(message,"play")){
            botManager.play(message);
        } else if (checkComm(message,"skip")){
            botManager.skip(message);
        } else if (checkComm(message,"clear")){
            botManager.clear(message);
        } else if (checkComm(message,"pause")){
            botManager.pause(message);
        } else if (checkComm(message,"resume")){
            botManager.resume(message);
        } else if (checkComm(message,"list")){
            botManager.list(message);
        } else if (checkComm(message,"shuffle")){
            botManager.shuffle(message);
        } else if (checkComm(message,"purge")){
            botManager.purge(message);
        } else if (checkComm(message,"invite")){
            botManager.invite(message);
        } else if (checkComm(message,"help")){
            botManager.help(message);
        } else if (checkComm(message,"")){
            message.channel.send("That command doesn't exists. Type !help for a complete list.");
        }

    }

}

function checkComm(message,str){
    return message.content.startsWith(prefix + str);
}

module.exports = HandlerMsg
