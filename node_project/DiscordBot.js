var Discord = require("discord.js");

class DiscordBot{

    constructor(){
        this.client = new Discord.Client();
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

    getSlavesConnByServer(listBotsID){

        let result = new Map();
        let servers = Array.from(this.client.guilds.cache.values());

        for (let server of servers){

            let members = Array.from(server.members.cache.values());

            let bots = []
            for (let member of members){

                if(listBotsID.includes(member.id)){
                    bots.push(member.id);
                }

            }

            result.set(server.id, bots);
            
        }

        return result;

    }

}

module.exports = DiscordBot;