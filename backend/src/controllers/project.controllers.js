import APiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import { Project } from "../models/project.model.js";

const createProject = asyncHandler(async(req, res)=>{
    const{
         title,
         description,
         technologies,
         image,
         githubUrl,
          liveUrl ,
          featured
        } =req.body;

        if(
            !title ||  !description || !technologies
        ){
            throw new APiError(
                400,
                "Title , description and technologies are required"
            );
        }

        // create project

        const project = await Project.create({
            title,
            description,
            technologies,
            image,
            githubUrl,
            liveUrl,
            featured,
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                project,
                "project created successfully"
            )
        );
});

export default createProject;