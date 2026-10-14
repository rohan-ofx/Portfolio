
import ApiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandlers from "../utils/asynchandler.js";
import { Skill } from "../models/skill.model.js";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";

// CREATE SKILL
const createSkill = asyncHandlers(async (req, res) => {
    const {
        name,
        category,
        level,
        icon,
        order
    } = req.body;

    if (!name?.trim() || !category?.trim()) {
        throw new ApiError(
            400,
            "Name and category are required"
        );
    }

    let iconUrl = icon || "";

    if (req.file) {
        iconUrl = await uploadToCloudinary(
            req.file.buffer,
            "portfolio/skills"
        );
    }

    const skill = await Skill.create({
        name,
        category,
        level,
        icon: iconUrl,
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

// GET ALL SKILLS
const getAllSkill = asyncHandlers(async (req, res) => {
    const skills = await Skill.find().sort({ order: 1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            skills,
            "Skills fetched successfully"
        )
    );
});

// GET SKILL BY ID
const getSkillById = asyncHandlers(async (req, res) => {
    const { id } = req.params;

    const skill = await Skill.findById(id);

    if (!skill) {
        throw new ApiError(404, "Skill not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            skill,
            "Skill fetched successfully"
        )
    );
});

// UPDATE SKILL
const updateSkill = asyncHandlers(async (req, res) => {
    const { id } = req.params;

    const {
        name,
        category,
        level,
        icon,
        order
    } = req.body;

    if (!name?.trim() || !category?.trim()) {
        throw new ApiError(
            400,
            "Name and category are required"
        );
    }

    const existingSkill = await Skill.findById(id);

    if (!existingSkill) {
        throw new ApiError(404, "Skill not found");
    }

    // Preserve existing icon unless a new file is uploaded
    let iconUrl = existingSkill.icon || "";

    if (req.file) {
        iconUrl = await uploadToCloudinary(
            req.file.buffer,
            "portfolio/skills"
        );
    } else if (icon !== undefined && icon !== "") {
        // Preserve support for existing icon names or URLs
        iconUrl = icon;
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
        id,
        {
            name,
            category,
            level,
            icon: iconUrl,
            order
        },
        {
            new: true,
            runValidators: true
        }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedSkill,
            "Skill updated successfully"
        )
    );
});

// DELETE SKILL
const deleteSkill = asyncHandlers(async (req, res) => {
    const { id } = req.params;

    const deletedSkill = await Skill.findByIdAndDelete(id);

    if (!deletedSkill) {
        throw new ApiError(404, "Skill not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            deletedSkill,
            "Skill deleted successfully"
        )
    );
});

export {
    createSkill,
    getAllSkill,
    getSkillById,
    updateSkill,
    deleteSkill
};
