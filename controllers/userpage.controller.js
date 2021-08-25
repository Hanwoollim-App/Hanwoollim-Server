const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Board = db.board;
const Reservation = db.reservation;
const controller = require("../controllers/auth.controller");

// exports.root = (req, res) => {
//     res.status(200).send({ message: "This is the main page of 'Hanwoolim-User' application." });
// };

// exports.signin = (req, res) => {
//     res.status(200).send({ message: "유저용 앱 로그인 페이지." });
// };


// 번개모임
exports.get_Lightning_gathering = (req, res) => {
    console.log('--------------- get /user/ligntningGathering ---------------');
    res.status(200).send("User Lightning Gathering.");
};

exports.post_Lightning_gathering = (req, res) => {
    console.log('--------------- post /user/ligntningGathering ---------------');
    res.status(200).send("User Lightning Gathering.");
};


// 예약하기
exports.get_Reservation = (req, res) => {
    console.log('--------------- get /user/reservation ---------------');
    async function codeToReservation(sidArr, sessionJson, code) {

        if (!code) {
            res.status(400).send({ message: '입력값이 없습니다' })
            return;
        }
        var output = {} // function-out-json
        var startTime = code.startTime;
        var endTime = code.endTime;
        var session1 = sessionJson.session1;
        var session2 = sessionJson.session2;
        var passed = false;

        // 갯수 매칭 체크
        //console.log(sidArr.length, Object.keys(startTime).length, Object.keys(session1).length, Object.keys(endTime).length, Object.keys(startTime).length, Object.keys(endTime).length)
        if (sidArr.length !== Object.keys(startTime).length || Object.keys(session1).length !== Object.keys(endTime).length || Object.keys(startTime).length !== Object.keys(endTime).length) {
            return res.status(400).send({ message: '이름,예약시작시간,예약종료시간,세션 갯수 매칭안됨!' })
        }

        // Check Format
        passed = controller.checkFormat(startTime, endTime);
        if (passed) {
            for (let i = 0; i < Object.keys(startTime).length; i++) {
                await User.findOne({ where: { studentId: sidArr[i] } }).then(user => {
                    userName = user.userName;
                }).catch(err => {
                    res.status(500).send({ message: err.message });
                });

                output = { "studentId": sidArr[i], "userName": userName, "startTime": startTime[i], "endTime": endTime[i], "session1": session1[i], "session2": session2[i] }
            }
        }
        return output;
    }

    Reservation.findAll({
        where: {
            startDate: Date.parse(req.query.startDate)
        }
    }).then(async reservation => {
        var outputArr = [] // json array
        var output = {}
        if (reservation) {
            for (let i = 0; i < reservation.length; i++) {
                if (reservation[i].dataValues.reservationType === "Personal") {
                    curr_res = reservation[i].dataValues
                    console.log(curr_res)
                    output.startDate = controller.dateFormat(curr_res.startDate)
                    output.reservationType = curr_res.reservationType
                    for (let w in curr_res) {
                        if (curr_res[w] !== null && w !== "createdAt" && w != "updatedAt" && w !== "id" && w !== "startDate" && w !== "reservationType" && w !== "sidArr" && w !== "sidArr" && w !== "session") { // 요일 (MON~SUN) 만 포함한다.
                            output[w] = []
                            output[w].push(await codeToReservation(curr_res.sidArr[w], curr_res.session[w], curr_res[w]));
                        }
                    }
                    outputArr.push(JSON.parse(JSON.stringify(output))) // reference가 copy되기 때문에 newcopy를 만들어준것

                }
            }
        }
        res.status(200).send(outputArr);
    }).catch(err => {
        res.status(500).send({ message: err.message, error: err.stack });
    });

    console.log('req.query: ' + req.query.startDate)


};

