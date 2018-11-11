import * as doc from "../src/docx_processor";
// import User from './user';
import {User}  from "../src/user";
import {Menu} from "../src/nmenu"

console.log("XYUU1123123123123");

import {bot} from "../src/telegram_connection";
import { TelegramBot } from "node-telegram-bot-api";




bot.onText(/\/start/, async function (msg : TelegramBot.Message , match: RegExpExecArray) {
    
    let user = await User.getSender(msg);
    if(!user.ExistInDB){
        await user.saveToDB();
        var greeting = "Hi!";
        await Menu.sendTextMessage(user, greeting);
    }
    else{
        const greeting = "Hi! We are already familiar ";
        await Menu.sendTextMessage(user, greeting);
    }
});

bot.on('message', async function(msg: TelegramBot.Message ){
    let user = await User.getSender(msg);
    if(user.status == "crtemplate" && msg.document){
        console.log(msg.document.file_name);
        console.log("message");
        bot.sendMessage(msg.chat.id, msg.document.file_id);

        let a = await bot.downloadFile(msg.document.file_id, "templates/");
        
    }
        // let file : TelegramBot.File = await bot.getFile(msg.document.file_id);
        
        
})





bot.onText(/(.*)/, async function (msg : TelegramBot.Message , match: RegExpExecArray) {
    if(msg.document){
    console.log(msg.document.file_name);
    console.log("message");
    bot.sendMessage(msg.chat.id, msg.document.file_name);
    }
});



bot.on('callback_query', async function (msg : TelegramBot.CallbackQuery ) {
    let user = await User.getSender(msg);
    if(!user.ExistInDB)
        await user.saveToDB();
    try{
        switch (msg.data){
            case '/replenishMoney':
                throw "Автоматизированная данная функция появится в течение недели. Сейчас для пополнения можете обратиться напрямую в \"Помощь\"";
                user.status = 'free';
            case '/stats':
                Menu.sendStats(user);
                user.status = 'free';
                break;
            
            case '/menu':
                Menu.sendMenu(user);
                user.status = 'free';
                break;

            case '/crtemplate':
                Menu.sendTextMessage(user, "Send your template");
                user.status = 'crtemplate'
                
            case '/earn_vk_subscribers_task':
            case '/earn_tg_post_view_task':
            case '/earn_tg_subscribers_task':
                throw('Извини, таких заданий сейчас нет');
                break;
                default: break;
        }
    }
    catch(err){
        console.log(err.stack);///////////////////////////НЕИЗВЕСТНАЯ ОШИБКА
        await Menu.sendTextMessage(user, err);
    }
    bot.answerCallbackQuery(msg.id, "", true);
});


function createByTemplate(){
    interface keyValue { key : string, value: string}

    let matches : keyValue[];

    matches.push({key : '0', value : 'str 0'}, {key : '1', value : 'str 1'}, {key : '2', value : 'str 2'});

    doc.replace( __dirname + '/../input.docx', __dirname + '/../out.docx', matches);
}