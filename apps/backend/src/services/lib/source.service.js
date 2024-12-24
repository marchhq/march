import { Source } from "../../models/lib/source.model.js";

const getAllSources = async (user) => {
    const sources = await Source.find({ user });
    return sources;
}

export { getAllSources };