exports.post_Reservation = (req, res) => { // 관리자용 앱과 완전히 동일
    console.log('--------------- post /user/reservation ---------------');
    const controller = require("./auth.controller");
    var jwt = require("jsonwebtoken");
    const config = require("../config/auth.config");

    async function ReservationToDb(new_reservation) { // json from client
        let token = req.headers["x-access-token"];
        var studentId;
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "토큰 오류!"
                });

            }
            userId = decoded.jwt_id;
        });

        await User.findOne({ where: { id: userId } }).then(user => {
            studentId = user.studentId;
        }).catch(err => {
            res.status(500).send({ message: err.message });
            return;
        });




        Reservation.findOne({ // 추가할 내용이 기존에 있는 startDate, reservationType인지 확인
            where: {
                startDate: Date.parse(new_reservation.startDate),
                reservationType: new_reservation.reservationType
            }
        }).then(async reservation => {
            var output = { 'sidArr': {}, 'session': {} }
            var new_startDate = new_reservation.startDate;
            var new_reservationType = new_reservation.reservationType;


            if (reservation == null) { // 해당하는 날짜와 reservationType이 없을 경우 (왜 인지 모르겠지만 !reservation 대신 reservation==0이 먹힌다)--> 그 전에는 findAll을 사용했기 때문
                var passedArr = []

                for (let w in new_reservation) {
                    if (w !== "startDate" && w !== "reservationType") {
                        passedArr = controller.checkFormat([new_reservation[w].startTime], [new_reservation[w].endTime]);;
                        if (passedArr[0] === false) {
                            return res.status(400).send(passedArr[1])
                        }
                        output[w] = { 'startTime': [], 'endTime': [] }
                        output.sidArr[w] = [studentId]
                        output[w].startTime = []
                        output[w].endTime = []
                        output[w].startTime.push(new_reservation[w].startTime)
                        output[w].endTime.push(new_reservation[w].endTime)
                        output.session[w] = { 'session1': [], 'session2': [] }
                        output.session[w].session1.push(new_reservation[w].session1)
                        output.session[w].session2.push(new_reservation[w].session2)
                    }
                }



                if (passedArr[0] === true) {
                    await Reservation.create({
                        startDate: new_startDate,
                        reservationType: new_reservationType,
                        sidArr: output.sidArr,
                        session: output.session,
                        MON: output.MON,
                        TUE: output.TUE,
                        WEN: output.WEN,
                        THUR: output.THUR,
                        FRI: output.FRI,
                        SAT: output.SAT,
                        SUN: output.SUN
                    })
                }
                res.status(200).send({ message: "예약완료!" })
                return;
            }

            // 기존 예약이 있을 경우
            var passed = false;
            current_res = reservation.dataValues // Sequelize를 통해 받아온 구조 분석 후 사용한 것.
            for (let w in current_res) { // Week의 예약 내용 불러오기
                if (new_reservation[w] !== undefined && w !== "id" && w !== "startDate" && w !== "reservationType" && w !== "sidArr" && w !== "sidArr" && w !== "session") { // 요일 (MON~SUN) 만 포함한다.
                    var new_stime = new_reservation[w].startTime; // int
                    var new_etime = new_reservation[w].endTime; // int
                    var new_session1 = new_reservation[w].session1; // string
                    var new_session2 = new_reservation[w].session2; // string

                    if (current_res[w]) {
                        var stimearr = current_res[w].startTime; // json
                        var etimearr = current_res[w].endTime; // json
                        var session1 = current_res.session[w].session1; // json
                        var session2 = current_res.session[w].session2; // json
                        var stdid = current_res.sidArr[w];
                    }


                    if (Object.keys(new_reservation[w]).length) { // reservation이 존재하는 요일의 reservation json을 불러옴

                        if (reservation != 0 && Object.keys(current_res[w]).length) { // 해당요일(w)에 기존 예약이 하나라도 있을 경우

                            if (stimearr.length !== session1.length || etimearr.length !== session2.length) {
                                res.status(400).send("예약시간과 session 갯수가 매칭되지 않습니다.")
                                return false
                            }

                            if (new_etime < stimearr[0]) { // 맨 앞자리에 삽입가능한 경우
                                stimearr.splice(0, 0, new_stime);
                                etimearr.splice(0, 0, new_etime);
                                session1.splice(0, 0, new_session1);
                                session2.splice(0, 0, new_session2);
                                passed = true;
                            }

                            if (new_stime >= etimearr[etimearr.length - 1]) { // 맨 뒷자리에 삽입가능한 경우
                                stimearr.splice(stimearr.length, 0, new_stime);
                                etimearr.splice(etimearr.length, 0, new_etime);
                                session1.splice(session1.length, 0, new_session1);
                                session2.splice(session2.length, 0, new_session2);
                                passed = true;
                            }
                            if (!passed) {
                                for (let i = 0; i < etimearr.length; i++) { // 중간에 삽입하는 경우
                                    if (new_stime >= etimearr[i]) {
                                        if (new_etime <= stimearr[i + 1]) {
                                            await stimearr.splice(i + 1, 0, new_stime);
                                            await etimearr.splice(i + 1, 0, new_etime);
                                            await session1.splice(i + 1, 0, new_session1);
                                            await session2.splice(i + 1, 0, new_session2);
                                            passed = true;
                                        }
                                        continue;
                                    }
                                }
                            }
                            if (!passed) {
                                res.status(400).send("예약하려는 시간에 이미 예약이 있습니다.")
                                return
                            }

                            passed = controller.checkFormat(stimearr, etimearr);;
                            // 변경 후 포멧확인으로 2차 점검
                            if (passed) {
                                output.sidArr[w] = stdid
                                output.sidArr[w].push(studentId)
                                output[w] = { 'startTime': [], 'endTime': [] }
                                console.log(w, output[w].startTime)
                                output[w].startTime = stimearr
                                output[w].endTime = etimearr
                                output.session[w] = { 'session1': [], 'session2': [] }
                                output.session[w].session1 = session1
                                output.session[w].session2 = session2
                            }

                        } else { // 해당reservation date, type의 요일에 예약정보추가
                            output.sidArr[w] = stdid
                            output.sidArr[w].push(studentId)
                            output[w] = { 'startTime': [], 'endTime': [] }
                            output[w].startTime = []
                            output[w].endTime = []
                            output[w].startTime.push(new_reservation[w].startTime)
                            output[w].endTime.push(new_reservation[w].endTime)
                            output.session[w] = { 'session1': [], 'session2': [] }
                            output.session[w].session1.push(new_reservation[w].session1)
                            output.session[w].session2.push(new_reservation[w].session2)
                        }

                    }
                }
            } // end of for-loop

            await Reservation.update(
                {
                    startDate: new_startDate,
                    reservationType: new_reservationType,
                    sidArr: output.sidArr,
                    session: output.session,
                    MON: output.MON,
                    TUE: output.TUE,
                    WEN: output.WEN,
                    THUR: output.THUR,
                    FRI: output.FRI,
                    SAT: output.SAT,
                    SUN: output.SUN,

                }, {
                where: {
                    startDate: Date.parse(new_startDate),
                    reservationType: new_reservationType
                }
            })

            if (passed || passedArr[0]) res.status(200).send({ message: "예약성공!" });


        }).catch(err => {
            res.status(500).send({ message: err.message, line: err.stack });
            return;
        });

    }

    var reservation = {
        "startDate": req.body.startDate,
        "reservationType": req.body.reservationType
    }
    if (req.body.MON) reservation.MON = req.body.MON
    if (req.body.TUE) reservation.TUE = req.body.TUE
    if (req.body.WEN) reservation.WEN = req.body.WEN
    if (req.body.THUR) reservation.THUR = req.body.THUR
    if (req.body.FRI) reservation.FRI = req.body.FRI
    if (req.body.SAT) reservation.SAT = req.body.SAT
    if (req.body.SUN) reservation.SUN = req.body.SUN

    ReservationToDb(reservation)
};


