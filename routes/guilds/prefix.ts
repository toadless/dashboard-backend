import { Request, Response, Router } from "express";

import { User } from "../../models/user";
import { Guild } from "../../utils/api";
import db from "../../sequelize";
import { decrypt } from "../../utils/auth";
import getPermissionGuilds from "../../utils/permissionGuilds";
import serverResponse from "../../utils/serverResponse";

const router = Router();

router.put("/:id/prefix", async (req: Request, res: Response) => {
    const user: User = (req as any).user;
    if (!user) return res.status(401).send(serverResponse(401, "Unauthorized"));

    const { id } = req.params;
    const settings = await db.GuildSettings.findOne({ where: { guild_id: id } });
    if (!settings) return res.status(401).send(serverResponse(500, "Invalid guild id."));

    const permissionGuilds: Guild[] = await getPermissionGuilds(decrypt(user.discordAccessToken));
    if (!permissionGuilds.some(g => g.id === id)) return res.status(401).send(serverResponse(401, "Unauthorized"));

    const { prefix } = req.body;
    if (!prefix || prefix.length > 5) return res.status(500).send(serverResponse(500, "Invalid prefix supplied."));

    settings.prefix = prefix;
    settings.save();

    res.status(200).send(serverResponse(200, "OK"));
})

export default router;