import { Request, Response, Router } from "express";

import { encrypt } from "../../utils/auth";
import generateRefreshToken from "../../auth/generateRefreshToken";
import generateAccessToken from "../../auth/generateAccessToken";
import { getDiscordTokens, getDiscordUser } from "../../utils/api";
import serverResponse from "../../utils/serverResponse";
import db from "../../sequelize";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const { code } = req.query;

    if (code) {
        try {
            const tokens: any = await getDiscordTokens(code as string, req.protocol + "://" + req.get('host') + "/discord/callback");

            const { access_token, refresh_token } = tokens;
            if (!access_token || !refresh_token) return res.status(400).send(serverResponse(400, "Bad request"))

            const user: any = await getDiscordUser(access_token);
            if (!user.id) return res.status(400).send(serverResponse(400, "Bad request"))

            const { id, username, avatar, discriminator } = user;

            const encrypted_access_token = encrypt(access_token);
            const encrypted_refresh_token = encrypt(refresh_token);

            const usr = await db.User.findOne({ where: { id: id } });

            if (usr) {
                const user = await usr.update({
                    name: username,
                    discriminator,
                    avatar,

                    discordAccessToken: encrypted_access_token,
                    discordRefreshToken: encrypted_refresh_token,
                    expiry: new Date().setSeconds(new Date().getSeconds() + 604800)
                });
                (req as any).user = user;
            } else {
                const newUser = await db.User.create({
                    refreshTokens: [],

                    id: id,
                    name: username,
                    discriminator,
                    avatar,

                    discordAccessToken: encrypted_access_token,
                    discordRefreshToken: encrypted_refresh_token,
                    expiry: new Date().setSeconds(new Date().getSeconds() + 604800),
                });

                (req as any).user = newUser;
            }
        } catch (err) {
            return res.status(500).send(serverResponse(500, "Internal server error"));
        }
    } else {
        return res.status(400).send(serverResponse(400, "Bad request"))
    }

    if (!(req as any).user) return res.status(400).send(serverResponse(400, "Bad request"));

    const accessToken = generateAccessToken({ _id: (req as any).user.id });
    const refreshToken = generateRefreshToken({ _id: (req as any).user.id });

    res.cookie("access-token", accessToken.token, { httpOnly: true, maxAge: 60000 * 60  });
    res.cookie("refresh-token", refreshToken.token, { httpOnly: true, maxAge: 60000 * 60 * 24 * 42 });

    const user = await db.User.findOne({ where: { id: (req as any).user.id }});
    if (!user) return res.status(400).send(serverResponse(400, "Bad request"));

    const newRefreshTokens = [...user!.refreshTokens, { tokenJti: refreshToken.payloadHash }]
    user.update({ refreshTokens: newRefreshTokens });

    res.redirect(process.env.REDIRECT_URL!);
})

export default router;