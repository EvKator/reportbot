import {bot} from './telegram_connection';

import {User} from './user';
import { Template } from './template';
import DB from './DB';
import { IFaculty, Faculty } from './faculty';

interface TLReplyMatkup{
    inline_keyboard: [[string, string]
    ]
}


export class Menu {
    static async sendStartMenu(user: User) {

        let faculties = await Faculty.GetAllFaculties();// new Array<IFaculty>(); faculties.push({name: "PZ"},{name: "KN"},{name: "Other"},{name: "PZ"});
        let text = "Hi! I am polreportbot, i can help you with reports creation!" + 
                    "Choose your category and i will try to find templates for your reports";
        let inline_keyboard = new Array<
            [{text: string, callback_data : string}]>();
            
        if(faculties.length == 0)
            text = "Hi! I am sorry, but we cant propose you any category now(";
        for(let faculty of faculties){
            inline_keyboard.push([{text: faculty.name, callback_data: "/setfaculty" + faculty.name}]);
        }
        inline_keyboard.push([{"text": "New category", "callback_data": "/crfaculty"}], [{"text": "Back", "callback_data": "/menu"}]);
        await Menu._sendMessage(user, text, {inline_keyboard:inline_keyboard});
    }

    static async sendChangeFacultyMenu(user: User) {

        let faculties = await Faculty.GetAllFaculties();// new Array<IFaculty>(); faculties.push({name: "PZ"},{name: "KN"},{name: "Other"},{name: "PZ"});
        let text = "Choose your category, i will try to find reports for you";
        let inline_keyboard = new Array<
            [{text: string, callback_data : string}]>();
            
        if(faculties.length == 0)
            text = "Hi! I am sorry, but we cant propose you any category now(";
        for(let faculty of faculties){
            inline_keyboard.push([{text: faculty.name, callback_data: "/setfaculty" + faculty.name}]);
        }
        inline_keyboard.push([{"text": "New category", "callback_data": "/crfaculty"}], [{"text": "Back", "callback_data": "/menu"}]);
        await Menu._sendMessage(user, text, {inline_keyboard:inline_keyboard});
    }

    static async sendMenu(user: User) {
        const text = "What do you want to do?";
        const reply_markup = {
            "inline_keyboard": [
                [{"text": "Create report", "callback_data": "/crreport"}],
                [{"text": "Create template", "callback_data": "/crtemplate"}],
                [{"text": "Profile", "callback_data": "/profile"}],
                [{"text": "Support", "url": "https://telegram.me/u221b", "callback_data": "https://telegram.me/u221b"}]
            ]
        }
        await Menu._sendMessage(user, text, reply_markup);
    }

    static async sendCreateReportMenu(user: User) {
        const text = "Which template do you want to use? Your templates will be shown only in your collection!";
        const reply_markup = {
                "inline_keyboard": [
                    [{"text": "From my collection", "callback_data": "/mytemplates"}],
                    [{"text": "From the global collection", "callback_data": "/alltemplates"}],
                    [{"text": "Back to menu", "callback_data": "/menu"}]
                ]
        }
        await Menu._sendMessage(user, text, reply_markup);
    }

    static async sendChangeStatusMenu(user: User) {
        const text = "Changing status now is unavailible";
        const reply_markup = {
                "inline_keyboard": [
                    [{"text": "Back to menu", "callback_data": "/menu"}]
                ]
        }
        await Menu._sendMessage(user, text, reply_markup);
    }

    static async sendCreateTemplateMenu(user: User, text: string) {
        const parse_mode = 'Markdown';
        const reply_markup = {
            "inline_keyboard": [
                [{"text": "Public", "callback_data": "/setpubtemplate"}],
                [{"text": "Private", "callback_data": "/setprivtemplate"}]
            ]
        };
        // let text = "Баланс: " + user.balance + " руб" + "\n";

        
        await Menu._sendMessage(user, text ,reply_markup, parse_mode);
    }

    static async sendStats(user: User) {
        const parse_mode = 'Markdown';
        let user_status = "free";
        let text = 
            ` ✔ *category*    :   *${user.faculty == null? "guest": user.faculty.name}* \n`+
            ` ✔ *templates* :   *${user.templates.length}* \n` +
            ` ✔ *reports*      :   *${user.reports.length}*  \n`+
            ` ✔ *balance*     :   *${user.balance}* `;
        
        const reply_markup = {
            "inline_keyboard": [
                [{"text": "Change category", "callback_data": "/chfaculty"}],
                [{"text": "Refill balance", "callback_data": "/ibalance"}],
                [{"text": "Back", "callback_data": "/menu"}]
            ]
        };
        // let text = "Баланс: " + user.balance + " руб" + "\n";

        
        await Menu._sendMessage(user, text ,reply_markup, parse_mode);
    }


