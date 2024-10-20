class ApiErr extends Error {
    statusCode: number;
    error: any[];
    stack?: string;
    constructor(statusCode:number,message="Invalid",error=[],stack=""){
        super(message);
        this.statusCode=statusCode;
        this.message=message;
        this.error=error;
        if (stack) {this.stack = stack;} else {Error.captureStackTrace(this, this.constructor)}
    }
}

export {ApiErr};