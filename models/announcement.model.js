module.exports = (sequelize, Sequelize) => {
    const Announcement = sequelize.define("announcement", {
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
            type: Sequelize.STRING
        }
    });

    return Announcement;
};