    static async sendUserTemplates(user: User, offset: number = 0, limit: number = 5) {
        const parse_mode = 'Markdown';
        let inline_keyboard = new Array<
        [{text: string, callback_data : string}]>();

        let text = "Availible templates:";
        if(user.templates.length == 0)
            text = "You have not created templates yet. Lets change it!";
        for(let i = offset; i < (user.templates.length < limit + offset? user.templates.length : limit + offset); i++)
            inline_keyboard.push([{text: user.templates[i].name, callback_data: "/template" + i.toString()}]);
        if(user.templates.length > (offset + limit)){
            inline_keyboard.push([{"text": "Next", "callback_data": "/mytemplates" + (offset + limit).toString()}]);
        }
        inline_keyboard.push([{"text": "Main menu", "callback_data": "/menu"}]);
        // let text = "Баланс: " + user.balance + " руб" + "\n";

        await Menu._sendMessage(user, text ,{inline_keyboard:inline_keyboard}, parse_mode);
    }


    static async sendAllTemplates(user: User, offset: number = 0, limit: number = 5) {
        const parse_mode = 'Markdown';
        const reply_markup = {
            "inline_keyboard": [
                [{"text": "Back", "callback_data": "/menu"}]
            ]
        };

        let inline_keyboard = new Array<
        [{text: string, callback_data : string}]>();

        let text = "Availible templates:";

        let templates = await DB.GetPublicTemplates(user.faculty.name, user.balance, user.templates);
        if(templates.length > 0){

            for(let i = offset; i < (templates.length < limit + offset? templates.length : limit + offset); i++)
                inline_keyboard.push([{text: templates[i].name, callback_data: "/alltemplate" + i.toString()}]);
            if(templates.length > (offset + limit) && user.balance > (offset + limit)){
                inline_keyboard.push([{"text": "Next", "callback_data": "/alltemplates" + (offset + limit).toString()}]);
            }
            else if( user.balance <= (offset + limit)){
                inline_keyboard.push([{"text": "Next", "callback_data": "/balance"}]);
                text = "There are no public templates for you. Refill your balance"
            }
        }
        else text = "I am sorry, there are not availible templates, but you can to create it by yourself!";
        inline_keyboard.push([{"text": "Main menu", "callback_data": "/menu"}]);
            
        // let text = "Баланс: " + user.balance + " руб" + "\n";

        
        await Menu._sendMessage(user, text ,{inline_keyboard:inline_keyboard}, parse_mode);
    }

    
    static async deleteMenu(user: User){
        try{
            bot.deleteMessage(user.id, user.menu_id);
        }
        catch(err){}
    }

    static async _sendMessage(user: User, text: string, reply_markup?: any, parse_mode?: string){
        let sendNew = !(user.last_message_id == user.menu_id);
        if(sendNew){
            await Menu._sendNew(user, text, reply_markup, parse_mode);
        }
        else{
            try{
                await Menu._replaceText(user, text, reply_markup, parse_mode);
            }
            catch(err){
                await Menu._sendNew(user, text, reply_markup, parse_mode);
            }
        }
    }
    

    static async _replaceText(user: User, text: string, reply_markup: any, parse_mode?: string){
        await bot.editMessageText(text, {chat_id: user.id, message_id: user.menu_id, reply_markup: reply_markup, parse_mode: parse_mode});
    }
    

    static async sendTextMessage(user: User, text: string, reply_markup?: any, parse_mode?: string){
        if(!reply_markup)
            reply_markup = {
                "inline_keyboard": [
                    [{"text": "Menu", "callback_data": "/menu"}]
                ]
            };
        Menu._sendNew(user,text,reply_markup, parse_mode);
    }

    static async _sendAndRemember(user: User, text: string, reply_markup?: any, parse_mode?: string){
        await bot.sendMessage(user.id, text, {parse_mode: 'HTML', reply_markup: reply_markup}).then(function (msg: any) {
            user.menu_id = msg.message_id;
            user.last_message_id = msg.message_id;
        });
    }

    static async _sendNew(user: User, text: string, reply_markup?: any, parse_mode?: string){
        await Menu.deleteMenu(user);
        Menu._sendAndRemember(user, text, reply_markup, parse_mode);
    }
}