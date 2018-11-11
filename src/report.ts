import { Template } from "./template";

export interface IReport{
    replacement: string[],
    template: Template,
    name: string,
    path: string
}

export class Report implements IReport{
    _replacement: string[];
    _template: Template;
    _name: string;
    _path: string;

    constructor(nname: string, )

    toJSON():IReport{
        let jsonR = {
            replacement : this._replacement,
            template : this._template,
            name : this._name,
            path : this._path
        }
        return jsonR;
    }

    static fromJSON(jsonR: IReport){
        return new Report();
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