import multer from "multer";
import fs from "fs";
import path from "path";

export const fileStorageCourse = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/courses");
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        const uniqId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${file.fieldname}-${uniqId}.${ext}`);
    }
});

export const fileStorage = (uploadPath = 'courses') => {
    const fullPath = `public/uploads/${uploadPath}`;

    // Buat folder jika belum ada
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }

    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, fullPath);
        },
        filename: (req, file, cb) => {
            const ext = file.originalname.split('.').pop();
            const uniqId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            cb(null, `${file.fieldname}-${uniqId}.${ext}`);
        }
    });
};

export const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png"
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only jpg, jpeg, png allowed"), false);
    }
};
