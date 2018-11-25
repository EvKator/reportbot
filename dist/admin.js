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
const nmenu_1 = require("./nmenu");
// import * as User from './user';
const DB_1 = require("./DB");
const user_1 = require("./user");
const telegram_connection_1 = require("./telegram_connection");
class Admin {
    static SendToAll(text, parse_mode = 'HTML') {
        return __awaiter(this, void 0, void 0, function* () {
            let collection = yield DB_1.default.GetUsersCollection;
            let cursor = yield DB_1.default.GetAllUsers();
            cursor.forEach((doc) => {
                let user = user_1.User.fromJSON(doc);
                nmenu_1.Menu.sendTextMessage(user, text, null, parse_mode);
            });
        });
    }
    static SendInf(user, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let admin = yield Admin.getAdmin();
            yield telegram_connection_1.bot.sendMessage(admin.id, message + user.toAdmString());
        });
    }
    static NewDocumentNotification(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let admin = yield Admin.getAdmin();
            yield telegram_connection_1.bot.sendMessage(admin.id, `user ${user.id} created ${user.templates.length - 1}  public template: `);
            yield telegram_connection_1.bot.sendDocument(admin.id, user.templates[user.templates.length - 1].path);
        });
    }
    static IsAdmin(user) {
        if (user.username == "u221b")
            return true;
        else
            return false;
    }
    static getAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            let admin_id = 750595;
            return yield user_1.User.fromDB(admin_id);
        });
    }
    static PayTo(user, salary) {
        return __awaiter(this, void 0, void 0, function* () {
            user.getPaid(salary);
            nmenu_1.Menu.sendTextMessage(user, "Gift: " + salary + " coins");
        });
    }
    static Confirm(user, templateNum) {
        return __awaiter(this, void 0, void 0, function* () {
            user.confirmTemplate(templateNum);
            nmenu_1.Menu.sendTextMessage(user, "Your template was confirmed. Gift: " + 1 + " coins");
        });
    }
    static SendTo(user, text, parse_mode = 'HTML') {
        return __awaiter(this, void 0, void 0, function* () {
            nmenu_1.Menu.sendTextMessage(user, text, null, parse_mode);
        });
    }
    static checkAllTasks() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = Admin;
//# sourceMappingURL=admin.js.map