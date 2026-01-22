import jwt from "jsonwebtoken";
import { customError } from "../Utils/customError.js";

const authCheck = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    console.log("AUTH HEADER:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new customError(401, "Access token not provided");
    }

    const accessToken = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET_KEY
        );

        req.user = decoded;
        next();
    } catch (error) {
        throw new customError(401, "Invalid or expired access token");
    }
};
export  {authCheck};