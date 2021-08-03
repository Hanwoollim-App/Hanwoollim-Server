const db = require("../models");
const User = db.user;

exports.root = (req, res) => {
    res.status(200).send({ message: "This is the main page of 'Hanwoolim-Manager' application."});
};

exports.signin = (req, res) => {
    res.status(200).send({ message: "관리자 앱 로그인 페이지."});
};

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
