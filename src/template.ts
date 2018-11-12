
import {bot} from '../src/telegram_connection';
import DB from './DB';
import * as fs from 'fs';
import * as Path from 'path';

import * as doc from "../src/docx_processor";

export interface ITemplate{
    name: string,
    path: string,
    placeholders: string[]
}

export class Template implements ITemplate {
    private _name: string;
    private _path: string;
    private _placeholders : string[];


    constructor(name:string, path: string, placeholders? : string[]){
        // super();
        this._name = name;
        this._path = path;
        this._placeholders = placeholders? placeholders : doc.tagsCount(path);
    }
    
   

    static async fromDB(name: string){
        var jsonT = await DB.GetTemplate(name);
        console.log(JSON.stringify(jsonT));
        let template = Template.fromJSON(jsonT);
        return template;
    }


    static fromJSON(jsonT: ITemplate){
        return new Template(jsonT.name, jsonT.path, jsonT.placeholders);
    }

    toJSON() : ITemplate {
        let jsonU = {
            name : this.name,
            path : this.path,
            placeholders: this._placeholders
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

    get placeholders(): string[]{
        return this._placeholders;
    }

    set path(path: string){
        this._path = path;
        console.log("update");
        // this.update();
    }

    get path(): string{
        return this._path;
    }
    //#endregion
}
