
import doc = require("./docx_processor");
// import User from './user';
import {User}  from "./user";
import {Menu} from "./nmenu"

console.log("XYUU1123123123123");

import {bot} from "./telegram_connection";
import * as TelegramBot from "node-telegram-bot-api";
import { Template } from "./template";
import { Report } from "./report";
import DB from "./DB";
import { Faculty } from "./faculty";
import Admin from "./admin";


var express = require('express');
var app = express();
 
app.get('/', function (req: any, res: any) {
  res.send('Hello World')
})
 
app.listen(process.env.PORT || 3000);


bot.onText(/\/start/, async function (msg : TelegramBot.Message , match: RegExpExecArray) {
    
    let user = await User.getSender(msg);
    user.last_message_id = msg.message_id;
    if(!user.ExistInDB){
        await user.saveToDB();
        var greeting = "Hi!";
        await Menu.sendStartMenu(user);
        Admin.SendInf(user, "New user:\n");
        // await Menu.sendTextMessage(user, greeting);
    }
    else{
        let greeting = "Hi! We are already familiar ";
        await Menu.sendTextMessage(user, greeting);
    }
    
});


bot.onText(/\/sendtoall (.*)/, async function (msg: any, match: any) {
    let user = await User.getSender(msg);
    if(await Admin.IsAdmin(user)){
        await Admin.SendToAll(match[1]);
        Menu.sendTextMessage(user, 'Success');
    }
    user.last_message_id = msg.message_id;
});

bot.onText(/\/sendto (\d+) (.*)/, async function (msg: any, match: any) {
    let user = await User.getSender(msg);
    if(await Admin.IsAdmin(user)){
        let userDestination = await User.fromDB(Number(match[1]));
        await Admin.SendTo(userDestination, match[2]);
        Menu.sendTextMessage(user, 'Success');
    }
    user.last_message_id = msg.message_id;
});


bot.onText(/\/payto (\d+) (\d+)/, async function (msg: any, match: any) {
    let user = await User.getSender(msg);
    if(await Admin.IsAdmin(user)){
        let userDestination = await User.fromDB(Number(match[1]));
        await Admin.PayTo(userDestination, match[2]);
        Menu.sendTextMessage(user, 'Success');
    }
    user.last_message_id = msg.message_id;
});

bot.onText(/\/confirm (\d+) (\d+)/, async function (msg: any, match: any) {
    let user = await User.getSender(msg);
    if(await Admin.IsAdmin(user)){
        let userDestination = await User.fromDB(Number(match[1]));
        await Admin.Confirm(userDestination, Number(match[2]));
        Menu.sendTextMessage(user, 'Success');
    }
    user.last_message_id = msg.message_id;
});

bot.onText(/\/paytome (\d+)/, async function (msg: any, match: any) {
    let user = await User.getSender(msg);
    if(await Admin.IsAdmin(user)){
        await Admin.PayTo(user, match[1]);
        Menu.sendTextMessage(user, 'Success');
    }
    user.last_message_id = msg.message_id;
});

bot.onText(/\/getuserinf (\d+)/, async function (msg: any, match: any) {
    let user = await User.getSender(msg);
    if(await Admin.IsAdmin(user)){
        let user = await User.fromDB(Number(match[1]));
        await Admin.SendInf(user, "");
    }
    user.last_message_id = msg.message_id;
});


