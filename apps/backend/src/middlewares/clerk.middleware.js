import { createClerkClient } from "@clerk/clerk-sdk-node";
import { environment } from "../loaders/environment.loader.js";

const clerk = createClerkClient({ secretKey: environment.CLERK_SECRET_KEY });

const ClerkUserData = async (req, res, next) => {
    const { userId } = req.auth;
    const user = await clerk.users.getUser(userId);
    req.auth.user = user;
    next();
};

export {
    ClerkUserData,
    clerk
}
