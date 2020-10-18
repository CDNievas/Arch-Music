
if(process.argv.length < 3){
    console.log("Missing parameters to init the music bot");
    return;
}

const token = process.argv[2];

const HandlerOn = require("./HandlerOn");
const HandlerProcess = require("./HandlerProcess");
const DiscordBot = require("./DiscordBot");

var bot = DiscordBot.getInstance();
bot.addHandler(new HandlerOn());

new HandlerProcess().handle();

bot.login(token);