import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "./db";

interface JwtPayload {
    id: String
}

export async function UserAuth(req: Request, res: Response, next: NextFunction){
    const token = req.headers["authorization"];
    if(!token){
        return res.status(401).json({
            message: "Please Signin first.. "
        });
    }
    const response = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if(response){
        const user = await UserModel.findOne({
            _id: response.id
        });
        if(!user){
            return res.status(401).json({
                message: "User not found !"
            });
        }
        req.userId = response.id;
        next();
    } else {
        res.status(403).json({
            message: "Authorization Error !"
        });
    }
}