import mongoose , {Schema} from "mongoose";
import bcrypt from "bcrypt";
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

userSchema.pre("save" , async function() {
    try{
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password , 10);
    
    
}catch(error){
    next(error);
}

});
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password);
};

export const User = mongoose.model("User" , userSchema);