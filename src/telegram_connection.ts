let token = "770251914:AAHPVO-Kp681gQCW59bvC6-6XQQi2aaVZhQ";
var TelegramBot = require("node-telegram-bot-api");
var bot = new TelegramBot (token, {polling: true});

export  {bot};