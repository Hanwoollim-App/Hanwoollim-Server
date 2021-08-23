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
    if (req.body.id==='') req.body.id=null
    if (req.body.password==='') req.body.password=null
    if (req.body.username==='') req.body.username=null
    if (req.body.major==='') req.body.major=null
    if (req.body.studentid===0) req.body.studentid=null
    if (!req.body.id) return res.status(500).send({ message: "아이디 입력하세요" });
    if (!req.body.password) return res.status(500).send({ message: "비밀번호를 입력하세요" });
    if (!req.body.username) return res.status(500).send({ message: "이름을 입력하세요" });
    if (!req.body.major) return res.status(500).send({ message: "전공을 입력하세요" });
    if (!req.body.studentid) return res.status(500).send({ message: "학번를 입력하세요" });
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
                res.status(200).send({"accessToken": token, "position": authorities})
                // if (authorities!=="not_approved"){
                //     res.writeHead(301, {Location: '/user/home', 'x-access-token': token}).end();
                // }else{
                //     res.writeHead(301, {Location: '/user/not_approved', 'x-access-token': token}).end();
                // }
                    
            });
            console.log('--------------- user app tried sign in ---------------');
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
                res.status(200).send({"accessToken": token, "position": authorities})
                // if (authorities === 'chairman'){
                //     res.send(200);
                //     res.redirect('/manager/chairman_home');
                // } else if (authorities === 'admin'){
                //     res.send(200);
                //     res.redirect('/manager/admin_home');
                // } else{
                //     res.send(200);
                //     res.redirect('/manager/reservation');
                // }
            });
            console.log('--------------- manager app tried sign in ---------------');
        })

        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.CheckFormat = (stime, etime) => { // array
    for (let i = 0; i < stime.length; i++) {
        if (stime[i] > etime[i]) {
            return [false, { message: '잘못된 포멧입니다. starttime이 endtime 보다 큽니다' }];
        }
        if (stime[i] == etime[i]) {
            return [false, { message: '잘못된 포멧입니다. starttime와 endtime가 같습니다' }];
        }
        if ((etime[i] - stime[i]) > 1) {
            return [false, { message: '잘못된 포멧입니다. 최대 예약시간은 1시간 입니다.' }];
        }
        if (stime[i + 1]) {
            if (etime[i] > stime[i + 1]) {
                return [false, { message: '잘못된 포멧입니다. endtime이 다음 starttime 보다 큽니다' }];
            }
        }
        if (stime > 24 || etime[i] > 24) {
            return [false, { message: '잘못된 포멧입니다. 시간이 24보다 큽니다' }];
        }
    }
    return [true];
}

exports.Dateformat = (date) => {
    var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        
        return [year, month, day].join('-')
}