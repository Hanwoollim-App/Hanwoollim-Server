module.exports = (sequelize, Sequelize) => {
    const Board = sequelize.define("board", {
        title: {
            type: Sequelize.STRING
        },
        expiredate: {
            type: Sequelize.DATE
        },
        fileurl: {
            type: Sequelize.STRING
        },
        body: {
            type: Sequelize.STRING
        }
    });

    return Board;
};