
import express from "express";
import errorhandler from "./middlewares/error.middlewares.js";
import projectrouter from "./routers/project.routers.js";
import router from "./routers/user.router.js";

const app = express();

// Middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Portfolio Backend is running");
});

// Project routes
app.use("/api/v1/projects", projectrouter);
app.use("/api/v1/users",router);

// Global error handler
app.use(errorhandler);

export default app;
