import jsonwebtoken from "jsonwebtoken";
import { environment } from "../loaders/environment.loader.js";

const { verify, sign } = jsonwebtoken;

const generateJWTToken = async (payload, expiry) => {
    return sign(payload, environment.JWT_SECRET, {
        expiresIn: expiry || environment.JWT_EXPIRY,
        issuer: environment.JWT_ISSUER,
        audience: environment.JWT_AUDIENCE
    })
}
const generateJWTTokenPair = async (user) => {
    const accessToken = await generateJWTToken({
        id: user.uuid,
        email: user.accounts.local.email || user.accounts.google.email,
        name: user.fullName || user.userName,
        type: "access",
        roles: user.roles
    })
    const refreshToken = await generateJWTToken({
        id: user.uuid,
        email: user.accounts.local.email || user.accounts.google.email,
        name: user.fullName || user.userName,
        type: "refresh",
        roles: user.roles
    })
    return {
        accessToken,
        refreshToken
    }
}

const verifyJWTToken = async (token) => {
    return verify(token, environment.JWT_SECRET, {
        issuer: environment.JWT_ISSUER,
        audience: environment.JWT_AUDIENCE
    })
}

export {
    generateJWTToken,
    generateJWTTokenPair,
    verifyJWTToken
};
