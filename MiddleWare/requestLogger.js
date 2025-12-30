import logger from "../Config/logger.js";
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        logger.info({
            message: "HTTP Request Log",
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
        });
    });
    next();
};
export default requestLogger;
