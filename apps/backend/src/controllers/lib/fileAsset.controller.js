import { s3 } from '../../loaders/s3.loader.js';
import { FileAsset } from '../../models/lib/asset.model.js';
import { environment } from '../../loaders/environment.loader.js';

const uploadFileController = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const file = req.file;

        // AWS S3 upload parameters
        const uploadParams = {
            Bucket: environment.AWS_BUCKET_NAME,
            Key: `uploads/${file.originalname}`, // file name in S3
            Body: fs.createReadStream(file.path), // file content
        };

        // Upload file to S3
        const data = await s3.upload(uploadParams).promise();

        // Save the S3 file URL and other file details to MongoDB
        const newFileAsset = new FileAsset({
            asset: data.Location, // S3 URL
            user: req.user.id, // Assume user information is in req.user
        });

        await newFileAsset.save();

        // Respond with success and file info
        res.status(201).json({ message: 'File uploaded successfully', fileAsset: newFileAsset });

    } catch (err) {
        console.error('Error uploading file: ', err);
        next(err);
    }
        
};

export {
    uploadFileController
}
