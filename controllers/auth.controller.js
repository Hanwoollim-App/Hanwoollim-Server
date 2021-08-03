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
        username: req.body.username,
        major: req.body.major,
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


// 유저용 앱 로그인

exports.userSignin = (req, res) => {
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

            var token = jwt.sign({ jwt_id: user.id}, config.secret, {
                expiresIn: "30 days" // 3600x24x30 만료기간 30일
            });

            var authorities = '';
            user.getPositions().then(positions => {
                for (let i = 0; i < positions.length; i++) {
                    authorities += positions[i].name;
                }
                // res.status(200).send({
                //     jwt_id: user.jwt_id,
                //     id: user.id,
                //     studentid: user.studentid,
                //     position: authorities,
                //     accessToken: token
                // });
                if (authorities!=="not_approved"){
                    res.status(200);
                    res.redirect('/user/home');
                }else{
                    res.status(200);
                    res.redirect('/user/not_approved');
                }
                    
            });

            let options = {
                path:"/user",
                sameSite:true,
                maxAge: 1000 * 2592000, // would expire after 30 days
                httpOnly: true, // The cookie only accessible by the web server
            }
        
            res.cookie('x-access-token',token, options) 
        })

        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

// 관리자용 앱 로그인

exports.managerSignin = (req, res) => {
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

            var token = jwt.sign({ jwt_id: user.id}, config.secret, {
                expiresIn: "30 days" // 3600x24x30 만료기간 30일
            });

            var authorities = '';
            user.getPositions().then(positions => {
                for (let i = 0; i < positions.length; i++) {
                    authorities += positions[i].name;
                }
                // res.status(200).send({
                //     jwt_id: user.jwt_id,
                //     id: user.id,
                //     studentid: user.studentid,
                //     position: authorities,
                //     accessToken: token
                // });
                if (authorities === 'chairman'){
                    res.status(200);
                    res.redirect('/manager/chairman_home');
                } else{
                    res.status(200);
                    res.redirect('/manager/reservation'); // 유저가 접속할 경우 회장 또는 관리자가 아닙니다 경고를 보내는 페이지
                }
            });

            let options = {
                path:"/manager",
                sameSite:true,
                maxAge: 1000 * 2592000, // would expire after 30 days
                httpOnly: true, // The cookie only accessible by the web server
            }
        
            res.cookie('x-access-token',token, options) 
        })

        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};