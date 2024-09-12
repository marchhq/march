import { FileAsset } from '../../models/lib/asset.model.js';

const uploadFile = async (s3Url, user) => {
    const newFileAsset = new FileAsset({
        asset: s3Url,
        user,
        attributes: {},
        isDeleted: false
    });
    await newFileAsset.save();
    return newFileAsset;
};

export {
    uploadFile
}
