import express from "express";

import login from "./routes/discord/login";
import callback from "./routes/discord/callback";
import me from "./routes/users/me";
import guilds from "./routes/guilds/guilds"
import settings from "./routes/guilds/settings";
import prefix from './routes/guilds/prefix';
import roles from "./routes/guilds/roles";
import logout from "./routes/auth/logout";

const router = express.Router();

router.use("/discord/login", login);
router.use("/discord/callback", callback);
router.use("/users/me", me);
router.use("/guilds", guilds)
router.use("/guilds", settings);
router.use("/guilds", prefix);
router.use("/guilds", roles);
router.use("/auth/logout", logout);

export default router;