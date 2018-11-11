
import {bot} from '../src/telegram_connection';
import DB from './DB';
import * as fs from 'fs';
import * as Path from 'path';

export interface ITemplate{
    name: string,
    path: string,
    placeholdersCount: number
}

export class Template implements ITemplate {
    private _name: string;
    private _path: string;
    private _placeholdersCount : number;


    constructor(placeholdersCount : number, name:string, path?: string){
        // super();
        this._name = name;
        this._placeholdersCount = placeholdersCount;
        if(typeof(path) == "undefined")
            this._path = "";
        else
            this._path = path;
    }
    
   

    static async fromDB(name: string){
        var jsonT = await DB.GetTemplate(name);
        console.log(JSON.stringify(jsonT));
        let template = Template.fromJSON(jsonT);
        return template;
    }


    static fromJSON(jsonT: ITemplate){
        return new Template(jsonT.placeholdersCount, jsonT.name, jsonT.path);
    }

    toJSON() : ITemplate {
        let jsonU = {
            name : this.name,
            path : this.path,
            placeholdersCount: this._placeholdersCount
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

    get placeholdersCount(): number{
        return this._placeholdersCount;
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
