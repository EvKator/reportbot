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
const DB_1 = require("./DB");
const template_1 = require("./template");
const report_1 = require("./report");
class User {
    constructor(id, username = '', first_name, last_name = '', balance, faculty, status, menu_id, last_message_id, templates, reports) {
        this._existInDB = false;
        if (!status) {
            status = 'new_user';
            menu_id = 0;
            this._existInDB = false;
            last_message_id = 0;
            balance = 5;
        }
        else
            this._existInDB = true;
        this._balance = balance;
        this._id = id;
        this._username = username;
        this._first_name = first_name;
        this._last_name = last_name;
        this._status = status;
        this._menu_id = menu_id;
        this._last_message_id = last_message_id;
        this._templates = templates ? templates : new Array();
        this._reports = reports ? reports : new Array();
        this._faculty = faculty;
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            yield DB_1.default.UpdateUser(this.toJSON());
        });
    }
    generateReport() {
        return this.reports[this.reports.length - 1].generate();
    }
    addTemplate(t) {
        return __awaiter(this, void 0, void 0, function* () {
            this._templates.push(t);
            yield this.update();
        });
    }
    setTemplatePrivacy(isPrivate) {
        return __awaiter(this, void 0, void 0, function* () {
            this._templates[this._templates.length - 1].isPrivate = isPrivate;
            yield this.update();
        });
    }
    addReport(t) {
        return __awaiter(this, void 0, void 0, function* () {
            this._reports.push(t);
            yield this.update();
        });
    }
    confirmLastTemplate() {
        return __awaiter(this, void 0, void 0, function* () {
            this._templates[this._templates.length - 1].confirmed = true;
            yield this.update();
            yield this.getPaid(1);
        });
    }
    addReportReplacement(replacement) {
        return __awaiter(this, void 0, void 0, function* () {
            this.reports[this.reports.length - 1].replacement.push(replacement);
            yield this.update();
            console.log(this.reports[this.reports.length - 1].replacement.length);
            return this.reports[this.reports.length - 1].replacement.length;
        });
    }
    static getSender(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            let telegUser = msg.from;
            let user;
            try {
                user = yield User.fromDB(telegUser.id);
            }
            catch (err) {
                user = new User(telegUser.id, telegUser.username, telegUser.first_name, telegUser.last_name);
            }
            return user;
        });
    }
    saveToDB() {
        return __awaiter(this, void 0, void 0, function* () {
            yield DB_1.default.InsertUser(this.toJSON());
        });
    }
    static fromDB(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const jsonU = yield DB_1.default.GetUser(id);
            let user = User.fromJSON(jsonU);
            return user;
        });
    }
    getPaid(coins) {
        return __awaiter(this, void 0, void 0, function* () {
            this._balance = Number(this._balance) + Number(coins);
            yield this.update();
        });
    }
    static fromJSON(jsonU) {
        return new User(jsonU.id, jsonU.username, jsonU.first_name, jsonU.last_name, jsonU.balance, jsonU.faculty, jsonU.status, jsonU.menu_id, jsonU.last_message_id, jsonU.templates ? jsonU.templates.map(el => template_1.Template.fromJSON(el)) : null, jsonU.reports ? jsonU.reports.map(el => report_1.Report.fromJSON(el)) : null);
    }
    toJSON() {
        let jsonU = {
            id: this.id,
            username: this.username,
            first_name: this.first_name,
            last_name: this.last_name,
            status: this.status,
            menu_id: this.menu_id,
            last_message_id: this.last_message_id,
            templates: this._templates ? this._templates.map(function (el) { return el.toJSON(); }) : null,
            reports: this._reports ? this._reports.map(function (el) { return el.toJSON(); }) : null,
            faculty: this._faculty,
            balance: this._balance
        };
        return jsonU;
    }
    toAdmString() {
        return JSON.stringify(this.toJSON(), null, 4);
    }
    //#region get-set
    set menu_id(menu_id) {
        this._menu_id = menu_id;
        this.update();
    }
    get menu_id() {
        return this._menu_id;
    }
    set status(status) {
        this._status = status;
        this.update();
    }
    get ExistInDB() {
        return this._existInDB;
    }
    get id() {
        return this._id;
    }
    get username() {
        return this._username;
    }
    get first_name() {
        return this._first_name;
    }
    get last_name() {
        return this._last_name;
    }
    get status() {
        return this._status;
    }
    get templates() {
        return this._templates;
    }
    get reports() {
        return this._reports;
    }
    get last_message_id() {
        return this._last_message_id;
    }
    set last_message_id(val) {
        this._last_message_id = val;
        this.update();
    }
    get faculty() {
        return this._faculty;
    }
    set faculty(val) {
        this._faculty = val;
        this.update();
    }
    get balance() {
        return this._balance;
    }
    set balance(val) {
        this._balance = val;
        this.update();
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map