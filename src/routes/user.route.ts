import { Router } from "express";
import { UserService } from "../services/user.service";
import { checkIfDefined, sendErrorResponse, authenticateToken } from "../utils";

const router = Router();

router.get('/self', authenticateToken, async (req, res) => {
    try {
        const data = checkIfDefined(await UserService.findByEmail((req as any).user.name), res);
        res.json({
            email: data.email,
            createdAt: data.createdAt
        })
    } catch (e) {
        sendErrorResponse(res);
    }
})

router.post('/login', async (req, res) => {
    try {
        const body = checkIfDefined(req.body, res);
        const tokens = await UserService.login(checkIfDefined(body, res));
        if (tokens == undefined) {
            return sendErrorResponse(res, 400, 'Failed to generate tokens')
        }
        res.json(tokens);
    } catch (e) {
        sendErrorResponse(res);
    }
})

router.post('/register', async (req, res) => {
    try {
        const body = checkIfDefined(req.body, res);
        const user = await UserService.register(checkIfDefined(body, res));
        res.json(user);
    } catch (e) {
        sendErrorResponse(res, 400, e.message);
    }
})

router.post('/refresh', async (req, res) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        const data = await UserService.refreshToken(token);
        if (data == undefined) {
            return sendErrorResponse(res, 400, 'Failed to refresh the token')
        }
        res.json(data);
    } catch (e) {
        sendErrorResponse(res);
    }
})

export = router