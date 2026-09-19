import mongoose,{Schema} from "mongoose";

const experienceSchema = new Schema ({
    company : {
        type:String,
        required : true,
        trim : true,
    },
    position : {
        type : String,
        required: true,
        trim : true,
    },
    location:{
        type : String,
        default : "",
        trim : true,
    },
     startDate : {
        type:Date,
        required : true,
     },
     endDate : {
        type:Date,
        default : null,
     },
     
     description : {
            type : String,
            required :true,
            trim : true,
    },
    techonologies : {
        type : [String],
        default : [],
    },
     
},{
    timestamps : true,
});

export const Experience = mongoose.model("Experience",experienceSchema);