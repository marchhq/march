import { Type } from "../../models/lib/type.model.js";

const createType = async (user, requestedData) => {
    const { slug } = requestedData;
    const typeExists = await Type.findOne({ slug });
    if (typeExists) {
        throw new Error("Type already exists");
    }
    const newType = await Type.create({
        slug,
        user
    });
    return newType;
}

export { createType };
