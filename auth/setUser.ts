import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import checkToken from "./checkToken";
import { encrypt, decrypt } from "../utils/auth";
import generateAccessToken from "./generateAccessToken";
import db from "../sequelize";
import { generateDiscordAccessToken } from "../utils/api";

export default async function setUser(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies["access-token"];
    if (!accessToken) {
        (req as any).user = null;
        return next();
    }

    let token = checkToken(accessToken);

    if (!token) {
        // If the access token is invalid or expired and they have a refresh token
        // we will "refesh" their access token.

        const refreshToken = req.cookies["refresh-token"];
        if (!refreshToken) {
            (req as any).user = null;
            return next();
        }

        const validRefreshToken = checkToken(refreshToken);
        if (!validRefreshToken) {
            (req as any).user = null;
            return next();
        }

        const user = await db.User.findOne({ where: { id: (validRefreshToken as any)._id } });
        if (!user) {
            (req as any).user = null;
            return next();
        }

        const refreshTokenJTI = (jwt.decode(refreshToken) as any)!.jti;

        let hasRefreshToken = false;
        user.refreshTokens.map((tkn: { tokenJti: any; }) => {
            if (tkn.tokenJti === refreshTokenJTI) hasRefreshToken = true;
        })
        if (!hasRefreshToken) {
            (req as any).user = null;
            return next();
        }

        const accessToken = generateAccessToken({ where: { _id: user.id } });
        res.cookie("accessToken", accessToken.token, { httpOnly: true, }); // Sending the newly generated access token to the user
        token = checkToken((accessToken.token as string));
    }

    const user = await db.User.findOne({ where: { id: (token as any)!._id } });
    if (!user) {
        (req as any).user = null;
        return next();
    }

    // Checking if the users discord access token
    // has expired. If it has expired then we will
    // request a new one. If the request fails then
    // we will know that the user has deauthorized
    // the application through discord. We will wrap
    // the code block in try/catch to see if the request
    // fails.
    try {
        if (user.expiry <= new Date()) {
            const discordRefreshToken = user.discordRefreshToken;
            const discordAccessToken = await generateDiscordAccessToken(decrypt(discordRefreshToken));

            if (discordAccessToken.error) {
                // At this point the user would have
                // deauthorized our app to we are going
                // to clear their accessToken and
                // refreshToken and respond saying that
                // they are unauthorized

                res.clearCookie("accessToken");
                res.clearCookie("refreshToken");

                (req as any).user = null;
                return next();
            }

            // Discord token expiry
            let date: Date = new Date();
            date.setSeconds(date.getSeconds() + 604800);

            // If we have successfully updated the users
            // access_token then we will update it in the 
            // database and then we will reset the expiry
            // date.
            const { access_token, refresh_token } = discordAccessToken;
            user.discordAccessToken = encrypt(access_token);
            user.discordRefreshToken = encrypt(refresh_token);
            user.expiry = date;
            await user.save();
        }
    } catch (error) {
        (req as any).user = null;
        return next();
    }

    (req as any).user = user;
    return next();
}