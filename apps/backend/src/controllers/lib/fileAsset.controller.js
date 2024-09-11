import { FileAsset } from '../../models/lib/asset.model.js';
import { v4 as uuid } from 'uuid';

// Controller to handle file upload
export const uploadFileController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const file = req.file;  // Uploaded file metadata from multer
        const s3Url = file.location;  // S3 URL from multer-s3

        // Store file metadata in MongoDB
        const newFileAsset = new FileAsset({
            asset: s3Url,  // Store the S3 file URL
            user: req.user.id,  // Assuming you have user data in req.user (e.g., from auth middleware)
            attributes: {},  // You can pass additional file attributes here
            isDeleted: false
        });

        await newFileAsset.save(); 

        res.status(201).json({ message: 'File uploaded successfully', fileAsset: newFileAsset });
    } catch (error) {
        console.error('Error uploading file: ', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
};
