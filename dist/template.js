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
const doc = require("./docx_processor");
class Template {
    constructor(name, path, faculty, isPrivate, confirmed, placeholders) {
        // super();
        this._name = name;
        this._path = path;
        this._placeholders = placeholders ? placeholders : doc.tagsCount(path);
        this._faculty = faculty;
        this._confirmed = confirmed;
        this._isPrivate = isPrivate;
    }
    static GetPublicTemplate(faculty, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let template = (yield DB_1.default.GetPublicTemplates(faculty, 10000))[id];
            return Template.fromJSON(template);
        });
    }
    static fromJSON(jsonT) {
        return new Template(jsonT.name, jsonT.path, jsonT.faculty, jsonT.isPrivate, jsonT.confirmed, jsonT.placeholders);
    }
    toJSON() {
        let jsonU = {
            name: this.name,
            path: this.path,
            placeholders: this._placeholders,
            faculty: this._faculty,
            isPrivate: this._isPrivate,
            confirmed: this._confirmed
        };
        return jsonU;
    }
    //#region getters-setters
    set name(name) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
    get placeholders() {
        return this._placeholders;
    }
    set path(path) {
        this._path = path;
    }
    get path() {
        return this._path;
    }
    set faculty(faculty) {
        this._faculty = faculty;
    }
    get faculty() {
        return this._faculty;
    }
    set isPrivate(isPrivate) {
        this._isPrivate = isPrivate;
    }
    get isPrivate() {
        return this._isPrivate;
    }
    set confirmed(confirmed) {
        this._confirmed = confirmed;
    }
    get confirmed() {
        return this._confirmed;
    }
}
Template.folderName = "templates";
exports.Template = Template;
//# sourceMappingURL=template.js.map