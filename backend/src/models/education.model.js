import mongoose , {Schema} from "mongoose";

const educationSchema = new Schema({
    institution : {
        type : String,
        required : true,
        trim : true,
    },
    degree :{
        type:String,
        required : true,
        trim : true,
    },
    fieldOfStudy : {
        type : String,
        required: true,
        trim : true,
    },
    StartDate : {
        type : Date,
        required : true,
    },
    endDate : {
        type : true,
        default : null,
    },
    grade : {
        type :String,
        default: "",
        trim : true,
    },
    description:{
        type : String,
        default : "",
        trim : true,
    },
},{
    timestamps : true,
});

export const Education = mongoose.model("Education" , educationSchema);