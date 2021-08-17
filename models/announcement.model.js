module.exports = (sequelize, Sequelize) => {
    const Announcement = sequelize.define("announcement", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING
        },
        date: {
            type: Sequelize.DATE
        },
        writer: {
            type: Sequelize.STRING
        },
        body: {
            type: Sequelize.TEXT
        }
    });

    return Announcement;
};