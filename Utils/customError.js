export class customError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
       
        // Add a custom property
    }
}