import cloudinary from "../config/cloudinary.js";

const uploadResume = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "portfolio/resume",
        resource_type: "raw",
        public_id: `resume-${Date.now()}.pdf`,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export default uploadResume;