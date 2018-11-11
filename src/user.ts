
import {bot} from '../src/telegram_connection';
import DB from './DB';
import { Template, ITemplate } from './template';
import { Report } from './report';





export interface IUser{
    id: number,
    menu_id: number,
    last_message_id: number,
    username: string,
    first_name: string,
    last_name: string,
    status: string,
    templates: ITemplate[],
    reports: IReport[],
}

export class User implements IUser {
    private _existInDB: boolean = false;
    private _id: number;
    private _menu_id: number;
    private _last_message_id: number;
    private _username: string;
    private _first_name: string;
    private _last_name: string;
    private _status: string;
    private _templates: Template[];
    private _reports: Report[];



    constructor(id: number, username: string = '', first_name: string, last_name: string = '', status?: string, menu_id?: number, last_message_id?: number, templates?: Template[], reports?: Report[]){
        
        if(!status){
            status = 'new_user';
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
        this._templates = templates?templates : new Array<Template>();
        this._reports = reports? reports : new Array<Report>();
    }

    

    async update(){
        await DB.UpdateUser(this.toJSON());
    }



    public addTemplate(t: Template){
        this._templates.push(t);
        this.update();
    }

    public addReport(t: Report){
        this._reports.push(t);
        this.update();
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
        await DB.InsertUser(this.toJSON());
    }

    static async fromDB(id: number){
        const jsonU = await DB.GetUser(id);
        let user = User.fromJSON(jsonU);
        return user;
    }


    static fromJSON(jsonU: IUser){
        return new User( jsonU.id, jsonU.username, jsonU.first_name, jsonU.last_name, jsonU.status, jsonU.menu_id
            , jsonU.last_message_id, jsonU.templates? jsonU.templates.map(el=>Template.fromJSON(el)) : null , jsonU.reports? jsonU.reports.map(el=>Report.fromJSON(el)) : null );
    }

    toJSON(): IUser{
        
        let jsonU :IUser = {
            id : this.id,
            username : this.username,
            first_name : this.first_name,
            last_name : this.last_name,
            status : this.status,
            menu_id : this.menu_id,
            last_message_id : this.last_message_id,
            templates: this._templates? this._templates.map(function(el){ return el.toJSON(); }): null,
            reports: this._reports? this._reports.map(function(el){ return el.toJSON(); }) : null
        };
        return jsonU;
    }

    toAdmString(){
        return JSON.stringify(this.toJSON(), null, 4);
    }

    //#region get-set
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

    get templates(){
        return this._templates;
    }

    get reports(){
        return this._reports;
    }
    
    
    
    get last_message_id(){
        return this._last_message_id;
    }
    
    set last_message_id(val){
        this._last_message_id = val;
        this.update();
    }
    //#endregion
}
