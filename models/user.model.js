module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("MEMBERS", {
        id: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.STRING
        },
        major: {
            type: Sequelize.STRING
        },
        studentid: {
            type: Sequelize.INTEGER,
            primaryKey: true
        }
    });

    return User;
};