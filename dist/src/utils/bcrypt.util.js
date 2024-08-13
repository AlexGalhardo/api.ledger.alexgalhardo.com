"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bcrypt = void 0;
const bcrypt = require("bcrypt");
class Bcrypt {
    static async hash(password) {
        return bcrypt
            .genSalt(12)
            .then((salt) => bcrypt.hash(password, salt))
            .then((hash) => hash);
    }
    static async compare(password, hashPassword) {
        return bcrypt.compare(password, hashPassword).then((resp) => resp);
    }
}
exports.Bcrypt = Bcrypt;
//# sourceMappingURL=bcrypt.util.js.map