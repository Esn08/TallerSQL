/**
 * @file multer-config.js
 * @summary A factory function for creating and configuring a Multer instance.
 * @description This module provides a reusable function to generate a configured Multer middleware
 * for handling `multipart/form-data`, which is primarily used for uploading files.
 * It ensures the upload directory exists and sets a unique filename for each uploaded file.
 */


/**
 * Creates and configures a Multer instance for file uploads.
 *
 * This factory function encapsulates the setup logic for Multer. It performs two main tasks:
 * 1. It ensures that the target directory for uploads exists, creating it if necessary.
 * 2. It configures the storage engine to control the destination and filename of uploaded files.
 *
 * @returns {multer.Multer} A fully configured Multer instance ready to be used as middleware in an Express route.
 */

import fs from "fs";
import multer from "multer";

export const uploadDir = "src/load-multer/uploads";

export function createMulter() {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });

    return multer({ storage });
}