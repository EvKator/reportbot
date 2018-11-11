import { Buffer } from "buffer";

var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');

var fs = require('fs');
var path = require('path');

export function replace (from: string, to: string, matches: { key : string, value: string}[] ): void{

//Load the docx file as a binary
    var content = fs
        .readFileSync(path.resolve(from), 'binary');

    var zip = new JSZip(content);

    var doc = new Docxtemplater();
    doc.loadZip(zip);
    let o : any = {};
    //set the templateVariables

    for(let i = 0; i < matches.length; i++){
        o[matches[i].key] = matches[i].value;
    }

    console.log(JSON.stringify(o));

    doc.setData(o);

    try {
        doc.render()
    }
    catch (error) {
        var e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
        }
        console.log(JSON.stringify({error: e}));
        throw error;
    }
console.log(from + " --- " + to);
    var buf = doc.getZip()
                 .generate({type: 'nodebuffer'});
    // console.log(buf.toString(buf) );
    fs.writeFileSync(to, buf);
}