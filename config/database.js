const {Sequelize} = require("sequelize");

require("dotenv").config();

const sequelize = new Sequelize(
    process.env.db_name,
    process.env.db_user,
    process.env.db_password,
    {
    host: process.env.db_host,
    port: process.env.db_port,
    dialect: "postgres",
});

module.exports = sequelize;


