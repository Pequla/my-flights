import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

// Retrieve id from response
export function retrieveIdFromPath(req: Request) {
    const id = Number.parseInt(req.params.id);
    if (!Number.isNaN(id))
        return id;
    return 0;
}

// Not found response
export function notFoundResponse(res: Response, msg = 'Not found') {
    res.status(404).json({
        message: msg,
        timestamp: new Date()
    });
}

// Error response
export function sendErrorResponse(res: Response, code=400, msg="Bad request") {
    res.status(code).json({
        message: msg,
        timestamp: new Date()
    });
}

// Validate if defined
export function checkIfDefined(data, res: Response) {
    if (data == undefined) {
        notFoundResponse(res)
        return;
    }
    return data;
}

// Auth
dotenv.config();
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        return sendErrorResponse(res, 401, 'No token found')
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
        if (err) {
            return sendErrorResponse(res, 403, err.message)
        }
        req.user = user
        next()
    })
}