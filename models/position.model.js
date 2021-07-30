module.exports = (sequelize, Sequelize) => {
    const Position = sequelize.define("positions", {
        pid: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING
        }
    });

    return Position;
};