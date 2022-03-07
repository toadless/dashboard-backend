import jwt from "jsonwebtoken";

export default function checkToken(token: string) {
    if (!token) { return null }
    // Set JWT_SECRET to correct value based on the subject claim of the
    // incoming jwt
    let JWT_SECRET
    switch (jwt.decode(token)!.sub) {
        case "REFRESH_TOKEN":
            JWT_SECRET = process.env.JWT_SECRET_REFRESH_TOKEN
            break
        case "ACCESS_TOKEN":
            JWT_SECRET = process.env.JWT_SECRET_ACCESS_TOKEN
            break
        default:
            JWT_SECRET = null
    }

    try {
        // jwt token verification performed synchronously if no callback
        // is passed - therefore call is wrapped in a try catch block
        // in case jwt.verify() throws an error
        return jwt.verify(token, JWT_SECRET!)
    } catch {
        return null
    }
}