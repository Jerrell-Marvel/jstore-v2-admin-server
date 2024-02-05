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

import { z } from "zod";

app.get("/test", async (req: Request, res: Response) => {
  const result = await pool.query(`DO
  $$
  DECLARE
      variant_count INT;
  BEGIN 
      SELECT COUNT(*) INTO variant_count FROM product_images WHERE product_id = 80;
  
      RAISE EXCEPTION '%', variant_count;
  END
  $$`);

  return res.json(result);
  // const schema = z.object({
  //   name: z.number(),
  // });
  // const obj = {
  //   name: "asep",
  // };
  // try {
  //   schema.parse(obj);
  // } catch (e: any) {
  //   return res.json(e);
  // }
});

app.post("/example", (req, res) => {
  console.log("awewo");
  // Access query parameters using req.query
  // const searchTerm = req.query.searchTerm;

  console.log(req.query);

  return res.json(req.query);
  // Process the request further
  // res.send("Received search term: " + searchTerm);
});

// routes
import productRoutes from "./routes/product";
import productImageRoutes from "./routes/productImage";
import { updateProduct } from "./services/product.service";

app.use("/product", productRoutes);
app.use("/productImage", productImageRoutes);

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
