import asyncHandler from "../utils/asynchandler.js";
import APiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"

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
    new ApiResponse(201,
        createduser,
        "user Registration successfull"
    )
)
});

const loginuser = asyncHandler(async(req, res)=>{
    const {email , password} = req.body;

    if( !email ||!password){
        throw new APiError(
            400,
            "Email and password required"
        );
    }

    //find user

    const user = await User.findOne({email});

    if(!user){
        throw new APiError(
            404,
            "User does not exists"
        );
    }

    const ispasswordvaild = await user.isPasswordCorrect(password);

    if(!ispasswordvaild){
        throw new APiError(
            401,
            "invaild email or Password"
        );
    }

    const tokenPayload = {
        _id: user._id,
        username:user.username,
        email:user.email,
        role:user.role,
    };

    const accessToken = jwt.sign(
        tokenPayload,
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXPIRES_IN || "1hr",
    }
);



const refreshToken = jwt.sign({
    _id:user._id
},process.env.JWT_REFRESH_SECRET,
{
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
});

user.refreshToken = refreshToken;
await user.save({validateBeforeSave: false});

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if(!loggedInUser){
        throw new APiError(
            500,
            "Something went wrong while logging in"
        );
    }


    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user : loggedInUser,
                accessToken,
                refreshToken,
            },
            "User logged in Successfully"
        )
    );


});

const refreshAccessToken = asyncHandler(async(req,res) => {
    const incomingRefreshToken = req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new APiError(401,
            "Refresh token is required"
        );
    }

    let decodedToken;

    try{
        decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.JWT_REFRESH_SECRET
        );

    }catch(error){
        throw new APiError(
            401,
            "Invalid or expire refreshToken"
        );
    }

    const user = await User.findById(decodedToken._id);

    if(!user || !user.isActive || user.refreshToken !== incomingRefreshToken){
        throw new APiError(
            401,
            "Invalid refresh token"
        );
    }

    const tokenPayload = {
        _id: user._id,
        username:user.username,
        email:user.email,
        role:user.role,
    };

    const newAccessToken = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET,
         {
        expiresIn: process.env.JWT_EXPIRES_IN || "1hr",
    }
    );

    const newRefreshToken = jwt.sign(
        {_id: user._id},
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn :process.env.JWT_REFRESH_EXPIRES_IN || "7d",
        }
    );
    user.refreshToken = newRefreshToken;
     await user.save({ validateBeforeSave: false });

        return res.status(200).json(
         new ApiResponse(
      200,
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      "Access token refreshed successfully"
    )
  );
});

const logoutUser = asyncHandler(async(req,res)=>{
    const user = await User.find.findById(req.user._id);

    if(!user){
        throw new APiError(
            404,
            "user not found"
        );
    }
    user.refreshToken = "";
    await user.save({validateBeforeSave: false});

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "user logged out successfully"
        )
    );
});


export {registerUser , loginuser, refreshAccessToken , logoutUser};