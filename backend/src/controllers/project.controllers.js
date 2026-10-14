import APiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import { Project } from "../models/project.model.js";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";



const createProject = asyncHandler(async(req, res)=>{
    console.log("BODY :" , req.body);
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

        let imageUrl = "";
        if(req.file){
            imageUrl = await uploadToCloudinary(req.file.buffer);
        }

        // create project

        const project = await Project.create({
            title,
            description,
            technologies,
            image : imageUrl,
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

const getAllProjects = asyncHandler(async(req, res)=>{
    const project = await Project.find();

    return res.status(200).json(
        new ApiResponse(
            201,
            project,
            "Project fetched Successfully"
        )
    );
});

const getProjectById = asyncHandler(async(req, res)=>{

    
    const{id} = req.params;

    const project = await Project.findById(id);

    if(!project){
        throw new APiError(
            404,
            "project not found"
        )
    };

    return res.status(200).json(
        new ApiResponse(
            200,
            project,
            "project fatched successfully"
        )
    );
});

//Delete Project

const deleteProject = asyncHandler(async(req,res)=> {
    const {id} = req.params;

    const project = await Project.findByIdAndDelete(id);

    if(!project){
        throw new APiError(
            404,
            "project not found"
        )
    };
    return res.status(200).json(
        new ApiResponse(
            200,
            project,
            "project deleted Successfully"
        )
    );
});

// Edit and Update Project


const updateProject = asyncHandler(async(req, res)=>{
    const {id} = req.params;

         const{
         title,
         description,
         technologies,
         image,
         githubUrl,
          liveUrl ,
          featured
        } =req.body;

        if(!title || !description || !technologies){
            throw new APiError(
                400,
                "ALL Field are Required"
            );
        }
        const existingProject = await Project.findById(id);
        if(!existingProject){
            throw new APiError(
                404,
                "Project not Found"
            );
        }

        let imageUrl = existingProject.image  || "";

        if(req.file){
            imageUrl = await uploadToCloudinary(req.file.buffer);
        }

        const updateProject = await Project.findByIdAndUpdate(
            id,
            {
                title,
                description,
                technologies,
                image,
                githubUrl,
                liveUrl,
                featured
            },{
                new :true,
                runValidators :true
            }
        );

        if(!updateProject){
            throw new APiError(
                404,
                "project not found"
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                updateProject,
                "Project updated Successfully"
            )
        );
});


export {createProject, getAllProjects,getProjectById,deleteProject,updateProject};