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
        nMenu.sendTextMessage(user, "Вам подарок: " + salary + " руб");
    }

    static async SendTo(user: User, text: string, parse_mode: string = 'HTML'){
        nMenu.sendTextMessage(user, text, null, parse_mode);
    }

    static async checkAllTasks(){

    }
}