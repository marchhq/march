import fs from "fs";
import path from "path";
import handlebars from "handlebars";

const readTemplateFile = async (name, data) => {
    const content = fs
        .readFileSync(path.resolve("src", "templates", `${name}.hbs`))
        .toString("utf8");
    const template = handlebars.compile(content, {
        noEscape: true
    });
    return template(data);
};

export {
    readTemplateFile
}
