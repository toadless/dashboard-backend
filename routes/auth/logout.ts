import { Request, Response, Router } from "express";
import { User } from "../../models/user";
import serverResponse from "../../utils/serverResponse";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    const user: User = (req as any).user;
    if (!user) return res.status(401).send(serverResponse(401, "Unauthorized"));

    res.clearCookie("access-token");
    res.clearCookie("refresh-token");

    res.redirect(process.env.FRONT_END!);
})

export default router;