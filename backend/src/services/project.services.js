import { Project } from "../models/project.model.js";

export const createproject = async(projectData) => {
    const project =  await Project.create(projectData);

    return project;
}
