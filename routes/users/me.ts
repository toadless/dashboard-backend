import { Request, Response, Router } from "express";
import { User } from "../../models/user";
import serverResponse from "../../utils/serverResponse";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    const user: User = (req as any).user;
    if (!user) return res.status(401).send(serverResponse(401, "Unauthorized"));

    const payload = {
        id: user.id,
        username: user.name,
        discriminator: user.discriminator,
        avatar: user.avatar,
    }

    res.status(200).send(serverResponse(200, "OK", payload));
})

export default router;