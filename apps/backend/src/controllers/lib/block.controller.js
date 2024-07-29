

const createBlockController = async (req, res) => {
    try {
      const block = await blockService.createBlock(req.body);
      res.status(201).json(block);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };

  const createBlockController = async (req, res, next) => {
    try {
        // const user = req.user._id;
        const user = req.auth.userId;

        const requestedData = req.body;
        const item = await createItem(user, requestedData);

        res.status(200).json({
            status: 200,
            response: item
        });
    } catch (err) {
        next(err);
    }
};

export {

}
