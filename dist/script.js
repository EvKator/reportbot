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
const doc = require("./docx_processor");
// import User from './user';
const user_1 = require("./user");
const nmenu_1 = require("./nmenu");
console.log("XYUU1123123123123");
const telegram_connection_1 = require("./telegram_connection");
const template_1 = require("./template");
const report_1 = require("./report");
const faculty_1 = require("./faculty");
const admin_1 = require("./admin");
var express = require('express');
var app = express();
app.get('/', function (req, res) {
    res.send('Hello World');
});
app.listen(process.env.PORT || 3000);
telegram_connection_1.bot.onText(/\/start/, function (msg, match) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield user_1.User.getSender(msg);
        user.last_message_id = msg.message_id;
        if (!user.ExistInDB) {
            yield user.saveToDB();
            var greeting = "Hi!";
            yield nmenu_1.Menu.sendStartMenu(user);
            admin_1.default.SendInf(user, "New user:\n");
            // await Menu.sendTextMessage(user, greeting);
        }
        else {
            let greeting = "Hi! We are already familiar ";
            yield nmenu_1.Menu.sendTextMessage(user, greeting);
        }
    });
});
telegram_connection_1.bot.onText(/\/sendtoall (.*)/, function (msg, match) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield user_1.User.getSender(msg);
        if (yield admin_1.default.IsAdmin(user)) {
            yield admin_1.default.SendToAll(match[1]);
            nmenu_1.Menu.sendTextMessage(user, 'Success');
        }
        user.last_message_id = msg.message_id;
    });
});
telegram_connection_1.bot.onText(/\/sendto (\d+) (.*)/, function (msg, match) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield user_1.User.getSender(msg);
        if (yield admin_1.default.IsAdmin(user)) {
            let userDestination = yield user_1.User.fromDB(Number(match[1]));
            yield admin_1.default.SendTo(userDestination, match[2]);
            nmenu_1.Menu.sendTextMessage(user, 'Success');
        }
        user.last_message_id = msg.message_id;
    });
});
telegram_connection_1.bot.onText(/\/payto (\d+) (\d+)/, function (msg, match) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield user_1.User.getSender(msg);
        if (yield admin_1.default.IsAdmin(user)) {
            let userDestination = yield user_1.User.fromDB(Number(match[1]));
            yield admin_1.default.PayTo(userDestination, match[2]);
            nmenu_1.Menu.sendTextMessage(user, 'Success');
        }
        user.last_message_id = msg.message_id;
    });
});
telegram_connection_1.bot.onText(/\/confirm (\d+)(.*)/, function (msg, match) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield user_1.User.getSender(msg);
        if (yield admin_1.default.IsAdmin(user)) {
            let userDestination = yield user_1.User.fromDB(Number(match[1]));
            yield admin_1.default.Confirm(userDestination);
            nmenu_1.Menu.sendTextMessage(user, 'Success');
        }
        user.last_message_id = msg.message_id;
    });
});
telegram_connection_1.bot.onText(/\/paytome (\d+)/, function (msg, match) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield user_1.User.getSender(msg);
        if (yield admin_1.default.IsAdmin(user)) {
            yield admin_1.default.PayTo(user, match[1]);
            nmenu_1.Menu.sendTextMessage(user, 'Success');
        }
        user.last_message_id = msg.message_id;
    });
});
telegram_connection_1.bot.onText(/\/getuserinf (\d+)/, function (msg, match) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield user_1.User.getSender(msg);
        if (yield admin_1.default.IsAdmin(user)) {
            let user = yield user_1.User.fromDB(Number(match[1]));
            yield admin_1.default.SendInf(user, "");
        }
        user.last_message_id = msg.message_id;
    });
});
telegram_connection_1.bot.on('message', function (msg) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield user_1.User.getSender(msg);
        user.last_message_id = msg.message_id;
        const templateNumPattern = /\/template(\d)/g;
        const gtemplateNumPattern = /\/gtemplate(\d)/g;
        console.log(user.status);
        if (user.status.search(templateNumPattern) >= 0) {
            let templateNum = Number(templateNumPattern.exec(user.status)[1]);
            let replCount = yield user.addReportReplacement(msg.text);
            if (replCount >= user.templates[templateNum].placeholders.length) {
                user.status = 'free';
                yield nmenu_1.Menu.sendTextMessage(user, "Ok, your document is in processing");
                let reportPath = user.generateReport();
                let message = yield telegram_connection_1.bot.sendDocument(user.id, reportPath);
                user.last_message_id = message.message_id;
                yield nmenu_1.Menu.deleteMenu(user);
            }
            else {
                yield nmenu_1.Menu.sendTextMessage(user, user.templates[templateNum].placeholders[replCount] + "?");
            }
        }
        else if (user.status.search(gtemplateNumPattern) >= 0) {
            let templateNum = Number(gtemplateNumPattern.exec(user.status)[1]);
            let template = yield template_1.Template.GetPublicTemplate(user.faculty.name, templateNum);
            let replCount = yield user.addReportReplacement(msg.text);
            console.log(replCount);
            if (replCount >= template.placeholders.length) {
                user.status = 'free';
                yield nmenu_1.Menu.sendTextMessage(user, "Ok, your document is in processing");
                let reportPath = user.generateReport();
                let message = yield telegram_connection_1.bot.sendDocument(user.id, reportPath);
                user.last_message_id = message.message_id;
                yield nmenu_1.Menu.sendMenu(user);
            }
            else {
                yield nmenu_1.Menu.sendTextMessage(user, template.placeholders[replCount] + "?");
            }
        }
        else if (user.status == "/crtemplate" && msg.document) {
            let file = yield telegram_connection_1.bot.getFile(msg.document.file_id);
            let a = yield telegram_connection_1.bot.downloadFile(msg.document.file_id, "templates/");
            const docnamePattern = /(.*)\.docx/g;
            let docname = docnamePattern.exec(msg.document.file_name)[1];
            let template = new template_1.Template(docname, a, user.faculty, true, false);
            template.faculty = user.faculty;
            user.addTemplate(template);
            user.status = "free";
            yield nmenu_1.Menu.sendCreateTemplateMenu(user, `Ok, i have found ${template.placeholders} placeholders in your docx. ` +
                `\nWould you like to set the template as private or public?`);
        }
        else if (user.status == "/crfaculty") {
            let faculty = new faculty_1.Faculty(msg.text);
            user.faculty = faculty;
            yield nmenu_1.Menu.sendTextMessage(user, `Faculty ${faculty.name} was successfully created`);
        }
    });
});
telegram_connection_1.bot.onText(/\/menu/, function (msg, match) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield user_1.User.getSender(msg);
        if (!user.ExistInDB)
            yield user.saveToDB();
        user.last_message_id = msg.message_id;
        nmenu_1.Menu.sendMenu(user);
    });
});
telegram_connection_1.bot.on('callback_query', function (msg) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield user_1.User.getSender(msg);
        if (!user.ExistInDB)
            yield user.saveToDB();
        try {
            switch (msg.data) {
                case '/replenishMoney':
                    throw "Автоматизированная данная функция появится в течение недели. Сейчас для пополнения можете обратиться напрямую в \"Помощь\"";
                    user.status = 'free';
                case '/stats':
                    nmenu_1.Menu.sendStats(user);
                    user.status = 'free';
                    break;
                case '/ibalance':
                    admin_1.default.SendInf(user, 'wants to refill balance');
                    nmenu_1.Menu.sendTextMessage(user, "Request has been sent");
                    user.status = 'free';
                    break;
                case '/menu':
                    nmenu_1.Menu.sendMenu(user);
                    user.status = 'free';
                    break;
                case '/crreport':
                    nmenu_1.Menu.sendCreateReportMenu(user);
                    break;
                case '/crtemplate':
                    nmenu_1.Menu.sendTextMessage(user, "Send your template");
                    user.status = '/crtemplate';
                    break;
                case '/balance':
                    telegram_connection_1.bot.answerCallbackQuery(msg.id, "To look more, refill your balance", true);
                    break;
                case '/crfaculty':
                    nmenu_1.Menu.sendTextMessage(user, "What is the name of your category?");
                    user.status = '/crfaculty';
                    break;
                case '/alltemplates':
                    if (user.faculty != null)
                        nmenu_1.Menu.sendAllTemplates(user);
                    else
                        nmenu_1.Menu.sendTextMessage(user, `First choose your category`);
                    break;
                case '/mytemplates':
                    nmenu_1.Menu.sendUserTemplates(user);
                    break;
                case '/chfaculty':
                    nmenu_1.Menu.sendChangeFacultyMenu(user);
                    break;
                case '/profile':
                    nmenu_1.Menu.sendStats(user);
                    break;
                case '/setpubtemplate':
                    let template = user.templates[user.templates.length - 1];
                    yield user.setTemplatePrivacy(false);
                    nmenu_1.Menu.sendTextMessage(user, `Template ${template.name} was successfully created`);
                    admin_1.default.NewDocumentNotification(user);
                    user.status = 'free';
                    break;
                case '/setprivtemplate':
                    template = user.templates[user.templates.length - 1];
                    yield user.setTemplatePrivacy(true);
                    nmenu_1.Menu.sendTextMessage(user, `Template ${template.name} was successfully created`);
                    user.status = 'free';
                    break;
                case '/earn_vk_subscribers_task':
                case '/earn_tg_post_view_task':
                case '/earn_tg_subscribers_task':
                    throw ('Извини, таких заданий сейчас нет');
                    break;
                default:
                    const facultyPattern = /\/setfaculty(.*)/g;
                    const reportPattern = /\/mytemplates(.*)/g;
                    const areportPattern = /\/alltemplates(.*)/g;
                    const useTemplatePattern = /\/template(.*)/g;
                    const useGlobTemplatePattern = /\/alltemplate(.*)/g;
                    if (msg.data.search(facultyPattern) >= 0) {
                        let facultyName = facultyPattern.exec(msg.data)[1];
                        user.faculty = yield faculty_1.Faculty.GetFacultyByName(facultyName);
                        nmenu_1.Menu.sendTextMessage(user, `Faculty ${facultyName} was selected`);
                    }
                    else if (msg.data.search(reportPattern) >= 0) {
                        let offset = Number(reportPattern.exec(msg.data)[1]);
                        nmenu_1.Menu.sendUserTemplates(user, offset);
                    }
                    else if (msg.data.search(areportPattern) >= 0) {
                        let offset = Number(areportPattern.exec(msg.data)[1]);
                        nmenu_1.Menu.sendAllTemplates(user, offset);
                    }
                    else if (msg.data.search(useTemplatePattern) >= 0) {
                        let templateNum = Number(useTemplatePattern.exec(msg.data)[1]);
                        user.status = msg.data;
                        let template = user.templates[templateNum];
                        yield user.addReport(new report_1.Report("report.docx", "reports/report.docx", template));
                        yield nmenu_1.Menu.sendTextMessage(user, template.placeholders[0] + "?");
                    }
                    else if (msg.data.search(useGlobTemplatePattern) >= 0) {
                        let templateNum = Number(useGlobTemplatePattern.exec(msg.data)[1]);
                        let gtemplate = yield template_1.Template.GetPublicTemplate(user.faculty.name, templateNum);
                        user.status = msg.data;
                        yield user.addReport(new report_1.Report("report.docx", "reports/report.docx", gtemplate));
                        yield nmenu_1.Menu.sendTextMessage(user, gtemplate.placeholders[0] + "?");
                    }
                    break;
            }
        }
        catch (err) {
            console.log(err.stack); ///////////////////////////НЕИЗВЕСТНАЯ ОШИБКА
            yield nmenu_1.Menu.sendTextMessage(user, err);
        }
        telegram_connection_1.bot.answerCallbackQuery(msg.id, "", true);
    });
});
function createByTemplate() {
    let matches;
    matches.push({ key: '0', value: 'str 0' }, { key: '1', value: 'str 1' }, { key: '2', value: 'str 2' });
    doc.replace(__dirname + '/../input.docx', __dirname + '/../out.docx', matches);
}
//# sourceMappingURL=script.js.map