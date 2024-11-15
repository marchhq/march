import { LogSnag } from '@logsnag/node';
import { environment } from "./environment.loader.js";

const logsnag = new LogSnag({
    token: environment.LOGSNAG_TOKEN,
    project: environment.LOGSNAG_PROJECT_NAME
});

export {
    logsnag
}
