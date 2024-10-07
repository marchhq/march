import { linkPreviewGenerator } from "../../services/lib/linkPreview.service.js";

const linkPreviewGeneratorController = async (req, res, next) => {
    try {
        const url = req.body.url;

        const previewData = await linkPreviewGenerator(url);

        res.status(200).json({
            previewData
        });
    } catch (err) {
        next(err);
    }
};

export {
    linkPreviewGeneratorController
}