// 자료게시판
exports.get_Board = (req, res) => {
    console.log('--------------- get /user/board ---------------');
    let output = []; // Json array
    const now = Date.now();
    const fs = require('fs');
    const path = require('path');
    const fileName = req.query.fileName
    var fileDownload = false;
    
    Board.findAll().then(boards => { // 미리보기(제목+만료일)
        for (let j = 0; j < boards.length; j++) {
            var expireDate = new Date(boards[j].expireDate).getTime()

            if (now < expireDate) { // expireDate이 현재시간보다  클 경우에만 가져온다
                if (boards[j].fileUpload && fileName == `${boards[j].id}_${boards[j].title}`){
                    var filePath = path.join(`/Users/jaeman/board_uploaded_file/`, `${boards[j].writer}_${boards[j].title}`)
                    var readStream = fs.createReadStream(filePath);
                    // We replaced all the event handlers with a simple call to readStream.pipe()
                    readStream.pipe(res);
                    fileDownload = true;
                }else{
                    output.push({ 'id': boards[j].id, 'title': boards[j].title, 'expireDate': boards[j].expireDate, 'body': boards[j].body });
                }
            }
        }
        if(!fileDownload){
            res.status(200).send(output);
        }

    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

exports.post_Board = async (req, res) => {
    console.log('--------------- post /user/board ---------------');
    var http = require('http');
    var formidable = require('formidable');
    var fs = require('fs');
    let token = req.headers["x-access-token"];
    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "토큰 오류!"
            });
        }
        userId = decoded.jwt_id;
    });
    

    var form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        await Board.create({
            title: fields.title,
            writer: userId,
            expireDate: fields.expireDate,
            fileUpload: fields.fileUpload,
            body: fields.body
        }).then(()=>{
                if(fields.fileUpload == true){
                    var oldpath = files.file.path;
                    var newpath = `/Users/jaeman/board_uploaded_file/${userId}_${fields.title}`;
                    fs.rename(oldpath, newpath, (err) => {
                        if (err) throw err;
                        res.status(200).send('게시글 등록 성공!, File uploaded to board_uploaded_file!');
                    })
                }else{
                    res.status(200).send({ message: "게시글 등록 성공!" });
                }
            
        }).catch(err => {
            res.status(500).send({ message: err.message });
        });
    });
};


