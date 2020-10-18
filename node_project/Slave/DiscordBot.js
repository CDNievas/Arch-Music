const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
var Discord = require("discord.js");

class DiscordBot{

    constructor(){
        this.client = new Discord.Client();
        this.queues = new Map();
        DiscordBot.instance = this;
    }

    static getInstance(){

        if(!DiscordBot.instance){
            new DiscordBot();
        }
        return DiscordBot.instance

    }

    addHandler(handler){
        handler.handle(this.client);
    }

    login(token){
        this.client.login(token);
    }

    getVoiceChannel(channelID){
        return this.client.channels.cache.get(channelID);
    }

    getTextChannel(channelID){
        return this.client.channels.cache.get(channelID);
    }

    getGuild(guildID){
        return this.client.guilds.cache.get(guildID);
    }

    async connectToChannel(message){

        let textChannel = this.getTextChannel(message.channelID);
        let voiceChannel = this.getVoiceChannel(message.voiceChannelID);
        let serverID = message.serverID;

        let serverQueue = {

            textChannel: textChannel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: false

        }

        var connection = await voiceChannel.join();
        serverQueue.connection = connection;

        this.queues.set(serverID, serverQueue);

        this.add(message);

    }

    disconnectFromChannel(message){

        let channelID = message.channelID;
        this.getVoiceChannel(channelID).leave();

    }

    async add(message){

        let source = message.content.split(" ")[1];        
        let serverQueue = this.queues.get(message.serverID);

        if(!ytdl.validateURL(source)){
            serverQueue.textChannel.send("I only accept youtube links");
            return;
        }       

        let songs = [];

        if(source.includes("list")){
            
            let regex = /list=(.*?)(&|$)/g;
            let match = regex.exec(source);
            
            try{
                console.log("Waiting for ytpl");
                let response = await ytpl(match[1],{limit:25});
                console.log("Ready!");

                response.items.forEach(item => {
                    songs.push({
                        title: item.title,
                        url: item.url_simple
                    });
                });

                serverQueue.textChannel.send(response.items.length + " songs added to the playlist. To see the playlist type a!list");
            } catch(e) {
                console.log(e);
                serverQueue.textChannel.send("An error has ocurred and couldn't add the songs");
            }
    
        } else {
            
            console.log("Waiting for ytdl-core");
            let song = await ytdl.getInfo(source);
            console.log("Ready!");
    
            songs.push({title: song.videoDetails.title, url:song.videoDetails.video_url});
    
            serverQueue.textChannel.send(song.videoDetails.title + " added to the playlist");
    
        }
        
        songs.forEach(song => serverQueue.songs.push(song));
    
        if(!serverQueue.playing){
            this.play(message.serverID, serverQueue.songs[0]);
        }
    
    }

    play(serverID, song){

        let serverQueue = this.queues.get(serverID);
        if(!serverQueue) return;
    
        if(!song){
            serverQueue.voiceChannel.leave();
            this.queues.delete(serverID);
            return;
        }
    
        serverQueue.playing = true;
    
        const dispatcher = serverQueue.connection.play(ytdl(song.url))
            .on("start", () =>{
                serverQueue.textChannel.send("The song playing is: " + song.title);
            })
            .on("finish", () => {
                serverQueue.songs.shift();
                this.play(serverID, serverQueue.songs[0]);
            })
            .on("error", error => {
                serverQueue.songs.shift();
                serverQueue.textChannel.send("Can't play '" + song.title + "'. Error: " + error);
                serverQueue.textChannel.send("Skipping the song with problem");
                this.play(serverID, serverQueue.songs[0]);
            });
    
        dispatcher.setVolumeLogarithmic(serverQueue.volume/5);
    
    }

    skip(message){

        let serverQueue = this.queues.get(message.serverID);
        if(!serverQueue) return;
    
        let args = message.content.split(" ");
        let songPos = 1;
        
        if(args.length >= 2){
            songPos = Number(args[1]);
        } 
    
        if(songPos > serverQueue.songs.length-1){
            serverQueue.textChannel.send("That song doesn't exists");
            return;
        }
    
        let nextSong = serverQueue.songs[songPos-1];
    
        if(!nextSong){
            serverQueue.textChannel.send("There is no song after this");
        } else {
    
            serverQueue.songs = serverQueue.songs.slice(songPos-1, serverQueue.songs.length);
            serverQueue.connection.dispatcher.end();
            serverQueue.textChannel.send("Skipping the song");
    
        }
    
    }

    clear(message){
        
        let serverQueue = this.queues.get(message.serverID);
        if(!serverQueue) return;

        serverQueue.voiceChannel.leave();
        serverQueue.textChannel.send("Bye bye!");

        this.queues.delete(message.serverID);

    }

    pause(message){

        let serverQueue = this.queues.get(message.serverID);
        if(!serverQueue) return;
        if(!serverQueue.connection) return;

        serverQueue.connection.dispatcher.pause();
        serverQueue.textChannel.send("Stopping the song");
    
    }

    resume(message){

        let serverQueue = this.queues.get(message.serverID);

        if(!serverQueue) return;
        if(!serverQueue.connection) return;
        serverQueue.connection.dispatcher.resume();
    
        serverQueue.textChannel.send("Resuming the song");
    
    }

    list(message){

        let serverQueue = this.queues.get(message.serverID);
        if(!serverQueue) return;
    
        let msg = "";
    
        let songs = serverQueue.songs;
    
        for (var i in songs){
    
            if(parseInt(i) === 0){
                msg = msg + "** # - " + songs[i].title + "**\n";
            } else {
               msg = msg + i + "- " + songs[i].title + "\n"; 
            }
            
        }
    
        serverQueue.textChannel.send("**__Playlist:__**");
        serverQueue.textChannel.send(msg);
    
    }

    shuffle(message){

        let serverQueue = this.queues.get(message.serverID);
        if(!serverQueue) return;

        let song = serverQueue.songs.shift();
        serverQueue.songs.sort(() => Math.random() - 0.5);
        serverQueue.songs.unshift(song);
    
        serverQueue.textChannel.send("Playlist shuffled");
    
    }
    

}

module.exports = DiscordBot;