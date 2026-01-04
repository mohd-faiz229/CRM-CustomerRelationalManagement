import { customError } from "../Utils/customError.js";

export const authorizedRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new customError(401, "Unauthorized access");
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new customError(
                403,
                "You do not have permission to access this resource"
            );
        }
        next();
    };
};
