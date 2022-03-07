import { getBotGuilds, getUserGuilds, Guild } from "./api";

export default async function getPermissionGuilds(accessToken: string) {
    const userGuilds: Guild[] = await getUserGuilds(accessToken);
    const botGuilds: Guild[] = await getBotGuilds();

    return userGuilds.filter((guild) => botGuilds.find((botGuild) => botGuild.id === guild.id) && (parseInt(guild.permissions) & 0x20) === 0x20);
}