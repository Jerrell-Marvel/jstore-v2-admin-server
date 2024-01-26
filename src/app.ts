import express, { Request, Response, request } from "express";
const app = express();

//Dot env'
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log(path.resolve(__dirname, "../.env"));

//JWT
import jwt from "jsonwebtoken";

//cors
import cors from "cors";
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "127.0.0.1:5500", "192.168.0.182:3000"],
  })
);

//Express async errors
import "express-async-errors";
import { pool } from "./db";
import { errorHandler } from "./middleware/errorHandler";

//parse json
app.use(express.json());

app.get("/test", async (req: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM products");

  return res.json(result.rows);
});

// routes
import productRoutes from "./routes/product";

app.use("/product", productRoutes);

// app.use(errorHandler);

// connect
const PORT = 5000;
app.listen(PORT, async () => {
  try {
    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    console.log(err);
  }
});
