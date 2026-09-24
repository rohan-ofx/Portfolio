import asyncHandler from "../utils/asynchandler.js";
import APiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler(async(req , res)=>{
    const {username , email, password } = req.body;

    if([username , email, password].some((field) =>
    field?.trim() === "")
){
    throw new APiError(
        400,
        "All fields are required"
    )
}

const existinguser = await User.findOne({
    $or : [{username} , {email}]
})
if(existinguser){
    throw new APiError(
        409,
        "User with email or username Already exists"
    );
}

const createuser = await User.create({
    username,
    email,
    password
})
const createduser = await User.findById(createuser._id).
select("-password -refreshToken" );
if(!createduser){
    throw new APiError(
        500,
        "Something went wrong while registering the user"
    );
}

return res.status(201).json(
    new ApiResponse(200,
        createduser,
        "user Registration successfull"
    )
)
});

export default registerUser;