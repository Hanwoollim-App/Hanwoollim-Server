const config = require("../config/db.config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        port: config.PORT,
        operatorAliases: false,

        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acqire,
            idle: config.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model")(sequelize, Sequelize);
db.position = require("./position.model")(sequelize, Sequelize);



/* 
    The association between Users and Positions in Many-to-Many relationship:
    - One User can have One Position.
    - One Position can be taken on by many Users.

    With through, foreignKey, otherKey, we'll have new table 'user_positions' 
    as connection between users and positions table via their primary key as foreign keys.
*/

db.position.belongsTo(db.user, {
    through: "user_positions",
    foreignKey: "positionId",
    otherkey: "userId"
});

db.user.belongsToMany(db.position, {
    through: "user_positions",
    foreignKey: "userId",
    otherKey: "positionId",
    as: "positions"  // to use getPosition() and setPosition()
});

db.POSITIONS = ["not approved", "user", "admin", "chairman"];

module.exports = db;