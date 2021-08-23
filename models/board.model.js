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
        expireDate: {
            type: Sequelize.DATE
        },
        fileUrl: {
            type: Sequelize.TEXT
        },
        body: {
            type: Sequelize.TEXT
        }
    });

    return Board;
};