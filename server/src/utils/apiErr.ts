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

export const errorHandlerMiddleWare = (err:any, req:any, res:any, next:any) => {
    if (err instanceof ApiErr) {
      return res.status(err.statusCode).json({
        message: err.message,
        error: err.error,
      });
    }
    return res.status(500).json({
      message: "Something went wrong!",
      error: err.message || err,
    });
  }