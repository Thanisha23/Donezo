import cors from "cors";
import express from "express";
import v1Routes from "./routes/v1"

const app = express();
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/v1",v1Routes);

app.get("/health", (_req, res) => {
  res.json({ message: "Backend running" });
});

export default app;
