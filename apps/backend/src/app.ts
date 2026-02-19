import cors from "cors";
import express from "express";
import v1Routes from "./routes/v1"

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1",v1Routes);

app.get("/health", (_req, res) => {
  res.json({ message: "Backend running" });
});

export default app;
