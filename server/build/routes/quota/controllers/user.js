"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
exports.signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password } = req.body;
    const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
    const user = yield new User_1.default({
        explicit: {
            email,
            password: hashedPassword,
            name,
        },
    }).post();
    const response = initiateLogin(user);
    return res.status(201).json(response);
});
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return User_1.default.getUserByEmail(req.body.email).then((user) => {
        const response = initiateLogin(user);
        res.status(200).json(response);
    });
});
const initiateLogin = (user) => ({
    token: jsonwebtoken_1.default.sign({
        privilege: user.privilege,
    }, process.env.JWT_SECRET, { expiresIn: "1h", subject: user.id.id }),
});
