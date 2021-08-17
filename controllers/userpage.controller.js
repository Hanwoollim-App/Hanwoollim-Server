const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Board = db.board;

exports.root = (req, res) => {
    res.status(200).send({ message: "This is the main page of 'Hanwoolim-User' application." });
};

exports.signin = (req, res) => {
    res.status(200).send({ message: "유저용 앱 로그인 페이지." });
};

exports.not_approved = (req, res) => {
    res.status(200).send({ message: "아직 승인되지 않은 계정입니다." });
};


// 번개모임
exports.get_Lightning_gathering = (req, res) => {
    res.status(200).send("User Lightning Gathering.");
};

exports.post_Lightning_gathering = (req, res) => {
    res.status(200).send("User Lightning Gathering.");
};


// 예약하기
exports.get_Reservation = (req, res) => {
    res.status(200).send("User Reservation.");
};

exports.post_Reservation = (req, res) => {
    res.status(200).send("User Reservation.");
};


// 자료게시판
exports.get_Board = (req, res) => {
    let output = []; // Json array
    const now = Date.now();
    Board.findAll().then(boards => { // 미리보기(제목+만료일)
        for (let j = 0; j < boards.length; j++) {
            var expireDate = new Date(boards[j].expiredate).getTime()

            if (now < expireDate){ // expiredate이 현재시간보다  클 경우에만 가져온다
                output.push( {'id': boards[j].id, 'title': boards[j].title, 'expiredate': boards[j].expiredate, 'fileurl': boards[j].fileurl, 'body':boards[j].body} );
            }
        }
        res.status(200).send(output);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

exports.post_Board = async(req, res) => {

    await Board.create({
        title: req.body.title,
        expiredate: req.body.expiredate,
        fileurl: req.body.fileurl,
        body: req.body.body
}).catch(err => {
    res.status(500).send({ message: err.message });
});
res.status(200).send({ message: "게시글 등록 성공!" });
};


// 개인정보 설정
exports.get_Info = async (req, res) => {
    let token = req.headers["x-access-token"];
    var output = {};
    await jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "토큰 오류!"
            });
        }
        userId = decoded.jwt_id;
    });

    await User.findOne({ where: { id: userId } }).then(user => {
        output = { 'username': user.username, 'major': user.major, 'studentid': user.studentid };

        res.status(200).send(output);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });


};

exports.post_Info = async (req, res) => {
    let token = req.headers["x-access-token"];
    if (req.body.execute === 0) {
        res.redirect('/user/edit_info');
        return;
    }
    if (req.body.execute === 1) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "토큰 오류!"
                });
            }
            userId = decoded.jwt_id;
        });

        User.destroy({ where: { id: userId } }).then(() => {
            res.status(200).send({ message: "성공적으로 탈퇴 처리되었습니다!"});
            /// !!! /user 로 redirect 구현
        });
    }
};


// 개인정보 수정
exports.get_Edit_info = (req, res) => {
    res.status(200).send("User Edit Info.");
};

exports.post_Edit_info = async (req, res) => {
    let token = req.headers["x-access-token"];
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "토큰 오류!"
            });
        }
        userId = decoded.jwt_id;
    });
    let passed = false;

    await User.findOne({ where: { id: userId } }).then( async user => {

        if (req.body.studentid) {
            
            // check if student is duplicated
            User.findOne({
                where: {
                    studentid: req.body.studentid
                }
            }).then(user => {
                if (user) {
                    res.status(400).send({
                        message: "Failed! Student Id is already in use!"
                    });
                    passed = false;
                    return;
                }
            });

            await User.update({ studentid: req.body.studentid }, { where: { id: userId } });
            passed = true;
            if (req.body.username) {
                await User.update({ username: req.body.username }, { where: { id: userId } });
                passed = true;
            }
            if (req.body.major) {
                
                await User.update({ major: req.body.major }, { where: { id: userId } });
                passed = true;
            }
        }

        
        
        if (!req.body) {
            res.status(404).send({ message: "Has no request!" });
        } else if (passed) {
            res.status(200).send({ message: "개인정보 수정 성공!"});
        } else {
            res.status(400).send({ message: "bad type of request"});
        }
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

