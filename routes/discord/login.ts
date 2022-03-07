import { Request, Response, Router } from "express";

const router = Router();

const scope = ["guilds", "identify"].join(" ");

router.get("/", (req: Request, res: Response) => {
    const encodedRedirect = encodeURIComponent(req.protocol + "://" + req.get('host') + "/discord/callback");
    const encodedScope = encodeURIComponent(scope);

    const authURI = [
        "https://discord.com/api/oauth2/authorize",
        "?client_id=",
        process.env.CLIENT_ID,
        "&redirect_uri=",
        encodedRedirect,
        "&response_type=code",
        "&scope=",
        encodedScope,
    ].join("");

    res.redirect(authURI)
})

export default router;