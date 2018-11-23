import { Template, ITemplate } from "./template";

import * as doc from "./docx_processor";



export interface IReport{
    replacement: string[],
    template: ITemplate,
    name: string,
    path: string
}

export class Report implements IReport{
    _replacement: string[];
    _template: Template;
    _name: string;
    _path: string;

    constructor(name: string, path:string, template: Template, replacement? : string[] ){
        this._name = name;
        this._path = path;
        this._template = template;
        this._replacement = replacement? replacement : new Array<string>();
    }

    toJSON():IReport{
        let jsonR = {
            replacement : this._replacement,
            template : this._template.toJSON(),
            name : this._name,
            path : this._path
        }
        return jsonR;
    }

    generate(){
        let keyValue : Array<{key:string, value: string}> = new Array();
        for(let i = 0; i < this.replacement.length; i++){
            keyValue.push(
                { 
                    key : this.template.placeholders[i], 
                    value: this.replacement[i]
                } );
        
        }
        console.log(keyValue.toString());
        
        let fileDest = "reports/" + createKey(10) + ".docx";
        doc.replace(`${__dirname}/../` + this.template.path, fileDest , keyValue);
        console.log(fileDest);
        return fileDest;
    }

    static fromJSON(jsonR: IReport){
        return new Report(jsonR.name, jsonR.path, Template.fromJSON(jsonR.template) , jsonR.replacement);
    }

    get replacement(){
        return this._replacement;
    }

    get template(){
        return this._template;
    }

    get path(){
        return this._path;
    }

    get name(){
        return this._name;
    }
}

function createKey (n: number){
    var s ='';
    while(s.length < n)
        s += String.fromCharCode(Math.random() * 1106).replace(/[^a-zA-Z]|_/g,'');
    return s;
}