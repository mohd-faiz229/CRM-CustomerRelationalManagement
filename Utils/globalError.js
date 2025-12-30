export const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500

    err.message = err.message || "Internal Servor Error"

    res.status(err.statusCode).json({ status: "Fail", message: err.message })
   
}

