import crypto from "crypto";
import jwt from "jsonwebtoken"

import objectHash from "../utils/objectHash";

export type refreshToken = {
    token: String,
    payloadHash: String,
};

export default function generateRefreshToken(args: any): refreshToken {
    const payload = {
        _id: args._id.toString(),
        nonce: crypto.randomBytes(32).toString("hex")
    }
    const payloadHash = objectHash(payload)
    const token = jwt.sign(
        { ...payload },
        process.env.JWT_SECRET_REFRESH_TOKEN!,
        {
            algorithm: "HS256",
            issuer: "toadless.net",
            audience: "toadless.net",
            subject: "REFRESH_TOKEN",
            // Amount of time equivalent to browser update cycle, at which time,
            // the clientHash of the user will change due to browser update,
            // and the user will have to revalidate themselves anyway
            expiresIn: "42d",
            jwtid: payloadHash
        }
    )
    return { token: token, payloadHash: payloadHash }
}