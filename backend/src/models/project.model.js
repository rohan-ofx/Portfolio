import { Schema } from "mongoose";
import mongoose , {Schema} from "mongoose";

const projectSchema = new Schema({
    title : {
        type : String,
        required : true,
        trim : true,
    },
    description :{
        type : String,
        required : true,
        trim : true,
    },
    technologies : {
        type : [String],
        required : true,
    },
    image : {
        type : String,
        default : "",
    },
    githubUrl : {
        type: String,
        default : "",
    },
    liveurl : {
        type : String,
        default :"",
    },
    featured : {
        type : Boolean,
        default : false,
    },
},
    {
        timestamps : true,
    }
);

export const Project = mongoose.model("Project" , projectSchema);