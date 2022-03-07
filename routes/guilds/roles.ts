import { Request, Response, Router } from "express";
import { Role } from "../../utils/api";
import { User } from "../../models/user";
import db from "../../sequelize";
import { getGuildRoles } from "../../utils/api";
import serverResponse from "../../utils/serverResponse";

const router = Router();

router.get("/:id/roles", async (req: Request, res: Response) => {
    const user: User = (req as any).user;
    if (!user) return res.status(401).send(serverResponse(401, "Unauthorized"));

    const { id } = req.params;
    const settings = await db.GuildSettings.findOne({ where: { guild_id: id } });

    if (!settings) return res.status(401).send(serverResponse(500, "Invalid guild id."));

    let roles: Role[] = await getGuildRoles(id);
    roles = roles.filter(role => role.name != "@everyone");

    const payload = {
        roles
    }

    res.status(200).send(serverResponse(200, "OK", payload));
})

export default router;