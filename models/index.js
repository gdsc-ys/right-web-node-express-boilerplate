"use strict";

// const fs = require('fs');
// const path = require('path');
const Sequelize = require("sequelize");
// const process = require('process');
// const basename = path.basename(__filename);
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
// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs.readdirSync(__dirname)
//   .filter((file) => {
//     return (
//       file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
//     );
//   })
//   .forEach((file) => {
//     const model = require(path.join(__dirname, file))(
//       sequelize,
//       Sequelize.DataTypes
//     );
//     db[model.name] = model;
//   });

// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Board = Board;

User.init(sequelize);
Board.init(sequelize);

// User.associate(db);
// Board.associate(db);
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
