import DB from "./DB";

export interface IFaculty{
    name:string
}

export class Faculty implements IFaculty{
    name : string;
    constructor(name:string){
        this.name = name;
    }

    public static fromJSON(jfac: IFaculty){
        return new Faculty(jfac.name);
    }

    static async GetAllFaculties(){
        let faculties = new Array<Faculty>();
        await (await DB.GetAllFaculties()).forEach(element => {
            faculties.push(Faculty.fromJSON(element));
        });
        return faculties;
    }

    static async GetFacultyByName(name:string){
        let faculty = Faculty.fromJSON(await DB.GetFacultyByName(name));
        return faculty;
    }
}