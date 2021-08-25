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
        writer: {
            type: Sequelize.STRING
        },
        expireDate: {
            type: Sequelize.DATE
        },
        fileUpload: {
            type: Sequelize.BOOLEAN
        },
        body: {
            type: Sequelize.TEXT
        }
    });

    return Board;
};