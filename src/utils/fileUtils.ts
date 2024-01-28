import fs from "fs/promises";
import { InternalServerError } from "../errors/InternalServerError";

export const moveFiles = async (files: Express.Multer.File[]): Promise<string[]> => {
  const promises = [];
  const newPaths: string[] = [];
  try {
    for (const file of files) {
      const fileName = file.filename;
      const oldPath = file.path;
      const destinationPath = `./public/product-images/${fileName}`;
      promises.push(fs.rename(oldPath, destinationPath));
      newPaths.push(destinationPath);
    }

    await Promise.all(promises);
    return newPaths;
  } catch (e) {
    throw new InternalServerError("fail uploading files");
  }
};
