import {bot} from '../src/telegram_connection';

import {User} from '../src/user';
import { Template } from './template';

interface TLReplyMatkup{
    inline_keyboard: [[string, string]
    ]
}

export class Menu {

    static async sendMenu(user: User) {
        const text = "What do you want to do?";
        const reply_markup = {
                "inline_keyboard": [
                    [{"text": "My templates", "callback_data": "/templates"}],
                    [{"text": "Create report", "callback_data": "/crreport"}],
                    [{"text": "Create template", "callback_data": "/crtemplate"}],
                    [{"text": "Support", "url": "https://telegram.me/u221b", "callback_data": "https://telegram.me/u221b"}]
                ]
        }
        await Menu._sendMessage(user, text, reply_markup);
    }




    static async sendStats(user: User) {
        const parse_mode = 'Markdown';
        const reply_markup = {
            "inline_keyboard": [
                [{"text": "Back", "callback_data": "/menu"}]
            ]
        };
        // let text = "Баланс: " + user.balance + " руб" + "\n";

        
        await Menu._sendMessage(user, " ",reply_markup, parse_mode);
    }


    static async sendUserTemplates(user: User) {
        const parse_mode = 'Markdown';
        const reply_markup = {
            "inline_keyboard": [
                [{"text": "Back", "callback_data": "/menu"}]
            ]
        };
        let text = "";
        for(let i = 0; i < user.templates.length; i++)
            text+= user.templates[i].name + ` ----- /template${i}  \n`
        // let text = "Баланс: " + user.balance + " руб" + "\n";

        
        await Menu._sendMessage(user, text ,reply_markup, parse_mode);
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
                    [{"text": "В меню!", "callback_data": "/menu"}]
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