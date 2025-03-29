import express from "express";
import cors from "cors";
import reviewRoutes from "./routes/reviewRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import serverless from "serverless-http";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.use("/api/reviews", reviewRoutes);
app.use("/api/comments", commentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export const handler = serverless(app);
