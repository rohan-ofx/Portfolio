import mongoose, { Schema} from "mongoose";

const certificateSchema = new Schema({
    title : {
        type : String,
        required : true,
        trim : true,
    },
     issuer : {
        type : String,
        required : true,
        trim: true,
     },
     issueDate : {
        type : Date,
        required: true,
     },
     credentialId : {
        type :String,
        default:"",
        trim :true,
     },
      credentialUrl: {
      type: String,
      default: "",
      trim: true,
    },

    certificateUrl: {
      type: String,
      default: "",
      trim: true,
    },
},{
    timestamps : true,
});

export const Certificate = mongoose.model("Certificate" , certificateSchema);