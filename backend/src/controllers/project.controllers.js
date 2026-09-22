import APiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import { createproject } from "../services/project.services.js";
import asyncHandler from "../utils/asynchandler.js";

export const createprojectController = asyncHandler(async(req , res) =>{
    const project = await createproject(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            project,
            "project created Successfully"
        )
    );
});