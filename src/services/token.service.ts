import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { UserToken } from "../entities/UserToken";

const repo = AppDataSource.getRepository(UserToken);

export class TokenService {
    public static findByToken(refresh: string) {
        return repo.findOne({
            where: {
                token: refresh,
                deletedAt: IsNull()
            }
        })
    }

    public static save(userId: number, refresh: string) {
        return repo.save({
            userId: userId,
            token: refresh,
            createdAt: new Date()
        })
    }
}