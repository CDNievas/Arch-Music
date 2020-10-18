const path = require("path");
const fork = require('child_process').fork;

const HandlerProccess = require("./Handlers/HandlerProcess");

const pathFileMusicApp = "./Slave/app.js"

class Bot{

    constructor(botID){
        this.process = null;
        this.botID = botID;
        this.voiceChannelID = null;
    }   

    start(token){
        const parameters = [token];
        const options = {
            stdio: [ 'inherit', 'inherit', 'inherit', 'ipc' ]
        };

        this.process = fork(path.resolve(pathFileMusicApp), parameters, options);

        new HandlerProccess(this.process);

    }

    isOccuppied(){
        return this.voiceChannelID !== null;
    }

    isInChannel(voiceChannelID){
        return this.voiceChannelID === voiceChannelID;
    }

    connectToChannel(message){

        let permissions = message.member.voice.channel.permissionsFor(message.client.user);

        if(!permissions.has("CONNECT") ||!permissions.has("SPEAK")){
            message.channel.send("I need the permissions to join and speak in your voice channel");
            return;
        }

        this.process.send({
            "header":"connect",
            "serverID":message.guild.id,
            "channelID":message.channel.id,
            "voiceChannelID":message.member.voice.channel.id,
            "content":message.content
        });

        this.voiceChannelID = message.member.voice.channel.id;

    }

    disconnectFromChannel(){

        this.process.send({
            "header":"disconnect",
            "channelID":this.voiceChannelID
        });

        this.voiceChannelID = null;

    }

    add(message){
        this.process.send({
            "header":"add",
            "content":message.content,
            "serverID":message.guild.id
            }
        );
    }

    skip(message){
        this.process.send({
            "header":"skip",
            "content":message.content,
            "serverID":message.guild.id
        });
    }

    clear(message){
        this.process.send({
            "header":"clear",
            "serverID":message.guild.id,
            "textChannelID":message.channel.id
        });

        this.voiceChannelID = null;

    }

    pause(message){
        this.process.send({
            "header":"pause",
            "serverID":message.guild.id
        });
    }

    resume(message){
        this.process.send({
            "header":"resume",
            "serverID":message.guild.id,
            "textChannelID":message.channel.id
        });
    }

    list(message){
        this.process.send({
            "header":"list",
            "serverID":message.guild.id
        });
    }

    shuffle(message){
        this.process.send({
            "header":"shuffle",
            "serverID":message.guild.id
        });
    }

}

module.exports = Bot;