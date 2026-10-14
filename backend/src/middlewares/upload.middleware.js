import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) =>{
    const allowedType = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ];

    if(allowedType.includes(file.mimetype)){
        callback(null, true);
    } else {
        callback(
            new Error("Only JPG, PNG and WEBP images are allowed."),
            false
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits : {
        fileSize: 5*1024*1024,
        files: 1,
    },
});

export default upload;