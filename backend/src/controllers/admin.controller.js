import asyncHandler from "../utils/asynchandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {Achievement} from "../models/achievement.model.js"
import {Certificate} from "../models/certificate.model.js";
import {CodingProfile} from "../models/codingprofile.model.js";
import {Education} from "../models/education.model.js";
import {Experience} from "../models/experience.model.js";
import {Message} from "../models/message.model.js";
import {Project} from "../models/project.model.js";
import {Skill} from "../models/skill.model.js";

const getDashboardStatus = asyncHandler(async(req,res)=>{
    const [
        projects,
        skills,
        experience,
        education,
        certificate,
        achievement,
        codingprofile,
        message,
    ] = await Promise.all([
        Project.countDocuments(),
        Skill.countDocuments(),
        Experience.countDocuments(),
        Education.countDocuments(),
        Certificate.countDocuments(),
        Achievement.countDocuments(),
        CodingProfile.countDocuments(),
        Message.countDocuments(),
    ]);

    const dashboardStatus = {
        projects,
        skills,
        education,
        experience,
        certificate,
        achievement,
        codingprofile,
        message,
    };
    return res.status(200).json(
        new ApiResponse(
            200,
            dashboardStatus,
            "Dashboard statics fetched successfully"
        )
    );
});

export {
    getDashboardStatus,
};