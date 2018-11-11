import * as doc from "../src/docx_processor";
// import User from './user';
import {User}  from "../src/user";
import {Menu} from "../src/nmenu"

console.log("XYUU1123123123123");

import {bot} from "../src/telegram_connection";
import { TelegramBot } from "node-telegram-bot-api";
import { Template } from "./template";
import { Report } from "./report";



bot.onText(/\/start/, async function (msg : TelegramBot.Message , match: RegExpExecArray) {
    
    let user = await User.getSender(msg);
    user.last_message_id = msg.message_id;
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



bot.onText(/\/template(\d)/, async function (msg : TelegramBot.Message , match: RegExpExecArray) {
    
    let user = await User.getSender(msg);
    let templateNum : number = Number(match[1]) ;
    
    user.last_message_id = msg.message_id;
    if(!user.ExistInDB)
        await user.saveToDB();
    if(user.templates && user.templates.length > templateNum){
        user.status = match[0];
        let template = user.templates[templateNum];
        user.addReport(new Report("report.docx", "reports/report.docx", template) )
        Menu.sendTextMessage(user, "send your replacers" );
    }
    else
        Menu.sendMenu(user);
});


bot.on('message', async function(msg: TelegramBot.Message ){
    let user = await User.getSender(msg);
    user.last_message_id = msg.message_id;

    const templateNumPattern = /\/template(\d)/g;

    if(user.status.search(templateNumPattern) >= 0 ){
        let templateNum: number = Number(templateNumPattern.exec(user.status)[1]);
        
        if(await user.addReportReplacement(msg.text) >= user.templates[templateNum].placeholdersCount){
            user.status = 'free';
            Menu.sendTextMessage(user, "Ok, your document is in processing");
            let reportPath = user.generateReport();
            bot.sendDocument(user.id, reportPath);
        }
        else{
            Menu.sendTextMessage(user, "Received, continue");
        }
            
    }
    else if(user.status == "crtemplate" && msg.document){
        console.log(msg.document.file_name);
        let file : TelegramBot.File = await bot.getFile(msg.document.file_id);
        let a: string = await bot.downloadFile(msg.document.file_id, "templates/");
        console.log(a);
        let template = new Template( msg.document.file_name, a );
        user.addTemplate(template);
        user.status = "free";
        Menu.sendTextMessage(user, "Ok, i have found " + template.placeholdersCount + " placeholders in your docx");
    }
});

bot.onText(/\/menu/, async function (msg : TelegramBot.Message, match: RegExpMatchArray) {
    let user = await User.getSender(msg);
    if(!user.ExistInDB)
        await user.saveToDB();
    user.last_message_id = msg.message_id;
    Menu.sendMenu(user);
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

            case '/crreport':
                Menu.sendCreateReportMenu(user);
                break;

            case '/crtemplate':
                Menu.sendTextMessage(user, "Send your template");
                user.status = 'crtemplate';
                break;

            case '/alltemplates':
                Menu.sendUserTemplates(user);
                break;

            case '/mytemplates':
                Menu.sendUserTemplates(user);
                break;
                
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