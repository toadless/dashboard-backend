import { BuildOptions, Model, Sequelize } from "sequelize/types";

export interface User extends Model {
  id: string,
  name: string,
  discriminator: string,
  avatar: string,

  discordAccessToken: string,
  discordRefreshToken: string,
  expiry: Date,

  refreshTokens: Array<any>,
}

export type UserStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): User;
}

export default (sequelize: Sequelize, DataTypes: any) => {
  const User = <UserStatic>sequelize.define('User', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discriminator: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    discordAccessToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discordRefreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiry: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    refreshTokens: DataTypes.ARRAY(DataTypes.STRING),
  });

  return User;
};