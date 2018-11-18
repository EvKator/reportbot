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
class Faculty {
    constructor(name) {
        this.name = name;
    }
    static fromJSON(jfac) {
        return new Faculty(jfac.name);
    }
    static GetAllFaculties() {
        return __awaiter(this, void 0, void 0, function* () {
            let faculties = new Array();
            yield (yield DB_1.default.GetAllFaculties()).forEach(element => {
                faculties.push(Faculty.fromJSON(element));
            });
            return faculties;
        });
    }
    static GetFacultyByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let faculty = Faculty.fromJSON(yield DB_1.default.GetFacultyByName(name));
            return faculty;
        });
    }
}
exports.Faculty = Faculty;
//# sourceMappingURL=faculty.js.map