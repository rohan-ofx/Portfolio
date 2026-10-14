import APiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import {Experience} from "../models/experience.model.js"


const createExperience = asyncHandler(async (req, res) => {
    const {
        role,
        company,
        location,
        employmentType,
        startDate,
        endDate,
        description,
        technologies,
        isCurrent,
    } = req.body;

    if (
        !role?.trim() ||
        !company?.trim() ||
        !startDate ||
        !description?.trim()
    ) {
        throw new APiError(
            400,
            "Role, company, start date and description are required"
        );
    }

    const createdExperience = await Experience.create({
        company: company.trim(),
        position: role.trim(),
        location,
        employmentType,
        startDate,
        endDate: isCurrent ? undefined : endDate,
        current: Boolean(isCurrent),
        description: description.trim(),
        technologies,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            createdExperience,
            "Experience created successfully"
        )
    );
});

const getAllExperiences = asyncHandler(async(req,res)=>{
    const experience = await Experience.find().sort({startDate : -1});

    return res.status(200).json(
        new ApiResponse(
            200,
            experience,
            "Experience fetched successfully"
        )
    );
});


const getExperienceById = asyncHandler(async(req,res)=>{
    const {id} = req.params;

    const experience = await Experience.findById(id);

    if(!experience){
        throw new APiError(
            404,
            "Experience not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            experience,
            "Experience fetched Successfully"
        )
    );
});

const updateExperience = asyncHandler(async(req,res)=>{
    const {id} = req.params;

   const {
    role,
    company,
    location,
    employmentType,
    startDate,
    endDate,
    description,
    technologies,
    isCurrent,
} = req.body;

 if (
    !role?.trim() ||
    !company?.trim() ||
    !startDate ||
    !description?.trim()
) {
    throw new APiError(
        400,
        "Role, company, start date and description are required"
    );
}

  const updateExperience = await Experience.findByIdAndUpdate(
    id,{
    company,
    position: role,
    location,
    employmentType,
    startDate,
    endDate: isCurrent ? undefined : endDate,
    current: Boolean(isCurrent),
    description:description.trim(),
    technologies,
},{
        new:true,
        runValidators:true
    }
  );

   if (!updateExperience) {
    throw new APiError(
      404,
      "Experience not found"
    );
  }


  return res.status(200).json(
    new ApiResponse(
      200,
      updateExperience,
      "Experience updated successfully"
    )
  );

});
const deleteExperience = asyncHandler(async (req, res) => {

  const { id } = req.params;


  const deletedExperience =
    await Experience.findByIdAndDelete(id);


  if (!deletedExperience) {
    throw new APiError(
      404,
      "Experience not found"
    );
  }


  return res.status(200).json(
    new ApiResponse(
      200,
      deletedExperience,
      "Experience deleted successfully"
    )
  );
});


export {
  createExperience,
  getAllExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience
};

