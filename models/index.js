"use strict";

const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

const User = require("./User");
const Board = require("./Board");

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Board = Board;

User.init(sequelize);
Board.init(sequelize);

User.hasMany(Board, {
  foreignKey: "user_id",
  sourceKey: "id",
  allowNull: false,
  constraints: true,
  onDelete: "cascade",
});

Board.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  allowNull: false,
});

module.exports = db;
