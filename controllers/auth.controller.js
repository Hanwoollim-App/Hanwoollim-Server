/*
    handle signup & signin actions
*/

const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// 회원가입

exports.signup = (req, res) => {
    // Save User to Database
    User.create({
        id: req.body.id,
        password: bcrypt.hashSync(req.body.password, 8),
        studentid: req.body.studentid
    })
        .then(user => {
            // set default user position to 'not approved'
            user.setPositions([3]).then(() => {
                res.send({ message: "회원가입 성공!"});
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};


// 로그인

exports.signin = (req, res) => {
    User.findOne({
        where: {
            id: req.body.id
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found."});
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            var token = jwt.sign({ jwt_id: user.jwt_id}, config.secret, {
                expiresIn: 2592000 // 3600x24x30 만료기간 30일
            });

            var authorities = [];
            user.getPositions().then(positions => {
                for (let i = 0; i < positions.length; i++) {
                    authorities.push("POSITION_" + positions[i].name.toUpperCase());
                }
                res.status(200).send({
                    jwt_id: user.jwt_id,
                    id: user.id,
                    studentid: user.studentid,
                    position: authorities,
                    accessToken: token
                });
            });
        })

        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

