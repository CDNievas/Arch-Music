const fs = require('fs');

const DiscordBot = require("./DiscordBot");
const Bot = require("./Bot");
const InvalidArgumentException = require("./Exceptions/InvalidArgumentException");

class BotManager{

    constructor(){
        this.bots = new Map();
        this.servers = new Map();
        BotManager.instance = this;
    }

    static getInstance(){

        if(!BotManager.instance){
            new BotManager();
        }
        return BotManager.instance

    }

    init(){

        this.initSlaves();
        this.loadServerList();
        this.attachExitHandler();   
    
    }

    addDJToServer(serverID,memberID){

        let listBotsID = Array.from(this.bots.keys());
        let bot = listBotsID.find(x => x === memberID);

        let botsOnServer = this.servers.get(serverID);
        botsOnServer.push(bot);
        this.servers.set(serverID,botsOnServer);

    }

    removeDJFromServer(serverID,memberID){

        let botsOnServer = this.servers.get(serverID);
        botsOnServer.filter(x => x.voiceChannelID !== memberID);
        this.servers.set(serverID,botsOnServer);

    }

    play(message){

        try{

            var bot = this.getBotConnected(message);

            if(!bot){
                bot = this.getBotAvailable(message.guild.id);
                bot.connectToChannel(message)
            } else {
                bot.add(message);
            }
                    
        } catch (e){

            if(e instanceof NoVoiceChannelDetectedException){
                message.channel.send("First you need to enter in a voice channel, do it and try again.");
            } else if(e instanceof NoDJConnectedException){
                message.channel.send("Sorry but there is no DJs available.");
            }
            return;
        }
        
    }

    skip(message){

        try{

            var bot = this.getBotConnected(message);
        
        } catch (e){

            if(e instanceof NoVoiceChannelDetectedException){
                message.channel.send("First you need to enter in a voice channel, do it and try again.");
            } else if(e instanceof NoDJConnectedException){
                message.channel.send("There is no DJs connected to the channel.");
            }
            return;
        }

        bot.skip(message);

    }

    clear(message){

        try{
            
            var bot = this.getBotConnected(message);
        
        } catch (e){

            if(e instanceof NoVoiceChannelDetectedException){
                message.channel.send("First you need to enter in a voice channel, do it and try again.");
            } else if(e instanceof NoDJConnectedException){
                message.channel.send("There is no DJs connected to the channel.");
            }
            return;
        }
        
        bot.clear(message);
    
    }

    pause(message){

        try{
            
            var bot = this.getBotConnected(message);
        
        } catch (e){

            if(e instanceof NoVoiceChannelDetectedException){
                message.channel.send("First you need to enter in a voice channel, do it and try again.");
            } else if(e instanceof NoDJConnectedException){
                message.channel.send("There is no DJs connected to the channel.");
            }
            return;
        }

        bot.pause(message);

    }

    resume(message){

        try{
            
            var bot = this.getBotConnected(message);
        
        } catch (e){

            if(e instanceof NoVoiceChannelDetectedException){
                message.channel.send("First you need to enter in a voice channel, do it and try again.");
            } else if(e instanceof NoDJConnectedException){
                message.channel.send("There is no DJs connected to the channel.");
            }
            return;
        }
        
        bot.resume(message);

    }

    list(message){

        try{
            
            var bot = this.getBotConnected(message);
        
        } catch (e){

            if(e instanceof NoVoiceChannelDetectedException){
                message.channel.send("First you need to enter in a voice channel, do it and try again.");
            } else if(e instanceof NoDJConnectedException){
                message.channel.send("There is no DJs connected to the channel.");
            }
            return;
        }
        
        bot.list(message);

    }

    shuffle(message){

        try{
            
            var bot = this.getBotConnected(message);
        
        } catch (e){

            if(e instanceof NoVoiceChannelDetectedException){
                message.channel.send("First you need to enter in a voice channel, do it and try again.");
            } else if(e instanceof NoDJConnectedException){
                message.channel.send("There is no DJs connected to the channel.");
            }
            return;
        }
        
        bot.shuffle(message);

    }

    invite(message){
        message.channel.send("Link to the use/installation guide: https://arch.cdnapp.xyz");
    }

    help(message){

        let msg = "a!play <url_yt>: Add youtube songs to playlist\n" + 
        "a!skip <number>: Skip the song\n" + 
        "a!clear: Empties the playlist and disconnects the bot from the channel\n" +
        "a!pause: Pauses the playing song\n" +
        "a!resume: Resumes the stopped song\n" +
        "a!list: Shows the song being played and the playlist  \n" +
        "a!shuffle: Shuffles the playlist\n" +
        "a!invite: Link to share the bot with your friends \n" + 
        "a!help: Shows the command list \n";

        message.channel.send(msg);

    }


    // Auxiliar functions

    initSlaves(){

        if(process.argv.length >= 3){

            let filePath = process.argv[2];
            let data = fs.readFileSync(filePath);
            let json = JSON.parse(data);

            for (let botJson of json.bots){
                let bot = new Bot(botJson.id);
                bot.start(botJson.token);
                this.bots.set(botJson.id, bot);
            }
        
        } else {
            throw new InvalidArgumentException("There is no Slave IDs json file");
        }

    }

    isBotDJ(memberID){

        let listBotsID = Array.from(this.bots.keys());
        let bot = listBotsID.find(x => x === memberID);
        return (bot !== null);

    }

    loadServerList(){

        let listBotsID = Array.from(this.bots.keys());
        let results = DiscordBot.getInstance().getSlavesConnByServer(listBotsID);
        let serversID = Array.from(results.keys());

        for (let serverID of serversID){

            let slavesID = results.get(serverID);

            let bots = []
            slavesID.forEach(element => {
                let bot = this.bots.get(element);
                bots.push(bot);
            });

            this.servers.set(serverID,bots);

        }

    }

    attachExitHandler(){
        process.on("exit", function() {
            this.bots.forEach(bot => {
                bot.process.kill();
            });
        });
        process.on("error", function() {
            this.bots.forEach(bot => {
                bot.process.kill();
            });
        });
    }

    getBotConnected(message){

        let serverID = message.guild.id;
        let voiceChannel = message.member.voice.channel;
    
        if(!voiceChannel){
            throw new NoVoiceChannelDetectedException();
        }
    
        let bots = this.servers.get(serverID);
        let bot = bots.find(x => x.isInChannel(voiceChannel.id));
    
        return bot;
    
    }

    getBotAvailable(serverID){

        let botsOnServer = this.servers.get(serverID);
        let bot = botsOnServer.find(x => !(x.isOccuppied()));

        if(!bot){
            throw new NoDJConnectedException();
        }

        return bot;

    }

    checkEmptyChannel(voiceChannel){

        if(voiceChannel.members.size === 1){

            let bots = this.servers.get(voiceChannel.guild.id);

            let bot = bots.find(x => x.isInChannel(voiceChannel.id));

            if(!bot){
                return;
            }

            bot.disconnectFromChannel();

        }
    
    }

}

class NoVoiceChannelDetectedException extends Error{}

class NoDJConnectedException extends Error{}

module.exports = BotManager;