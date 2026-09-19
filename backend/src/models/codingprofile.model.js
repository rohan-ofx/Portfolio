import mongoose,{Schema} from "mongoose";

const codingSchema =  new Schema({
    platform : {
        title : String,
        required : true,
        trim : true,
    },

    username:{
        type : String,
        required:true,
        trim : true,
    },
    profileUrl:{
        type : String,
        required:true,
        trim : true, 
    },
    icon : {
        type:String,
        default : "",
        trim : true,
    },
    description : {
        type : String,
        default : "",
        trim : true,
    },
    order : {
        type : Number,
        default: 0,
    },
}, {
    timestamps : true,
});

export const CodingProfile = mongoose.model("CodingProfile" , codingSchema);