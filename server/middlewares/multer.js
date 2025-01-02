import multer from "multer";

const multerUpload = multer({
     limits: {
          fileSize: 1024 * 1024 * 5,
     }
});

export const attchmentsMulter = multerUpload.array("files", 5);