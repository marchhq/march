import { FileAsset } from '../../models/lib/asset.model.js';

const uploadFileController = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const file = req.file;
        const s3Url = file.location;

        const newFileAsset = new FileAsset({
            asset: s3Url,  
            user: req.user.id,  
            attributes: {},
            isDeleted: false
        });

        await newFileAsset.save(); 

        res.status(200).json({
            newFileAsset
        });
    } catch (err) {
        console.error('Error uploading file: ', err);
        next(err);
    }
};

export {
    uploadFileController
}
