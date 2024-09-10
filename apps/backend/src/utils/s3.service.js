import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../loaders/s3.loader.js';
import { environment } from '../loaders/environment.loader.js';

export const getObject = async (key) => {
    const data = await s3.send(
        new GetObjectCommand({
            Bucket: environment.AWS_BUCKET_NAME,
            Key: key
        })
    )
    console.log(data.Body)
};
