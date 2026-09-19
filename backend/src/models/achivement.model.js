import mongoose,{Schema} from "mongoose";

const achivementSchema = new Schema ({
    title : {
        type :String,
        required : true,
        trim :true,
    },
    description : {
        type : String,
        required : true,
        trim :true,
    },
    date : {
        type : Date,
        default : null,
    },
    organisation : {
        type : String,
        required : true ,
        trim : true,
    },
    link : {
        type : String ,
        default : "",
        trim : true,
    },
},{
    timestamps : true,
});

export const Achivement = mongoose.model("Achivement",achivementSchema);