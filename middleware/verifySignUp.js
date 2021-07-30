/*
    check duplicate Username or Student ID
    1. check if Id or Studentid is already exist
    2. check if potisions in the request is existed
*/

const db = require("../models");
const POSITIONS = db.POSITIONS;
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

        // check studentid
        User.findOne({
            where: {
                studentid: req.body.studentid
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

checkPositionsExsisted = (req, res, next) => {
    if (req.body.positions) {
        for (let i=0; i < req.body.positions.length; i++) {
            if (!POSITIONS.includes(req.body.positions[i])){
                res.status(400).send({
                    message: "Failed! Position does not exist = " + req.body.positions[i]
                });
                return;
            }
        }
    }

    next();
};

const verifySignUp = {
    checkDuplicateIdOrStdId: checkDuplicateIdOrStdId,
    checkPositionsExsisted: checkPositionsExsisted
};

module.exports = verifySignUp;