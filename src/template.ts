
import {bot} from '../src/telegram_connection';
import DB from './DB';
import * as fs from 'fs';
import * as Path from 'path';

interface ITemplate{
    name: string,
    path: string,
    author_id : number
}

export class Template{
    private _name: string;
    private _path: string;
    private _author_id: number;


    constructor(author_id : number, name:string, path?: string){
        this._name = name;
        this._author_id = author_id;
        if(typeof(path) == "undefined")
            this._path = "";
        else
            this._path = path;
    }
    
    getFreePath(){
        let fileName = this.name;
        let i = 0;
        while(  fs.existsSync(Template.folderName + "/" + fileName)){
            fileName = this.name + i.toString() + ".docx";
        }
        return fileName;
    }

    async save(){
        await this.saveToDB();
        // fs.
    }
    

    async saveToDB(){
        await DB.InsertTemplate(this);
    }

    static async fromDB(name: string){
        var jsonT = await DB.GetTemplate(name);
        console.log(JSON.stringify(jsonT));
        let template = Template.fromJSON(jsonT);
        return template;
    }


    static fromJSON(jsonT: ITemplate){
        return new Template(jsonT.author_id, jsonT.name, jsonT.path);
    }

    toJSON() : ITemplate {
        let jsonU = {
            name : this.name,
            path : this.path,
            author_id : this.author_id
        };
        return jsonU;
    }

    static folderName : string = "templates";

    //#region getters-setters
    set name(name: string){
        this._name = name;
        console.log("update");
        // this.update();
    }

    get name(): string{
        return this._name;
    }

    set path(path: string){
        this._path = path;
        console.log("update");
        // this.update();
    }

    get path(): string{
        return this._name;
    }

    set author_id(author_id: number){
        this._author_id = author_id;
        console.log("update");
        // this.update();
    }

    get author_id(): number{
        return this._author_id;
    }
    //#endregion
}
