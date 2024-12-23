import { createType, getAllTypes } from "../../services/lib/type.service.js";

const createTypeController = async (req, res) => {
    const user = req.user._id;
    const requestedData = req.body;

    const type = await createType(user, requestedData);

    res.json({
        type
    })
}
const getAllTypesController = async (req, res) => {
    const user = req.user._id;
    const types = await getAllTypes(user);
    res.json({
        types
    })
}

export { createTypeController, getAllTypesController };
