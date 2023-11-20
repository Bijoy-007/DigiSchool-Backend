import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

dotenv.config();

// * Local imports
import schoolRoutes from "./src/routes/school.js";
import studentRoutes from "./src/routes/student.js";
import authRoutes from "./src/routes/auth.js";
import standardRoutes from "./src/routes/standard.js";
import forgotPassword from "./src/routes/forgotPassword.js";
import globalErrorHandler from "./src/middlewares/globalErrorHandler.js";

// * The express app
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());

// * Connecting to the DB
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => {
    console.log("Connected to DB successfully!!");
  })
  .catch((err) => {
    console.error("DB connection failed", err);
  });

// * All App routes
app.use("/school", schoolRoutes);
app.use("/student", studentRoutes);
app.use("/auth", authRoutes);
app.use("/standard", standardRoutes);
app.use("/forgotPassword", forgotPassword);

app.get("/", function (req, res) {
  res.send("Hello World");
});

// * Global error handler
app.use(globalErrorHandler);

app.listen(5000, () => {
  console.log(`Server started on 5000`);
});
