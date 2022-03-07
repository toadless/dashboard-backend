import { BuildOptions, Model, Sequelize } from "sequelize/types";

export interface GuildSettings extends Model {
  guild_id: string,
  prefix: string,
}

export type GuildSettingsStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): GuildSettings;
}

export default (sequelize: Sequelize, DataTypes: any) => {
  const GuildSettings = <GuildSettingsStatic>sequelize.define('guild', {
    guild_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    prefix: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false,
  });

  return GuildSettings;
};