import dotenv from "dotenv";
import app from "./app.js"
import connectDB from "./Database/database.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

const startServer = async() => {
    try {
        await connectDB();

        app.listen(PORT , () => {
            console.log(`Server is Running on port ${PORT}`);
        });
    } catch (error) {
        console.log("Server Setup failed : " , error.message);
        process.exit(1);
    }
};

startServer();