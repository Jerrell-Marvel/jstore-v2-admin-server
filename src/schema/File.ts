import { z } from "zod";
import { Readable } from "stream";

let test: Express.Multer.File;

export const FileSchema = z.object({
  buffer: z.instanceof(Buffer).optional(),
  destination: z.string(),
  fieldname: z.string(),
  filename: z.string(),
  mimetype: z.string(),
  originalname: z.string(),
  path: z.string(),
  size: z.number(),
  encoding: z.string(),
  stream: z.instanceof(Readable),
});
