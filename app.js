import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// * Local imports 
import schoolRoutes from "./src/routes/school.js";

// * The express app
const app = express();
app.use(express.json());

// * Connecting to the DB
mongoose.connect(process.env.MONGODB_CONNECTION_STRING).then(() => {
  console.log("Connected to DB successfully!!")
}).catch((err) => {
  console.error("DB connection failed", err);
});

// * School routes
app.use("/school", schoolRoutes);

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(5000, () => {
  console.log(`Server started on 5000`);
});
