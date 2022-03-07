import { Request, Response, Router } from "express";

import { User } from "../../models/user";
import { decrypt } from "../../utils/auth";
import getMutualGuilds, { MutualGuilds } from "../../utils/mutualGuilds";
import serverResponse from "../../utils/serverResponse";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const user: User = (req as any).user;
    if (!user) return res.status(401).send(serverResponse(401, "Unauthorized"));

    const guilds: MutualGuilds = await getMutualGuilds(decrypt(user.discordAccessToken));
    res.status(200).send(serverResponse(200, "OK", guilds));
})

export default router;