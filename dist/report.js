"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const template_1 = require("./template");
const doc = require("./docx_processor");
class Report {
    constructor(name, path, template, replacement) {
        this._name = name;
        this._path = path;
        this._template = template;
        this._replacement = replacement ? replacement : new Array();
    }
    toJSON() {
        let jsonR = {
            replacement: this._replacement,
            template: this._template.toJSON(),
            name: this._name,
            path: this._path
        };
        return jsonR;
    }
    generate() {
        let keyValue = new Array();
        for (let i = 0; i < this.replacement.length; i++) {
            keyValue.push({
                key: this.template.placeholders[i],
                value: this.replacement[i]
            });
        }
        console.log(keyValue.toString());
        let fileDest = "reports/" + createKey(10) + ".docx";
        doc.replace(`${__dirname}/../` + this.template.path, fileDest, keyValue);
        var fs = require('fs');
        var path = `${__dirname}/../`;
        fs.readdir(path, function (err, items) {
            console.log(items);
            for (var i = 0; i < items.length; i++) {
                console.log(items[i]);
            }
        });
        console.log(fileDest);
        return fileDest;
    }
    static fromJSON(jsonR) {
        return new Report(jsonR.name, jsonR.path, template_1.Template.fromJSON(jsonR.template), jsonR.replacement);
    }
    get replacement() {
        return this._replacement;
    }
    get template() {
        return this._template;
    }
    get path() {
        return this._path;
    }
    get name() {
        return this._name;
    }
}
exports.Report = Report;
function createKey(n) {
    var s = '';
    while (s.length < n)
        s += String.fromCharCode(Math.random() * 1106).replace(/[^a-zA-Z]|_/g, '');
    return s;
}
//# sourceMappingURL=report.js.map