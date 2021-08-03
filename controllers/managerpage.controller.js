const db = require("../models");
const User = db.user;

exports.manage_list = (req, res) => {
    res.status(200).send("manager Manage_list.");
};

exports.reservation = (req, res) => {
    res.status(200).send("manager Reservation.");
};

exports.anouncement = (req, res) => {
    var outpot = `
    
    `
    res.status(200).send("manager Anouncement." + output);
};

exports.approve_new_member = (req, res) => {
    var output = `
    
    `;

    User.findAll().then( user => {
        user.getPositions().then(positions => {
        for (let i = 0; i < positions.length; i++) {
            if (positions[i].name === "not_approved"){
                output+=(positions[i].name);
            }
        }
        });
        res.status(200).send("manager Approve_new_member." + output);

    }).catch(err => {
        res.status(500).send({ message: err.message });
    });

    
};
