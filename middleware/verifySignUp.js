/*
    check duplicate Username or Student ID
    1. check if Id or studentId is already exist
    2. check if potisions in the request is existed
*/

const db = require("../models");
const User = db.user;

checkDuplicateIdOrStdId = (req, res, next) => {
    // check Id
    User.findOne({
        where: {
            id: req.body.id
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Failed! ID is already in use!"
            });

            return;
        }

        // still in then()

        // check studentId
        User.findOne({
            where: {
                studentId: req.body.studentId
            }
        }).then(user => {
            if (user) {
                res.status(400).send({
                    message: "Failed! Student Id is already in use!"
                });

                return;
            }

            next();
        });

    });
};


const verifySignUp = {
    checkDuplicateIdOrStdId: checkDuplicateIdOrStdId
};

module.exports = verifySignUp;