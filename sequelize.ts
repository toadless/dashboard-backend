import { DataTypes, Sequelize } from "sequelize";
import user from "./models/user";
import guildSettings from "./models/guild";

const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASSWORD!,
    {
        host: process.env.DB_HOST!,
        dialect: "postgres",
        port: process.env.DB_PORT! as unknown as number,
    }
);

export default {
    sequelize,
    User: user(sequelize, DataTypes),
    GuildSettings: guildSettings(sequelize, DataTypes)
}