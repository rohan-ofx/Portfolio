import mongoose , {Schema} from "mongoose";
const userSchema = new Schema({
    username : {
        type : String,
        required : true,
        trim : true,
    },

    email : {
        type :String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
    },
    password : {
        type: String,
        required:true,
    },
    role:{
        type : String,
        default : "admin",
    },
    refreshToken:{
        type : String,
        default : "",
    },
    isActive : {
        type :Boolean,
        default : true,
    },
},{
    timestamps : true,
}
);

export const User = mongoose.model("User" , userSchema);