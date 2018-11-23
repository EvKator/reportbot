"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');
var fs = require('fs');
var path = require('path');
function replace(from, to, matches) {
    //Load the docx file as a binary
    var content = fs
        .readFileSync(path.resolve(from), 'binary');
    var zip = new JSZip(content);
    var doc = new Docxtemplater();
    doc.loadZip(zip);
    let o = {};
    //set the templateVariables
    for (let i = 0; i < matches.length; i++) {
        o[matches[i].key] = matches[i].value;
    }
    console.log(JSON.stringify(o));
    doc.setData(o);
    try {
        doc.render();
    }
    catch (error) {
        var e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
        };
        console.log(JSON.stringify({ error: e }));
        throw error;
    }
    var buf = doc.getZip()
        .generate({ type: 'nodebuffer' });
    // console.log(buf.toString(buf) );
    fs.writeFileSync(to, buf);
}
exports.replace = replace;
function tagsCount(from) {
    var content = fs
        .readFileSync(path.resolve(from), 'binary');
    var zip = new JSZip(content);
    var doc = new Docxtemplater();
    doc.loadZip(zip);
    var InspectModule = require("docxtemplater/js/inspect-module");
    var iModule = InspectModule();
    doc.attachModule(iModule);
    doc.render(); // doc.compile can also be used to avoid having runtime errors
    var tags = iModule.getAllTags();
    return Object.keys(tags);
}
exports.tagsCount = tagsCount;
function keysCount(json) {
    let count = 0;
    count += Object.keys(json).length;
    for (var a in json) {
        count += keysCount(json[a]);
    }
    return count;
}
//# sourceMappingURL=docx_processor.js.map