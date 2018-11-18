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
const telegram_connection_1 = require("./telegram_connection");
const DB_1 = require("./DB");
const faculty_1 = require("./faculty");
class Menu {
    static sendStartMenu(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let faculties = yield faculty_1.Faculty.GetAllFaculties(); // new Array<IFaculty>(); faculties.push({name: "PZ"},{name: "KN"},{name: "Other"},{name: "PZ"});
            let text = "Hi! I am polreportbot, i can help you with creation your reports to polytech!" +
                "Choose your faculty, i will try to find reports for you";
            let inline_keyboard = new Array();
            if (faculties.length == 0)
                text = "Hi! I am sorry, but we cant propose you any faculty now(";
            for (let faculty of faculties) {
                inline_keyboard.push([{ text: faculty.name, callback_data: "/setfaculty" + faculty.name }]);
            }
            inline_keyboard.push([{ "text": "New faculty", "callback_data": "/crfaculty" }], [{ "text": "Back", "callback_data": "/menu" }]);
            yield Menu._sendMessage(user, text, { inline_keyboard: inline_keyboard });
        });
    }
    static sendChangeFacultyMenu(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let faculties = yield faculty_1.Faculty.GetAllFaculties(); // new Array<IFaculty>(); faculties.push({name: "PZ"},{name: "KN"},{name: "Other"},{name: "PZ"});
            let text = "Choose your faculty, i will try to find reports for you";
            let inline_keyboard = new Array();
            if (faculties.length == 0)
                text = "Hi! I am sorry, but we cant propose you any faculty now(";
            for (let faculty of faculties) {
                inline_keyboard.push([{ text: faculty.name, callback_data: "/setfaculty" + faculty.name }]);
            }
            inline_keyboard.push([{ "text": "New faculty", "callback_data": "/crfaculty" }], [{ "text": "Back", "callback_data": "/menu" }]);
            yield Menu._sendMessage(user, text, { inline_keyboard: inline_keyboard });
        });
    }
    static sendMenu(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const text = "What do you want to do?";
            const reply_markup = {
                "inline_keyboard": [
                    [{ "text": "Create report", "callback_data": "/crreport" }],
                    [{ "text": "Create template", "callback_data": "/crtemplate" }],
                    [{ "text": "Profile", "callback_data": "/profile" }],
                    [{ "text": "Support", "url": "https://telegram.me/u221b", "callback_data": "https://telegram.me/u221b" }]
                ]
            };
            yield Menu._sendMessage(user, text, reply_markup);
        });
    }
    static sendCreateReportMenu(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const text = "Which template do you want to use?";
            const reply_markup = {
                "inline_keyboard": [
                    [{ "text": "From my collection", "callback_data": "/mytemplates" }],
                    [{ "text": "From the global collection", "callback_data": "/alltemplates" }],
                    [{ "text": "Back to menu", "callback_data": "/menu" }]
                ]
            };
            yield Menu._sendMessage(user, text, reply_markup);
        });
    }
    static sendChangeStatusMenu(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const text = "Changing status now is unavailible";
            const reply_markup = {
                "inline_keyboard": [
                    [{ "text": "Back to menu", "callback_data": "/menu" }]
                ]
            };
            yield Menu._sendMessage(user, text, reply_markup);
        });
    }
    static sendCreateTemplateMenu(user, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const parse_mode = 'Markdown';
            const reply_markup = {
                "inline_keyboard": [
                    [{ "text": "Public", "callback_data": "/setpubtemplate" }],
                    [{ "text": "Private", "callback_data": "/setprivtemplate" }]
                ]
            };
            // let text = "Баланс: " + user.balance + " руб" + "\n";
            yield Menu._sendMessage(user, text, reply_markup, parse_mode);
        });
    }
    static sendStats(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const parse_mode = 'Markdown';
            let user_status = "free";
            let text = `Your profile is " + ${user_status}\n` +
                `you have created ${user.templates.length} template\n` +
                `and ${user.reports.length} reports`;
            const reply_markup = {
                "inline_keyboard": [
                    [{ "text": "Change faculty", "callback_data": "/chfaculty" }],
                    [{ "text": "Change status", "callback_data": "/chstatus" }],
                    [{ "text": "Back", "callback_data": "/menu" }]
                ]
            };
            // let text = "Баланс: " + user.balance + " руб" + "\n";
            yield Menu._sendMessage(user, text, reply_markup, parse_mode);
        });
    }
    static sendUserTemplates(user, offset = 0, limit = 2) {
        return __awaiter(this, void 0, void 0, function* () {
            const parse_mode = 'Markdown';
            let inline_keyboard = new Array();
            let text = "Availible templates:";
            if (user.templates.length == 0)
                text = "You have not created templates yet. Lets change it!";
            for (let i = offset; i < (user.templates.length < limit + offset ? user.templates.length : limit + offset); i++)
                inline_keyboard.push([{ text: user.templates[i].name, callback_data: "/template" + i.toString() }]);
            if (user.templates.length > (offset + limit)) {
                inline_keyboard.push([{ "text": "Next", "callback_data": "/mytemplates" + (offset + limit).toString() }]);
            }
            inline_keyboard.push([{ "text": "Main menu", "callback_data": "/menu" }]);
            // let text = "Баланс: " + user.balance + " руб" + "\n";
            yield Menu._sendMessage(user, text, { inline_keyboard: inline_keyboard }, parse_mode);
        });
    }
    static sendAllTemplates(user, offset = 0, limit = 2) {
        return __awaiter(this, void 0, void 0, function* () {
            const parse_mode = 'Markdown';
            const reply_markup = {
                "inline_keyboard": [
                    [{ "text": "Back", "callback_data": "/menu" }]
                ]
            };
            let inline_keyboard = new Array();
            let text = "Availible templates:";
            let templates = yield DB_1.default.GetPublicTemplates(user.faculty.name);
            if (templates.length == 0)
                text = "There are no public templates dor you";
            for (let i = offset; i < (templates.length < limit + offset ? templates.length : limit + offset); i++)
                inline_keyboard.push([{ text: templates[i].name, callback_data: "/template" + i.toString() }]);
            if (templates.length > (offset + limit)) {
                inline_keyboard.push([{ "text": "Next", "callback_data": "/alltemplates" + (offset + limit).toString() }]);
            }
            inline_keyboard.push([{ "text": "Main menu", "callback_data": "/menu" }]);
            // let text = "Баланс: " + user.balance + " руб" + "\n";
            yield Menu._sendMessage(user, text, { inline_keyboard: inline_keyboard }, parse_mode);
        });
    }
    static deleteMenu(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                telegram_connection_1.bot.deleteMessage(user.id, user.menu_id);
            }
            catch (err) { }
        });
    }
    static _sendMessage(user, text, reply_markup, parse_mode) {
        return __awaiter(this, void 0, void 0, function* () {
            let sendNew = !(user.last_message_id == user.menu_id);
            if (sendNew) {
                yield Menu._sendNew(user, text, reply_markup, parse_mode);
            }
            else {
                try {
                    yield Menu._replaceText(user, text, reply_markup, parse_mode);
                }
                catch (err) {
                    yield Menu._sendNew(user, text, reply_markup, parse_mode);
                }
            }
        });
    }
    static _replaceText(user, text, reply_markup, parse_mode) {
        return __awaiter(this, void 0, void 0, function* () {
            yield telegram_connection_1.bot.editMessageText(text, { chat_id: user.id, message_id: user.menu_id, reply_markup: reply_markup, parse_mode: parse_mode });
        });
    }
    static sendTextMessage(user, text, reply_markup, parse_mode) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!reply_markup)
                reply_markup = {
                    "inline_keyboard": [
                        [{ "text": "Menu", "callback_data": "/menu" }]
                    ]
                };
            Menu._sendNew(user, text, reply_markup, parse_mode);
        });
    }
    static _sendAndRemember(user, text, reply_markup, parse_mode) {
        return __awaiter(this, void 0, void 0, function* () {
            yield telegram_connection_1.bot.sendMessage(user.id, text, { parse_mode: 'HTML', reply_markup: reply_markup }).then(function (msg) {
                user.menu_id = msg.message_id;
                user.last_message_id = msg.message_id;
            });
        });
    }
    static _sendNew(user, text, reply_markup, parse_mode) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Menu.deleteMenu(user);
            Menu._sendAndRemember(user, text, reply_markup, parse_mode);
        });
    }
}
exports.Menu = Menu;
//# sourceMappingURL=nmenu.js.map