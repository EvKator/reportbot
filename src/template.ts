
import {bot} from './telegram_connection';
import DB from './DB';
import * as fs from 'fs';
import * as Path from 'path';

import * as doc from "./docx_processor";
import { IFaculty } from './faculty';

export interface ITemplate{
    name: string,
    path: string,
    placeholders: string[],
    faculty:IFaculty,
    isPrivate : boolean
}

export class Template implements ITemplate {
    private _name: string;
    private _path: string;
    private _placeholders : string[];
    private _faculty:IFaculty;
    private _isPrivate:boolean;


    constructor(name:string, path: string, faculty : IFaculty, isPrivate: boolean, placeholders? : string[]){
        // super();
        this._name = name;
        this._path = path;
        this._placeholders = placeholders? placeholders : doc.tagsCount(path);
        this._faculty = faculty;
        
        this._isPrivate =  isPrivate;
    }

    public static async GetPublicTemplate(faculty: string, id : number){
        let template: ITemplate = (await DB.GetPublicTemplates(faculty))[id];

        return Template.fromJSON(template);
    }
    
   
    static fromJSON(jsonT: ITemplate){
        return new Template(jsonT.name, jsonT.path, jsonT.faculty, jsonT.isPrivate, jsonT.placeholders);
    }

    toJSON() : ITemplate {
        let jsonU = {
            name : this.name,
            path : this.path,
            placeholders: this._placeholders,
            faculty: this._faculty,
            isPrivate: this._isPrivate
        };
        return jsonU;
    }

    static folderName : string = "templates";

    //#region getters-setters
    set name(name: string){
        this._name = name;
    }

    get name(): string{
        return this._name;
    }

    get placeholders(): string[]{
        return this._placeholders;
    }

    set path(path: string){
        this._path = path;
    }

    get path(): string{
        return this._path;
    }

    set faculty(faculty:IFaculty){
        this._faculty = faculty;
    }

    get faculty(): IFaculty{
        return this._faculty;
    }

    set isPrivate(isPrivate:boolean){
        this._isPrivate = isPrivate;
    }

    get isPrivate(): boolean{
        return this._isPrivate;
    }
    //#endregion
}
