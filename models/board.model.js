module.exports = (sequelize, Sequelize) => {
    const Board = sequelize.define("board", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING
        },
        expiredate: {
            type: Sequelize.DATE
        },
        fileurl: {
            type: Sequelize.TEXT
        },
        body: {
            type: Sequelize.TEXT
        }
    });

    return Board;
};