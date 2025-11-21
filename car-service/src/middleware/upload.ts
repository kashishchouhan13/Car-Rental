import multer from "multer";
import path from "path";

// Ensure uploads directory exists
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

export const upload = multer({ storage });
