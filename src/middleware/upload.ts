import { Response, Request, NextFunction } from "express";
import multer from "multer";
import { error } from "../utils/apiResponse";

const storage: multer.StorageEngine = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    cb(null, "./public/uploads");
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = (req: Request, res: Response, next: NextFunction) => {
  const multerUpload = multer({
    storage,
    limits: { fileSize: 500 * 1024 },
    fileFilter(
      req: Request,
      file: Express.Multer.File,
      cb: multer.FileFilterCallback
    ) {
      if (
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg"
      ) {
        return cb(null, true);
      } else {
        cb(
          new Error("Invalid Image. Only images with .png, .jpg are allowed!")
        );
      }
    },
  }).single("image");

  multerUpload(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code == "LIMIT_FILE_SIZE") {
        res.status(400).json(error("Image size limit exceeds 500 KB"));
      } else {
        res.status(400).json(error(err.message));
      }
    } else if (err) {
      res
        .status(500)
        .json(error(err.message || "Some error occured whiie uploading image"));
      next(err);
    } else {
      next();
    }
  });
};

export default upload;
