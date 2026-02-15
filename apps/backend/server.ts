import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./src/app";

dotenv.config();

const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed", err);
  });
