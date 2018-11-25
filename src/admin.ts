import {Menu} from './nmenu';
// import * as User from './user';
import DB from './DB';
import { User } from './user';
import {bot} from "./telegram_connection";

export default class Admin{
    static async SendToAll(text: string, parse_mode = 'HTML'){
        let collection = await DB.GetUsersCollection;
        let cursor = await DB.GetAllUsers(); 
        cursor.forEach((doc: any) =>{
            let user = User.fromJSON(doc);
            Menu.sendTextMessage(user, text, null, parse_mode);
        });
    }

    static async SendInf(user: User, message : string){
        let admin = await Admin.getAdmin(); 
        await bot.sendMessage(admin.id, message + user.toAdmString());
    }

    static async NewDocumentNotification(user: User){
        let admin = await Admin.getAdmin(); 
        await bot.sendMessage(admin.id, `user ${user.id} created ${user.templates.length - 1}  public template: `);
        await bot.sendDocument(admin.id, user.templates[user.templates.length - 1].path);
    }

    static IsAdmin(user: User){
        if(user.username == "u221b")
            return true;
        else return false;
    }

    static async getAdmin(): Promise<User>{
        let admin_id = 750595;
        return await User.fromDB(admin_id);
    }

    static async PayTo(user: User, salary: number){
        user.getPaid(salary);
        Menu.sendTextMessage(user, "Gift: " + salary + " coins");
    }
    

    static async Confirm(user: User, templateNum: number){
        user.confirmTemplate(templateNum);
        Menu.sendTextMessage(user, "Your template was confirmed. Gift: " + 1 + " coins");
    }

    static async SendTo(user: User, text: string, parse_mode: string = 'HTML'){
        Menu.sendTextMessage(user, text, null, parse_mode);
    }

    static async checkAllTasks(){

    }
}