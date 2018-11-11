import {User, IUser} from "../src/user";
import { Template } from "./template";

const MongoClient = require('mongodb').MongoClient;

const db_url = 'mongodb://evkator:isl0952214823bag@ds159293.mlab.com:59293/polrebortbot';//*/'mongodb://localhost:27017/vklikebot';
const db_name = 'polrebortbot';

export default class DB
{
    static async UpdateUser(user: IUser ){
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
    
    ////////////TEMPLATE///////////////////////

    static async GetTemplatesCollection(){
        const client = await MongoClient.connect(db_url);
        const db = client.db(db_name);
        const collection = db.collection('templates') ;
        return collection;
    }
    
    static async GetTemplate(name:string){
        const collection = await DB.GetTasksCollection();
        return await collection.findOne({name: name});
    }

    static async InsertTemplate(template: Template){
        console.log(JSON.stringify(template));
        const jsonU = template.toJSON();
        let client = await MongoClient.connect(db_url);
        const db = client.db(db_name);
        await db.collection('templates').insertOne(jsonU);
        await client.close();
    }

    


    ////////////TASK///////////////////

    static async GetTasksCollection(){
        const client = await MongoClient.connect(db_url);
        const db = client.db(db_name);
        const collection = db.collection('tasks');
        return collection;
    }
    
    static async GetTask(taskname: string, tasktype?: string){
        const collection = await DB.GetTasksCollection();
        if(tasktype)
            return await collection.findOne({taskname: taskname}, {type: tasktype});
        else
            return  await collection.findOne({taskname: taskname}, { });
    }

    static async GetTasksOfUser(user: User){
        console.log("dssssssssssfffffffffffffssssssssssssssssss");
        const collection = await DB.GetTasksCollection();
        let cursor = await collection.find({author_id:user.id});
        let arr = await cursor.toArray();
        return arr;
    }

    // static async GetTaskForUser(user: User, type: string){
    //     const collection = await DB.GetTasksCollection();
    //     let res = await collection.findOne({workers: {$not: {$elemMatch : {user_id:user.id}}}, 
    //         author_id:{$ne: user.id}, type: type, status : {$ne : 'done'}});
    //     return res;
    // }

    // static async InsertTask(task: Task){
    //     let jsonT = task.toJSON();
    //     let client = await MongoClient.connect(db_url);
    //     const db = client.db(db_name);
    //     await db.collection('tasks').insertOne(jsonT);
    //     client.close();
    // }

    // static async UpdateTask(task: Task){
    //     const jsonT = task.toJSON();
    //     const client = await MongoClient.connect(db_url);
    //     const db = client.db(db_name);
    //     await db.collection('tasks').update({taskname : task.taskname}, task.toJSON());
    //     client.close();
    // }
}

