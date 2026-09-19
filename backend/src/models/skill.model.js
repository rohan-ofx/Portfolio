import mongoose ,{Schema} from "mongoose";

const skillSchema = new Schema({
    name:{
        type:String,
        required: true,
        trim : true,
    },
    category:{
        type : String,
        required:true,
        trim:true,
    },
    level:{
        type :String,
        default : "Intermediate",
        trim : true,
    },
    icon:{
        type:String,
        default:"",
    },
    order : {
        type : Number,
        default : 0,
    },
},{
    timestamps : true,
}
);

export const Skill = mongoose.Model("Skill", skillSchema);