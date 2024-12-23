const createTypeController = async (req, res) => {
    const user = req.user._id;
    const requestedData = req.body;

    const type = await createType(user, requestedData);

    res.json({
        type
    })
}

export { createTypeController };
