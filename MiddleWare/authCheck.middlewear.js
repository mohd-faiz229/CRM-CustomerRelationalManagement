import jwt from "jsonwebtoken"
import { errorHandler } from "../Utils/globalError.js"

export const authcheck = async (req, res, next) => {

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new errorHandler(401, "Token not found");
        }

        const accessToken = authHeader.split(" ")[1];
        console.log(accessToken);

        if (!accessToken) {
            throw new errorHandler(401, "Token not found")
        }

        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);

        if (!decoded) {
            throw new errorHandler(403, "Token Expired")
        }

        req.user = decoded;
        next();

    } catch (error) {
        throw new errorHandler(403, error.message)
    }
}
