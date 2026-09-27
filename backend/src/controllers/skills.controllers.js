import ApiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandlers from "../utils/asynchandler.js";
import {Skill} from "../models/skill.model.js";

const createSkill = asyncHandlers(async(req, res)=>{
    const{
         name,
         category,
         level,
         icon,
         order
    } = req.body;

    if([name , category].some(field => field?.trim() === "")){
        throw new ApiError(
            400,
            "All field are Required"
        );
    }

    const skill = await Skill.create({
        name,
        category,
        level,
        icon,
        order
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            skill,
            "Skill created successfully"
        )
    );
});

//get all Skills

const getAllSkill = asyncHandlers(async(req,res)=>{
    const skill = await Skill.find().sort({order: 1});

    return res.status(200).json(
        new ApiResponse(
            200,
            skill,
            "Skill fetched successfully"
        )
    );
});

// get skill 

const getSkillById = asyncHandlers(async(req, res)=>{
    const {id} = req.params;

    const skill = await Skill.findById(id);

    if(!skill){
        new ApiError(
            404,
            "skill not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            skill,
            "Skill fetched Successfully"
        )
    );
});

const updateSkill = asyncHandlers(async(req,res)=>{
    const {id} = req.params;

    const {
         name,
         category,
         level,
         icon,
         order
    } = req.body;

    if([name , category].some(field => field?.trim === "")){
        new ApiError(
            404,
            "All Field are Required"
        );
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
        id,{
         name,
         category,
         level,
         icon,
         order
        },{
            new :true,
            runValidators:true
        }
    );
     if(!updatedSkill){
        throw new ApiError(
            404,
            "Skill not Found"
        );
     }

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedSkill,
            "Skill Updated Successfully"

        )
    );

});

// DELETED SKILL

const deleteSkill = asyncHandlers(async(req,res)=>{
    const { id } = req.params;

    const deletedSkill = await Skill.findByIdAndDelete(id);

    if(!deletedSkill){
        throw new ApiError(
            404,
            "Skill not found"
        );
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            deletedSkill,
            "Skill deleted Successfully"
        )
    );

});

export {createSkill , getAllSkill, getSkillById, updateSkill,deleteSkill
};