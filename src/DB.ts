import {User, IUser} from "./user";
import { Template } from "./template";
import {MongoClient} from "mongodb"
import * as Mongo from "mongodb"

const db_url = 'mongodb://evkator:isl0952214823bag@ds159293.mlab.com:59293/polrebortbot';//*/'mongodb://localhost:27017/vklikebot';
const db_name = 'polrebortbot';

export default class DB
{
    static async UpdateUser(user: IUser){
        let client = await MongoClient.connect(db_url);
        const db = client.db(db_name);
        await db.collection('users').update({id : user.id}, user);
        await client.close();
    }

    static async GetUsersCollection(){
        let client = await MongoClient.connect(db_url);
        const db = client.db(db_name);
        return db.collection('users');
    }

    static async InsertUser(user: IUser){
        let client = await MongoClient.connect(db_url);
        const db = client.db(db_name);
        await db.collection('users').insertOne(user);
        await client.close();
    }


    static async GetUser(id: number){
        const collection = await DB.GetUsersCollection();
        return await /*User.fromJSON(*/collection.findOne({id: id}, { });
    }

    static async GetAllUsers(){
        const collection = await DB.GetUsersCollection();
        return await /*User.fromJSON(*/collection.find();
    }

    static async GetUserByVkUname(vk_uname: string){
        const collection = await DB.GetUsersCollection();
        return await collection.findOne({'vk_acc.uname':vk_uname});
    }

    static async GetAllFaculties(){
        const client = await MongoClient.connect(db_url);
        const db = client.db(db_name);
        let faculties: Array<any> = new Array();
        let facnames = new Array<string>();
        await db.collection('users').find().forEach((element:any) => {
            element.templates.forEach((element: any) => {
                facnames.push(element.faculty.name);
            });
        });

        function onlyUnique(value:any, index: any, self: any) { 
            return self.indexOf(value) === index;
        }
        facnames = facnames.filter(onlyUnique);
        for(let fac of facnames){
            faculties.push({name:fac})
        }
        
        return faculties;
    }

    static async GetFacultyByName(name: string){
        const client = await MongoClient.connect(db_url);
        const db = client.db(db_name);
        let faculty: any;
        await db.collection('users').find().forEach((element:any) => {
            element.templates.forEach((element: any) => {
                if(element.faculty.name == name)
                    faculty = element.faculty;
            });
        });

        return faculty;
    }
    
    ////////////TEMPLATE///////////////////////

    static async GetPublicTemplates(facultyName: string, balance: number, userTemplates: any){
        const client = await MongoClient.connect(db_url);
        const db = client.db(db_name);
        let templates: Array<any> = new Array();
        
        await db.collection('users').find().forEach((element:any) => {
            element.templates.forEach((template:any) => {
                if(template.confirmed == true && template.isPrivate == false && template.faculty.name == facultyName 
                    && userTemplates.findIndex((e: any)=>e.name == template.name) == -1 )
                    templates.push(template);
            });
        });
        return templates.slice(0,balance < templates.length? balance : templates.length);
    }


    static async GetTemplatesCollection(){
        const client = await MongoClient.connect(db_url);
        const db = client.db(db_name);
        const collection = db.collection('templates') ;
        return collection;
    }
    
    static async InsertTemplate(template: Template){
        console.log(JSON.stringify(template));
        const jsonU = template.toJSON();
        let client = await MongoClient.connect(db_url);
        const db = client.db(db_name);
        await db.collection('templates').insertOne(jsonU);
        await client.close();
    }
}

