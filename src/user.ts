
import {bot} from '../src/telegram_connection';
import DB from './DB';

export class User{
    private _existInDB: boolean = false;
    private _id: number;
    private _menu_id: number;
    private _last_message_id: number;
    private _username: string;
    private _first_name: string;
    private _last_name: string;
    private _status: string;


    constructor(id: number, username: string = '', first_name: string, last_name: string = '', status?: string, balance?: number, menu_id?: number, last_message_id?: number){
        if(!status){
            status = 'new_user';
            balance = 0;
            menu_id = 0;
            this._existInDB = false;
            last_message_id = 0;
        }
        else
            this._existInDB = true;
        this._id = id;
        this._username = username;
        this._first_name = first_name;
        this._last_name = last_name;
        this._status = status;
        this._menu_id = menu_id;
        this._last_message_id = last_message_id;
    }

    

    async update(){
        await DB.UpdateUser(this);
    }


    static async getSender(msg: any){
        let telegUser = msg.from;
        let user;
        try{
            user = await User.fromDB(telegUser.id);
        }
        catch(err) {
            user = new User( telegUser.id, telegUser.username, telegUser.first_name, telegUser.last_name);
        }
        return user;
    }

    async saveToDB(){
        await DB.InsertUser(this);
    }

    static async fromDB(id: number){
        const jsonU = await DB.GetUser(id);
        let user = User.fromJSON(jsonU);
        return user;
    }


    static fromJSON(jsonU: any){
        return new User( jsonU.id, jsonU.username, jsonU.first_name, jsonU.last_name, jsonU.status,
             jsonU.balance,  jsonU.menu_id, jsonU.last_message_id);
    }

    toJSON(){
        let jsonU = {
            id : this.id,
            username : this.username,
            first_name : this.first_name,
            last_name : this.last_name,
            status : this.status,
            menu_id : this.menu_id,
            last_message_id : this.last_message_id
        };
        return jsonU;
    }

    toAdmString(){
        return JSON.stringify(this.toJSON(), null, 4);
    }

    /////////////////////////////////getters,setters
    set menu_id(menu_id){
        this._menu_id = menu_id;
        this.update();
    }

    get menu_id(){
        return this._menu_id;
    }
    
    set status(status){
        this._status = status;
        this.update();
    }
    
    get ExistInDB(){
        return this._existInDB;
    }
    
    get id(){
        return this._id;
    }
    
    get username(){
        return this._username;
    }
    
    get first_name(){
        return this._first_name;
    }
    
    get last_name(){
        return this._last_name;
    }
    
    get status(){
        return this._status;
    }
    
    
    
    get last_message_id(){
        return this._last_message_id;
    }
    
    set last_message_id(val){
        this._last_message_id = val;
        this.update();
    }
}