// 개인정보 설정
exports.get_Info = async (req, res) => {
    console.log('--------------- get /user/info ---------------');
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
        output = { 'userName': user.userName, 'major': user.major, 'studentId': user.studentId };

        res.status(200).send(output);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });


};

exports.post_Info = async (req, res) => {
    console.log('--------------- post /user/info ---------------');
    let token = req.headers["x-access-token"];

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
            res.status(200).send({ message: "성공적으로 탈퇴 처리되었습니다!" });
            /// !!! /user 로 redirect 구현
        });
    }
};


// 개인정보 수정
// exports.get_Edit_info = (req, res) => {
//     res.status(200).send("User Edit Info.");
// };

exports.patch_Edit_info = async (req, res) => {
    console.log('--------------- patch /user/editInfo ---------------');
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

    await User.findOne({ where: { id: userId } }).then(async user => {

        if (req.body.studentId) {

            // check if student is duplicated
            User.findOne({
                where: {
                    studentId: req.body.studentId
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

            await User.update({ studentId: req.body.studentId }, { where: { id: userId } });
            passed = true;
            if (req.body.userName) {
                await User.update({ userName: req.body.userName }, { where: { id: userId } });
                passed = true;
            }
            if (req.body.major) {

                await User.update({ major: req.body.major }, { where: { id: userId } });
                passed = true;
            }
        }



        if (req.body.studentId === 0 || req.body.major === '' || req.body.userName === '' || !req.body) {
            res.status(404).send({ message: "Has no request!" });
        } else if (passed) {
            res.status(200).send({ message: "개인정보 수정 성공!" });
        } else {
            res.status(400).send({ message: "bad type of request" });
        }
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

