import crypto from "crypto";
import jwt from "jsonwebtoken"

import objectHash from "../utils/objectHash";

export type accessToken = {
    token: String,
    payloadHash: String,
};

export default function generateAccessToken(args: any): accessToken {
    const payload = {
        _id: args._id,
        nonce: crypto.randomBytes(32).toString("hex")
    }
    const payloadHash = objectHash(payload)
    const token = jwt.sign(
        { ...payload },
        process.env.JWT_SECRET_ACCESS_TOKEN!,
        {
            algorithm: "HS256",
            issuer: "toadless.net",
            audience: "toadless.net",
            subject: "ACCESS_TOKEN",
            expiresIn: "1h",
            jwtid: payloadHash
        }
    )
    return { token: token, payloadHash: payloadHash }
}