"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const db_url = 'mongodb://evkator:isl0952214823bag@ds159293.mlab.com:59293/polrebortbot'; //*/'mongodb://localhost:27017/vklikebot';
const db_name = 'polrebortbot';
class DB {
    static UpdateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let client = yield mongodb_1.MongoClient.connect(db_url);
            const db = client.db(db_name);
            yield db.collection('users').update({ id: user.id }, user);
            yield client.close();
        });
    }
    static GetUsersCollection() {
        return __awaiter(this, void 0, void 0, function* () {
            let client = yield mongodb_1.MongoClient.connect(db_url);
            const db = client.db(db_name);
            return db.collection('users');
        });
    }
    static InsertUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let client = yield mongodb_1.MongoClient.connect(db_url);
            const db = client.db(db_name);
            yield db.collection('users').insertOne(user);
            yield client.close();
        });
    }
    static GetUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield DB.GetUsersCollection();
            return yield collection.findOne({ id: id }, {});
        });
    }
    static GetAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield DB.GetUsersCollection();
            return yield collection.find();
        });
    }
    static GetUserByVkUname(vk_uname) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield DB.GetUsersCollection();
            return yield collection.findOne({ 'vk_acc.uname': vk_uname });
        });
    }
    static GetAllFaculties() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield mongodb_1.MongoClient.connect(db_url);
            const db = client.db(db_name);
            let faculties = new Array();
            let facnames = new Array();
            yield db.collection('users').find().forEach((element) => {
                element.templates.forEach((element) => {
                    facnames.push(element.faculty.name);
                });
            });
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }
            facnames = facnames.filter(onlyUnique);
            for (let fac of facnames) {
                faculties.push({ name: fac });
            }
            return faculties;
        });
    }
    static GetFacultyByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield mongodb_1.MongoClient.connect(db_url);
            const db = client.db(db_name);
            let faculty;
            yield db.collection('users').find().forEach((element) => {
                element.templates.forEach((element) => {
                    if (element.faculty.name == name)
                        faculty = element.faculty;
                });
            });
            return faculty;
        });
    }
    ////////////TEMPLATE///////////////////////
    static GetPublicTemplates(facultyName, balance, userTemplates) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield mongodb_1.MongoClient.connect(db_url);
            const db = client.db(db_name);
            let templates = new Array();
            yield db.collection('users').find().forEach((element) => {
                element.templates.forEach((template) => {
                    if (template.confirmed == true && template.isPrivate == false && template.faculty.name == facultyName
                        && userTemplates.findIndex((e) => e.name == template.name) == -1)
                        templates.push(template);
                });
            });
            return templates.slice(0, balance < templates.length ? balance : templates.length);
        });
    }
    static GetTemplatesCollection() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield mongodb_1.MongoClient.connect(db_url);
            const db = client.db(db_name);
            const collection = db.collection('templates');
            return collection;
        });
    }
    static InsertTemplate(template) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(JSON.stringify(template));
            const jsonU = template.toJSON();
            let client = yield mongodb_1.MongoClient.connect(db_url);
            const db = client.db(db_name);
            yield db.collection('templates').insertOne(jsonU);
            yield client.close();
        });
    }
}
exports.default = DB;
//# sourceMappingURL=DB.js.map