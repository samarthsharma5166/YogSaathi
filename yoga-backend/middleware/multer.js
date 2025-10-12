import path from 'path';
import multer from 'multer';
const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 10 * 1024 * 1024 }, // max size is 50mb 
    storage: multer.diskStorage({
        destination: "uploads/",
        filename: (_req, file, cb) => {
            cb(null, file.originalname);
        }
    }),
    fileFilter: (_req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (
            ext !== ".jpg" &&
            ext !== ".jpeg" &&
            ext !== ".webp" &&
            ext !== ".png" 
        ) {
            cb({
                message: `Unsupported file type ${ext}`,
            })
        }

        cb(null, true);
    }
})

export default upload;