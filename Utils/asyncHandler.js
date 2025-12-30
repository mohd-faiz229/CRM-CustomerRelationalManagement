
 const asyncHandler = (fn) => async (req, res, next) => {

    try {
        await fn(req, res, next);

    }
    catch (error) {
        // Centralised error handling logic
        console.error(error);
        // Pass the error to the Express error handling middleware
        next(error);

    }
}
export {asyncHandler}
