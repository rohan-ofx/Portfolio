
import express from "express";

import cors from "cors";

import errorhandler from "./middlewares/error.middlewares.js";
import projectrouter from "./routers/project.routers.js";
import router from "./routers/user.router.js";
import skillRouter from "./routers/skill.router.js"
import experienceRouter from "./routers/experience.routers.js";
import educationRouter from "./routers/educaion.routers.js";
import certificationRouters from "./routers/certification.routers.js";
import achivementRouters from "./routers/achivement.routers.js";
import codingRouters from "./routers/codingprofile.router.js"
import messageRouter from "./routers/message.routers.js";
import siteSettingsRouter from "./routers/siteSetting.routers.js";
import adminRouter from "./routers/admin.routes.js";
const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const isVercel = /^https:\/\/portfolio-[a-z0-9-]+\.vercel\.app$/.test(
         origin || ""
          );

      if (
        !origin ||
        origin === "http://localhost:5173" ||
        isVercel
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Portfolio Backend is running");
});
// Project routes
app.use("/api/v1/projects", projectrouter);
app.use("/api/v1/users",router);
app.use("/api/v1/skills" , skillRouter);
app.use("/api/v1/experience" , experienceRouter);
app.use("/api/v1/education" , educationRouter);
app.use("/api/v1/certificates" , certificationRouters);
app.use("/api/v1/achivements",achivementRouters);
app.use("/api/v1/coding", codingRouters);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/site-settings", siteSettingsRouter);
app.use("/api/v1/admin", adminRouter);

// Global error handler
app.use(errorhandler);

export default app;
