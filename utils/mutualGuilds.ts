import { getBotGuilds, getUserGuilds, Guild } from "./api";

export type MutualGuilds = {
    included: Guild[],
    excluded: Guild[],
}

export default async function getMutualGuilds(accessToken: string): Promise<MutualGuilds> {
    const userGuilds: Guild[] = await getUserGuilds(accessToken);
    const botGuilds: Guild[] = await getBotGuilds();

    const validGuilds = userGuilds.filter((guild) => (parseInt(guild.permissions) & 0x20) == 0x20);
    const included: Guild[] = [];
    const excluded = validGuilds.filter((guild) => {
        const findGuild = botGuilds.find((g) => g.id == guild.id);
        if (!findGuild) return guild;
        included.push(findGuild);
    });

    return { excluded, included };
}