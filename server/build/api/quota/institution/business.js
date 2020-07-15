"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpdatedAt = void 0;
const _1 = require(".");
exports.setUpdatedAt = (insitution, date) => _1.updateInstitution(insitution, { updatedAt: new Date(date) });
