import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
<<<<<<< HEAD
import fetchDoctorRouter from "./routes/fetchDoctors.js"; // Ensure correct import
=======
>>>>>>> c50f1c4 (Updated Code)

// App config
const app = express();
const port = process.env.PORT || 4000;

// Connect to DB & Cloudinary
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
<<<<<<< HEAD
app.use("/api/search-doctors", fetchDoctorRouter); // Use correct variable name
=======
 // Use correct variable name
>>>>>>> c50f1c4 (Updated Code)

// Test route
app.get("/", (req, res) => {
  res.send("API Working");
});

// Start server
app.listen(port, () => console.log(`Server started on PORT: ${port}`));
