class ExpressError extends Error {
    constructor(statusCode,message) {
        super(); //constructor phale apne super constructor ko call karega
        this.statusCode = statusCode;
        this.message= message;
    }
};
module.exports = ExpressError;