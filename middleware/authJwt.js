/*
    verify Token, check Position of User in database
*/

const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.cookies["x-access-token"];

    if (!token){
        return res.status(403).send({
            message: "토큰이 없습니다!"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err){
            return res.status(401).send({
                message: "인증 실패!"
            });
        }
        req.userId = decoded.jwt_id;
        console.log(token);
        console.log(decoded);
        next();
    });
};


isAdmin = (req, res, next) => {
    User.findOne({ where: { id: req.userId } }).then(user => { // findByPk(req.userId) 는 primarykey를 studentid로 바꿨기 때문에 사용못함
        console.log("user",user);
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
            for (let i = 0; i< positions.length; i++) {
                if (positions[i].name === "chairman") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "회장이 아닙니다!"
            });
        });
    });
};

isAdminorChairman = (req, res, next) => {
    User.findOne({ where: { id: req.userId } }).then(user => {
        user.getPositions().then(positions => {
            for (let i = 0; i < positions.length; i++) {
                if (positions[i].name === "chairman") {
                    next();
                    return;
                }

                if (positions[i].name === "admin") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "회장 또는 관리자가 아닙니다!"
            });
        });
    });
};

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isChairman: isChairman,
    isAdminorChairman: isAdminorChairman
};

module.exports = authJwt;