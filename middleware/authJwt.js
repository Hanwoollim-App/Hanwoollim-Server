/*
    verify Token, check Position of User in database
*/

const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token){
        return res.status(403).send({
            message: "토큰이 없습니다!"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err){
            return res.status(401).send({
                message: "인증시 오류 발생 또는 토큰이 만료되었습니다"
            });
        }
        req.userId = decoded.jwt_id;
        next();
    });
};


isAdmin = (req, res, next) => {
    User.findOne({ where: { id: req.userId } }).then(user => { // findByPk(req.userId) 는 primarykey를 studentid로 바꿨기 때문에 사용못함
        user.getPositions().then(positions => {
            for (let i = 0; i< positions.length; i++) {
                if (positions[i].name === "admin") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "관리자가 아닙니다!"
            });
            return;
        });
    });
};

isChairman = (req, res, next) => {
    User.findOne({ where: { id: req.userId } }).then(user => {
        user.getPositions().then(positions => {
            for (let i = 0; i < positions.length; i++) {
                if (positions[i].name === "chairman") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "회장이 아닙니다!"
            });
            return;
        });
    });
};

isAdminOrChairman = (req, res, next) => {
    User.findOne({ where: { id: req.userId } }).then(user => {
        user.getPositions().then(positions => {
            for (let i = 0; i < positions.length; i++) {
                if (positions[i].name === "chairman" || positions[i].name === "admin") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "회장 또는 관리자가 아닙니다!"
            });
            return;
        });
    });
};

isApproved = (req, res, next) => {
    User.findOne({ where: { id: req.userId } }).then(user => {
        user.getPositions().then(positions => {
            for (let i = 0; i< positions.length; i++) {
                if (positions[i].name === "not_approved") {
                    res.redirect('/user/not_approved');
                    return;
                }
            }

            next(); // next를 하면 이 미들웨어를 넘어가고, 'not_approved로 redirect' + '다음페이지를 불러오기'가 돼서 오류가 뜬다.
            return;
        });
    });
};


const authJwt = {
    verifyToken: verifyToken,
    isApproved: isApproved,
    isAdmin: isAdmin,
    isChairman: isChairman,
    isAdminOrChairman: isAdminOrChairman
};

module.exports = authJwt;