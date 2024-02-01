import fs from "fs/promises";
import { InternalServerError } from "../errors/InternalServerError";
import { generateUniqueSuffix } from "./common";

export const saveFiles = async (files: Express.Multer.File[]) => {
  const publicDirectoryPath = `C:/IT/Projects/jstore-v2/admin/server/dist`;

  const promises = [];

  try {
    for (const file of files) {
      const filePath = file.path;
      const destinationPath = publicDirectoryPath + filePath;

      promises.push(fs.writeFile(destinationPath, file.buffer));
    }

    await Promise.all(promises);
  } catch (err) {
    console.log(err);
    throw new InternalServerError("error occured when saving files");
  }
};

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

export const attachPathToFiles = (files: Express.Multer.File[]) => {
  const filesWithPath = files.map((file) => {
    return {
      ...file,
      path: "/public/product-images/" + generateUniqueSuffix() + "-" + file.originalname,
    };
  });

  return filesWithPath;
};
