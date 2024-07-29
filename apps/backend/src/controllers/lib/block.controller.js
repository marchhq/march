
const createBlockController = async (req, res, next) => {
    try {
        const user = req.auth.userId;

        const requestedData = req.body;
        const block = await createBlock(user, requestedData);

        res.status(200).json({
            status: 200,
            response: block
        });
    } catch (err) {
        next(err);
    }
};

export {
    createBlockController
}