bot.on('message', async function(msg: TelegramBot.Message ){
    let user = await User.getSender(msg);
    user.last_message_id = msg.message_id;

    const templateNumPattern = /\/template(\d)/g;

    const gtemplateNumPattern = /\/alltemplate(\d)/g;
    console.log(user.status);
    if(user.status.search(templateNumPattern) >= 0 ){
        let templateNum: number = Number(templateNumPattern.exec(user.status)[1]);
        let replCount = await user.addReportReplacement(msg.text);
        if(replCount >= user.templates[templateNum].placeholders.length){
            user.status = 'free';
            await Menu.sendTextMessage(user, "Ok, your document is in processing");
            let reportPath = user.generateReport();
            let message = await bot.sendDocument(user.id, reportPath);
            user.last_message_id = message.message_id;
            await Menu.deleteMenu(user);
        }
        else{
            await Menu.sendTextMessage(user, user.templates[templateNum].placeholders[replCount] + "?");
        }
            
    }
    else if(user.status.search(gtemplateNumPattern) >= 0 ){
        let templateNum: number = Number(gtemplateNumPattern.exec(user.status)[1]);
        let template = await Template.GetPublicTemplate(user.faculty.name, templateNum, user);
        let replCount = await user.addReportReplacement(msg.text);
        console.log(replCount);
        if(replCount >= template.placeholders.length){
            user.status = 'free';
            await Menu.sendTextMessage(user, "Ok, your document is in processing");
            let reportPath = user.generateReport();
            let message = await bot.sendDocument(user.id, reportPath);
            user.last_message_id = message.message_id;
            await Menu.sendMenu(user);
        }
        else{
            await Menu.sendTextMessage(user, template.placeholders[replCount] + "?");
        }
            
    }
    else if(user.status == "/crtemplate" && msg.document){
        let file : TelegramBot.File = await bot.getFile(msg.document.file_id);
        let a: string = await bot.downloadFile(msg.document.file_id, "templates/");

        const docnamePattern = /(.*)\.docx/g;
        let docname = docnamePattern.exec(msg.document.file_name)[1];

        let template = new Template( docname, a, user.faculty, true, false);
        template.faculty = user.faculty;
        user.addTemplate(template);
        user.status = "free";
        await Menu.sendCreateTemplateMenu(user, `Ok, i have found ${template.placeholders} placeholders in your docx. ` +
        `\nWould you like to set the template as private or public?`);
    }
    else if(user.status == "/crfaculty"){
        let faculty = new Faculty(msg.text);
        user.faculty = faculty;
        await Menu.sendTextMessage(user, `Faculty ${faculty.name} was successfully created`);
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

            case '/ibalance':
                Admin.SendInf(user, 'wants to refill balance');
                Menu.sendTextMessage(user, "Request has been sent");
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
                user.status = '/crtemplate';
                break;

            case '/balance':
                bot.answerCallbackQuery(msg.id, "To look more, refill your balance", true);
                break;

            case '/crfaculty':
                Menu.sendTextMessage(user, "What is the name of your category?");
                user.status = '/crfaculty';
                break;

            case '/alltemplates':
                if(user.faculty != null)
                    Menu.sendAllTemplates(user);
                else Menu.sendTextMessage(user, `First choose your category`);
                break;

            case '/mytemplates':
                Menu.sendUserTemplates(user);
                break;

            case '/chfaculty':
                Menu.sendChangeFacultyMenu(user);
                break;

            case '/profile':
                Menu.sendStats(user);
                break;

            
            case '/setpubtemplate':
                let template = user.templates[user.templates.length - 1];
                await user.setTemplatePrivacy(false);
                Menu.sendTextMessage(user, `Template ${template.name} pending processing moderator, thanks`);
                Admin.NewDocumentNotification(user);
                user.status = 'free';
                break;
            case '/setprivtemplate':
                let template1 = user.templates[user.templates.length - 1];
                await user.setTemplatePrivacy(true);
                Menu.sendTextMessage(user, `Template ${template1.name} was successfully created`);
                user.status = 'free';
                break;
            case '/earn_vk_subscribers_task':
            case '/earn_tg_post_view_task':
            case '/earn_tg_subscribers_task':
                throw('Извини, таких заданий сейчас нет');
                break;
                default:
                const facultyPattern = /\/setfaculty(.*)/g;
                const reportPattern = /\/mytemplates(.*)/g;
                const areportPattern = /\/alltemplates(.*)/g;
                const useTemplatePattern = /\/template(.*)/g;
                const useGlobTemplatePattern = /\/alltemplate(.*)/g;
                if(msg.data.search(facultyPattern) >= 0 ){
                    let facultyName = facultyPattern.exec(msg.data)[1];
                    user.faculty = await Faculty.GetFacultyByName(facultyName);
                    Menu.sendTextMessage(user, `Faculty ${facultyName} was selected`);
                }
                else if(msg.data.search(reportPattern) >= 0 ){
                    let offset = Number(reportPattern.exec(msg.data)[1]);
                    Menu.sendUserTemplates(user,  offset);
                }
                else if(msg.data.search(areportPattern) >= 0 ){
                    let offset = Number(areportPattern.exec(msg.data)[1]);
                    Menu.sendAllTemplates(user,  offset);
                }
                else if(msg.data.search(useTemplatePattern) >= 0){
                    let templateNum : number = Number(useTemplatePattern.exec(msg.data)[1]) ;
                    user.status = msg.data;
                    let template = user.templates[templateNum];
                    await user.addReport(new Report("report.docx", "reports/report.docx", template) )
                    await Menu.sendTextMessage(user, template.placeholders[0] + "?");
                }
                else if(msg.data.search(useGlobTemplatePattern) >= 0){
                    let templateNum : number = Number(useGlobTemplatePattern.exec(msg.data)[1]) ;
                    let gtemplate = await Template.GetPublicTemplate(user.faculty.name, templateNum, user);
                    user.status = msg.data;
                    await user.addReport(new Report("report.docx", "reports/report.docx", gtemplate) )
                    await Menu.sendTextMessage(user, gtemplate.placeholders[0] + "?");
                }




                break;

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