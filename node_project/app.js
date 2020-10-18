const HandlerMsg = require("./Handlers/HandlerMsg");
const HandlerOn = require("./Handlers/HandlerOn");
const HandlerGuildMemberAdd = require("./Handlers/HandlerGuildMemberAdd");
const HandlerGuildMemberRemove = require("./Handlers/HandlerGuildMemberRemove");
const HandlerVoiceUpdate = require("./Handlers/HandlerVoiceUpdate");
const HandlerGuildCreate = require("./Handlers/HandlerGuildCreate");
const HandlerPresenceUpdate = require("./Handlers/HandlerPresenceUpdate");


const DiscordBot = require("./DiscordBot");

const token = process.env.DISCORD_MASTER_BOT_KEY

// Listener: Init Bot

var bot = DiscordBot.getInstance();
bot.addHandler(new HandlerOn());
bot.addHandler(new HandlerMsg());
bot.addHandler(new HandlerGuildMemberAdd());
bot.addHandler(new HandlerGuildMemberRemove());
bot.addHandler(new HandlerVoiceUpdate());
bot.addHandler(new HandlerGuildCreate());
bot.addHandler(new HandlerPresenceUpdate());

bot.login(token);   

