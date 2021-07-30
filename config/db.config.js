/*
    configure MYSQL database & Sequelize
*/

module.exports = {
    HOST: process.env.DB_HOST,
    PORT: process.env.DB_PORT,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PW,
    DB: process.env.DB_DATABASE,
    dialect: "mysql",
    pool: {  // Sequelize connection pool configuration.
        max: 30, // max/min number of connection in pool
        min: 0,
        acqire: 30000, // maximum time, in milliseconds, that pool will try to get connection before throwing error
        idle: 10000 // maximum time, in milliseconds, that a connection can be idle before being released
    }
}