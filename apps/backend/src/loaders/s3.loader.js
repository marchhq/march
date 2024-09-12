import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { environment } from './environment.loader.js';
import { v4 as uuid } from 'uuid';

// S3 client configuration
const s3 = new S3Client({
    region: environment.AWS_REGION,
    credentials: {
        accessKeyId: environment.AWS_ACCESS_KEY,
        secretAccessKey: environment.AWS_SECRET_KEY
    }
});

// Multer configuration to upload files directly to S3
const upload = multer({
    storage: multerS3({
        s3,
        bucket: environment.AWS_BUCKET_NAME,
        acl: 'public-read',
        key: function (req, file, cb) {
            const userUuid = req.user.uuid;
            const filename = `user-${userUuid}/${uuid()}-${file.originalname}`;
            cb(null, filename);
        }
    }),
    limits: { fileSize: environment.FILE_SIZE_LIMIT || 5 * 1024 * 1024 } // 5MB file size limit
});
export {
    upload,
    s3
};
