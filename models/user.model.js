module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("MEMBERS", {
        id: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        userName: {
            type: Sequelize.STRING
        },
        major: {
            type: Sequelize.STRING
        },
        studentId: {
            type: Sequelize.INTEGER,
            primaryKey: true
        }
    });

    return User;
};