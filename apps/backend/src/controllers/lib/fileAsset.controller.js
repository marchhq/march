import { uploadFile } from "../../services/lib/fileAsset.controller.js";

const uploadFileController = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const user = req.user.id
        const file = req.file;
        const s3Url = file.location;
        const fileAsset = await uploadFile(s3Url, user);
        res.status(200).json({
            fileAsset
        });
    } catch (err) {
        console.error('Error uploading file: ', err);
        next(err);
    }
};

export {
    uploadFileController
}
