export const success = (res, statusCode = 200, message, data = null)=>{
    return res.status(statusCode).json({
        status: "success",
        message: message,
        data: data
    })
}