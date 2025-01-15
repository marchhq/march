import { Source } from "../../models/lib/source.model.js";

const createSource = async (user, source) => {
    const newSource = new Source({ ...source, user });
    await newSource.save();
    return newSource;
}
const getAllSources = async (user) => {
    const sources = await Source.find({ user });
    return sources;
}

export { createSource, getAllSources };
