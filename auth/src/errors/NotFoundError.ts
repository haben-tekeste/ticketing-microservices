import  CustomError  from "./CustomError";

export default class NotFoundError extends CustomError{
    public statusCode = 404;

    constructor(){
        super();

        //
        Object.setPrototypeOf(this,NotFoundError.prototype)
    }
    serializeErrors(){
        return [{message:"Sorry, page not found"}]
    }
}

export {NotFoundError}
