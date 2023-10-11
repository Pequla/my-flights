import { AppDataSource } from "../db";
import { User } from "../entities/User";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { TokenService } from "./token.service";
import { IsNull } from "typeorm";
import { LoginModel } from "../models/login.model";

const userRepo = AppDataSource.getRepository(User);

dotenv.config();
const accessSecret = process.env.ACCESS_TOKEN_SECRET;
const accessExpire = process.env.ACCESS_TOKEN_TTL;
const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
const refreshExpire = process.env.REFRESH_TOKEN_TTL;

export class UserService {

    public static async login(model: LoginModel) {
        const user = await this.findByEmail(model.email)
        if (user != undefined && await bcrypt.compare(model.password, user.password)) {
            const refresh = jwt.sign({ name: model.email }, refreshSecret, { expiresIn: refreshExpire });
            const data = await TokenService.save(user.userId, refresh)
            return {
                access: jwt.sign({ name: model.email }, accessSecret, { expiresIn: accessExpire }),
                refresh: data.token
            };
        }
        return null;
    }

    public static async register(model: LoginModel) {
        const user = await this.findByEmail(model.email)
        if (user) throw new Error("Account already exists")

        const hash = await bcrypt.hash(model.password, 10)
        const newUser = await userRepo.save({
            email: model.email,
            password: hash,
            createdAt: new Date()
        })

        return {
            email: newUser.email,
            createdAt: newUser.createdAt
        }
    }

    public static async refreshToken(refresh: string) {
        try {
            const data = await TokenService.findByToken(refresh)
            if (data == undefined) return null;
            const decoded: any = jwt.verify(data.token, refreshSecret as string)
            return {
                access: jwt.sign({ name: decoded.name }, accessSecret, { expiresIn: accessExpire })
            }
        } catch (err) {
            return null
        }
    }

    public static findByEmail(email: string) {
        return userRepo.findOne({
            where: {
                email: email,
                deletedAt: IsNull()
            }
        });
    }
}