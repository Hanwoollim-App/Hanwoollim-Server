module.exports = (sequelize, Sequelize) => {
    const Reservation = sequelize.define("reservation", {
        STARTDATE:{
            type: Sequelize.DATE
        },
        ReservationType: {
            type: Sequelize.STRING
        },
        sidarr: {
            type: Sequelize.JSON
        },
        session: {
            type: Sequelize.JSON
        },
        MON: {
            type: Sequelize.JSON
        },
        TUE: {
            type: Sequelize.JSON
        },
        WEN: {
            type: Sequelize.JSON
        },
        THUR: {
            type: Sequelize.JSON
        },
        FRI: {
            type: Sequelize.JSON
        },
        SAT: {
            type: Sequelize.JSON
        },
        SUN: {
            type: Sequelize.JSON
        }
    });

    return Reservation;
};