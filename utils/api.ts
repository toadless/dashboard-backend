import fetch from "node-fetch";
import { URLSearchParams } from "url";

export type Guild = {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    permissions: string;
    features: string[];
};

export type Role = {
    id: string;
    name: string;
    permissions: string;
    color: string;
    icon: string;
};

export async function generateDiscordAccessToken(refreshToken: string) {
    const response = await fetch(process.env.DISCORD_API + "/oauth2/token", {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: process.env.CLIENT_ID!,
            client_secret: process.env.CLIENT_SECRET!,
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        })
    })
    return response.json();
}

export async function getDiscordTokens(code: string, redirect: string) {
    const response = await fetch(process.env.DISCORD_API + "/oauth2/token", {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: process.env.CLIENT_ID!,
            client_secret: process.env.CLIENT_SECRET!,
            grant_type: "authorization_code",
            code,
            redirect_uri: redirect,
        }),
    });
    return response.json();
}

export async function getDiscordUser(accessToken: string) {
    const response = await fetch(process.env.DISCORD_API + "/users/@me", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    return response.json();
}

export async function getBotGuilds() {
    const response = await fetch(process.env.DISCORD_API + "/users/@me/guilds", {
        method: "GET",
        headers: {
            Authorization: `Bot ${process.env.TOKEN}`
        }
    })
    return response.json();
}

export async function getUserGuilds(accessToken: string) {
    const response = await fetch(process.env.DISCORD_API + "/users/@me/guilds", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    return response.json();
}

export async function getGuildRoles(guildId: string) {
    const response = await fetch(process.env.DISCORD_API + "/guilds/" + guildId + "/roles", {
        method: "GET",
        headers: {
            Authorization: `Bot ${process.env.TOKEN}`
        }
    })
    return response.json();
}