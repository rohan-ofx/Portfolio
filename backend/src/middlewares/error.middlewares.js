import APiError from "../utils/ApiErrors.js";

const errorhandler = (err, req, res , next) =>{
    const error = err instanceof APiError 
    ? err
    : new APiError(
        500, err.message || "Internal Server Error"
    );

    return res.status(error.statuscode).json({
        success : error.success,
        message : error.message,
        error : error.error,
        data: error.data,
    });
};

export default errorhandler;