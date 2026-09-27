import APiError from "../utils/ApiErrors.js";
import asynchandler from "../utils/asynchandler.js"
import jwt from "jsonwebtoken";

const verifyJWT = asynchandler(async(req , res , next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer")){
        throw new APiError(
            401,
            "Access token is required"
        );
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET
    );

    req.user = decodedToken;

    next();
});
 
export default verifyJWT;