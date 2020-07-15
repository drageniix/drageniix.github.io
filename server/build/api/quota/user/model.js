"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Privilege = void 0;
const persistence_1 = require("../../gateway/persistence");
var Privilege;
(function (Privilege) {
    Privilege[Privilege["ADMIN"] = 0] = "ADMIN";
    Privilege[Privilege["USER"] = 1] = "USER";
})(Privilege = exports.Privilege || (exports.Privilege = {}));
class BudgetUser extends persistence_1.DataBaseModel {
    constructor({ explicit, snapshot, }) {
        super({ explicit, snapshot });
        const { name, email, password, privilege } = explicit || (snapshot && snapshot.data());
        this.name = name;
        this.password = password;
        this.email = email;
        this.privilege = privilege || Privilege.USER;
    }
    getDisplayFormat() {
        return persistence_1.filterUndefinedProperties({
            id: this.id && this.id.id,
            name: this.name,
            email: this.email,
            privilege: Privilege[this.privilege],
        });
    }
    getStorageFormat() {
        return persistence_1.filterUndefinedProperties({
            name: this.name,
            email: this.email,
            password: this.password,
            privilege: this.privilege,
        });
    }
}
exports.default = BudgetUser;
