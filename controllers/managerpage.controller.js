const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Announcement = db.announcement;
const Reservation = db.reservation;
const controller = require("../controllers/auth.controller");
// exports.root = (req, res) => {
//     res.status(200).send({ message: "This is the main page of 'Hanwoolim-Manager' application." });
// };

// exports.signin = (req, res) => {
//     res.status(200).send({ message: "관리자 앱 로그인 페이지." });
// };


// 회원 목록 및 회원정보 수정
exports.get_Manage_list = (req, res) => {
    console.log('--------------- get /manager/manageList ---------------');
    let output = []; // Json array

    User.findAll().then(async users => {
        //var output = [];
        for (let j = 0; j < users.length; j++) {
            await users[j].getPositions().then(async position => {
                if(position[0].name !== 'chairman' && position[0].name !== 'not_approved')
                    output.push({ 'userName': users[j].userName, 'major': users[j].major, 'studentId': users[j].studentId, 'position': position[0].name});
            })
        }

        res.status(200).send(output);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

exports.post_Manage_list = (req, res) => {
    console.log('--------------- post /manager/manageList ---------------');
    var execute = req.body.execute;
    if (execute === 0) {
        User.findOne({ where: { studentId: req.body.chairmanstudentId } }).then(async player => {
            await player.getPositions().then(async position => {
                if (position[0].name === "chairman") {
                    await player.setPositions([2]).then(async () => {
                        User.findOne({ where: { studentId: req.body.studentId } }).then( async user => {
                            await user.setPositions([0]).then(async () => {    
                                res.status(200).send({ message: "회장직위 위임 성공!" });
                                /// !!!! /manager/admin_home 으로 redirect
                            })
                
                        });
                    });
                } else{
                    res.status(400).send({ message: "입력하신 학번은 회장이 아닙니다!" });
                }
            });
        });
    }
    if (execute === 1) {
        User.findOne({ where: { studentId: req.body.studentId } }).then(user => {
            user.setPositions([1]).then(() => {
                res.status(200).send({ message: "집행기로 지정 성공!" });
            });

        });
    }
    if (execute === 2) {
        User.destroy({ where: { studentId: req.body.studentId } }).then(() => {
            res.status(200).send({ message: "성공적으로 탈퇴 처리되었습니다!" });
        });
    }

    if (!execute) {
        res.status(404).send({ message: "오류!" });
    }

};


// 고정합주 예약 
exports.get_Reservation = (req, res) => {
    console.log('--------------- get /manager/reservation ---------------');
    async function codeToReservation_user(sidArr, sessionJson, code) {
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

        if (!code) {
            res.status(400).send({ message: '입력값이 없습니다' })
            return;
        }
        var output = {} // function-out-json
        var startTime = code.startTime;
        var endTime = code.endTime;
        var session1 = sessionJson.session1;
        var session2 = sessionJson.session2;
        var isMine = false;
        var passedArr = [false];

        // 갯수 매칭 체크
        //console.log(sidArr.length, Object.keys(startTime).length, Object.keys(session1).length, Object.keys(endTime).length, Object.keys(startTime).length, Object.keys(endTime).length)
        if (sidArr.length !== Object.keys(startTime).length || Object.keys(session1).length !== Object.keys(endTime).length || Object.keys(startTime).length !== Object.keys(endTime).length) {
            return res.status(400).send({ message: '이름,예약시작시간,예약종료시간,세션 갯수 매칭안됨!' })
        }

        // Check Format
        passedArr = controller.checkFormat(startTime, endTime);
        if (passedArr[0]===true) {
            for (let i = 0; i < Object.keys(startTime).length; i++) {
                await User.findOne({ where: { studentId: sidArr[i] } }).then(user => {
                    userName = user.userName;
                }).catch(err => {
                    res.status(500).send({ message: err.message });
                });
                if (studentId===sidArr[i]) isMine=true;
                else isMine=false;

                output = { "isMine": isMine, "name": userName, "startTime": startTime[i], "endTime": endTime[i], "session1": session1[i], "session2": session2[i] }
            }
        } else if (passedArr[0]===false){
            res.status(400).send(passedArr[1])
        }
        return output;
    }
    
    async function codeToReservation_manager(nameArr, sessionJson, code) {

        if (!code) {
            res.status(400).send({ message: '입력값이 없습니다' })
            return;
        }
        var output = {} // function-out-json
        var startTime = code.startTime;
        var endTime = code.endTime;
        var session1 = sessionJson.session1;
        var session2 = sessionJson.session2;
        var passedArr = [false];

        // 갯수 매칭 체크
        //console.log(sidArr.length, Object.keys(startTime).length, Object.keys(session1).length, Object.keys(endTime).length, Object.keys(startTime).length, Object.keys(endTime).length)
        if (nameArr.length !== Object.keys(startTime).length || Object.keys(session1).length !== Object.keys(endTime).length || Object.keys(startTime).length !== Object.keys(endTime).length) {
            return res.status(400).send({ message: '이름,예약시작시간,예약종료시간,세션 갯수 매칭안됨!' })
        }

        // Check Format
        passedArr = controller.checkFormat(startTime, endTime);
        if (passedArr[0]===true) {
            for (let i = 0; i < Object.keys(startTime).length; i++) {
                output = { "name": nameArr[i], "startTime": startTime[i], "endTime": endTime[i], "session1": session1[i], "session2": session2[i] } 
            }
        } else if (passedArr[0]===false){
            res.status(400).send(passedArr[1])
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
        if (reservation){
            for (let i = 0; i < reservation.length; i++) {
                if (reservation[i].dataValues.reservationType === "Personal"){
                    curr_res = reservation[i].dataValues
                console.log(curr_res)
                output.startDate = controller.dateFormat(curr_res.startDate)
                output.reservationType = curr_res.reservationType
                for (let w in curr_res) {
                    if (curr_res[w] !== null && w !== "createdAt" && w != "updatedAt" && w !== "id" && w !== "startDate" && w !== "reservationType" && w !== "sidArr" && w !== "sidArr" && w !== "session") { // 요일 (MON~SUN) 만 포함한다.
                        output[w] = []
                        output[w].push(await codeToReservation_user(curr_res.sidArr[w], curr_res.session[w], curr_res[w]));
                    }
                }
                outputArr.push(JSON.parse(JSON.stringify(output))) // reference가 copy되기 때문에 newcopy를 만들어준것
                } else{
                    curr_res = reservation[i].dataValues
                    console.log(curr_res)
                    output.startDate = controller.dateFormat(curr_res.startDate)
                    output.reservationType = curr_res.reservationType
                    for (let w in curr_res) {
                        if (curr_res[w] !== null && w !== "createdAt" && w != "updatedAt" && w !== "id" && w !== "startDate" && w !== "reservationType" && w !== "nameArr" && w !== "session") { // 요일 (MON~SUN) 만 포함한다.
                            output[w] = []
                            output[w].push(await codeToReservation_manager(curr_res.nameArr[w], curr_res.session[w], curr_res[w]));
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

    console.log('req.query: '+req.query.startDate)
};

exports.post_Reservation = (req, res) => {
    console.log('--------------- post /manager/reservation ---------------');
    const controller = require("./auth.controller");
    var jwt = require("jsonwebtoken");
    const config = require("../config/auth.config");

    async function reservationToDb(new_reservation) { // json from client
        let token = req.headers["x-access-token"];
        // var studentId;
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "토큰 오류!"
                });

            }
            userId = decoded.jwt_id;
        });

        // await User.findOne({ where: { id: userId } }).then(user => {
        //     studentId = user.studentId;
        // }).catch(err => {
        //     res.status(500).send({ message: err.message });
        //     return;
        // });




        Reservation.findOne({ // 추가할 내용이 기존에 있는 startDate, reservationType인지 확인
            where: {
                startDate: Date.parse(new_reservation.startDate),
                reservationType: new_reservation.reservationType
            }
        }).then(async reservation => {
            var output = { 'nameArr': {}, 'session':{}}
            var new_startDate = new_reservation.startDate;
            var new_reservationType = new_reservation.reservationType;
            

            if (reservation==null) { // 해당하는 날짜와 reservationType이 없을 경우   (왜 인지 모르겠지만 !reservation 대신 reservation==0이 먹힌다)--> 그 전에는 findAll을 사용했기 때문
                var passedArr = []

                for (let w in new_reservation){
                    if (w !== "startDate" && w !== "reservationType" && w!== "userName") {
                        console.log(new_reservation, w)
                        passedArr = controller.checkFormat([new_reservation[w].startTime], [new_reservation[w].endTime]);
                        if (passedArr[0]===false) {
                            return res.status(400).send(passedArr[1])
                        }  
                        output[w] = { 'startTime': [], 'endTime': []}
                        output.nameArr[w] = [new_reservation.userName]
                        output[w].startTime = []
                        output[w].endTime = []
                        output[w].startTime.push(new_reservation[w].startTime)
                        output[w].endTime.push(new_reservation[w].endTime)
                        output.session[w]= {'session1':[],'session2':[]}
                        output.session[w].session1.push(new_reservation[w].session1)
                        output.session[w].session2.push(new_reservation[w].session2)
                    }
                }
                
                

                if (passedArr[0]===true) {
                    await Reservation.create({
                        startDate: new_startDate,
                        reservationType: new_reservationType,
                        nameArr: output.nameArr,
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
                res.status(200).send({ message: "예약완료!"})
                return;
            }

            // 기존 예약이 있을 경우
            var passedArr = [false];
            current_res = reservation.dataValues // Sequelize를 통해 받아온 구조 분석 후 사용한 것.
            for (let w in current_res) { // Week의 예약 내용 불러오기
                if (new_reservation[w] !== undefined && w !== "id" && w !== "startDate" && w !== "reservationType" && w !== "nameArr" && w !== "session") { // 요일 (MON~SUN) 만 포함한다.
                    var new_stime = new_reservation[w].startTime; // int
                    var new_etime = new_reservation[w].endTime; // int
                    var new_session1 = new_reservation[w].session1; // string
                    var new_session2 = new_reservation[w].session2; // string

                    if (current_res[w]){
                        var stimeArr = current_res[w].startTime; // json
                        var etimeArr = current_res[w].endTime; // json
                        var session1 = current_res.session[w].session1; // json
                        var session2 = current_res.session[w].session2; // json
                        var name = current_res.nameArr[w];
                    }
                
                    
                    if (Object.keys(new_reservation[w]).length) { // reservation이 존재하는 요일의 reservation json을 불러옴

                        if (reservation!=0 && Object.keys(current_res[w]).length) { // 해당요일(w)에 기존 예약이 하나라도 있을 경우

                            if (stimeArr.length !== session1.length || etimeArr.length !== session2.length) {
                                res.status(400).send("예약시간과 session 갯수가 매칭되지 않습니다.")
                                return false
                            }
                            
                            if (new_etime < stimeArr[0]) { // 맨 앞자리에 삽입가능한 경우
                                stimeArr.splice(0, 0, new_stime);
                                etimeArr.splice(0, 0, new_etime);
                                session1.splice(0, 0, new_session1);
                                session2.splice(0, 0, new_session2);
                                passedArr[0] = true;
                            }

                            if (new_stime >= etimeArr[etimeArr.length-1]) { // 맨 뒷자리에 삽입가능한 경우
                                stimeArr.splice(stimeArr.length, 0, new_stime);
                                etimeArr.splice(etimeArr.length, 0, new_etime);
                                session1.splice(session1.length, 0, new_session1);
                                session2.splice(session2.length, 0, new_session2);
                                passedArr[0] = true;
                            }
                            if (passedArr[0]===false) {
                                for (let i = 0; i < etimeArr.length; i++) { // 중간에 삽입하는 경우
                                    if (new_stime >= etimeArr[i]) {
                                        if (new_etime <= stimeArr[i + 1]) {
                                            await stimeArr.splice(i + 1, 0, new_stime);
                                            await etimeArr.splice(i + 1, 0, new_etime);
                                            await session1.splice(i + 1, 0, new_session1);
                                            await session2.splice(i + 1, 0, new_session2);
                                            passedArr[0] = true;
                                        }
                                        continue;
                                    }
                                }
                            }
                            if (passedArr[0]===false) {
                                res.status(400).send("예약하려는 시간에 이미 예약이 있습니다.")
                                return
                            }

                            passedArr = controller.checkFormat(stimeArr, etimeArr);;
                            // 변경 후 포멧확인으로 2차 점검
                            if (passedArr[0]===true){                            
                                output.nameArr[w] = name
                                output.nameArr[w].push(new_reservation.userName)
                                output[w] = { 'startTime': [], 'endTime': []}
                                console.log(w,output[w].startTime )
                                output[w].startTime = stimeArr
                                output[w].endTime = etimeArr
                                output.session[w]= {'session1':[],'session2':[]}
                                output.session[w].session1 = session1
                                output.session[w].session2 = session2
                            }else if (passedArr[0]===false){
                                res.status(400).send(passedArr[1])
                            }

                        } else { // 해당reservation date, type의 요일에 예약정보추가
                            output.nameArr[w] = name
                            output.nameArr[w].push(new_reservation.userName)
                            output[w] = { 'startTime': [], 'endTime': []}
                            output[w].startTime = []
                            output[w].endTime = []
                            output[w].startTime.push(new_reservation[w].startTime)
                            output[w].endTime.push(new_reservation[w].endTime)
                            output.session[w]= {'session1':[],'session2':[]}
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
                    nameArr: output.nameArr,
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

            if(passedArr[0]===true) res.status(200).send({ message: "예약성공!"});
    

        }).catch(err => {
            res.status(500).send({ message: err.message, line: err.stack });
            return;
        });

    }

    var reservation = {
        "startDate": req.body.startDate,
        "reservationType": req.body.reservationType,
        "userName": req.body.userName
    }
    if(req.body.MON) reservation.MON = req.body.MON
    if(req.body.TUE) reservation.TUE = req.body.TUE
    if(req.body.WEN) reservation.WEN = req.body.WEN
    if(req.body.THUR) reservation.THUR = req.body.THUR
    if(req.body.FRI) reservation.FRI = req.body.FRI
    if(req.body.SAT) reservation.SAT = req.body.SAT
    if(req.body.SUN) reservation.SUN = req.body.SUN

    reservationToDb(reservation)

};


// 공지사항 등록
exports.get_Announcement = (req, res) => {
    console.log('--------------- get /manager/announcement ---------------');
    let output = []; // Json array

    Announcement.findAll().then(announcements => { // 미리보기 불러오기(제목, 날짜)
        for (let j = 0; j < announcements.length; j++) {
            output.push({ 'id': announcements[j].id, 'title': announcements[j].title, 'date': controller.dateFormat(announcements[j].date), 'writer': announcements[j].writer, 'body': announcements[j].body });
        }
        res.status(200).send(output);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

exports.post_Announcement = async (req, res) => {
    console.log('--------------- post /manager/announcement ---------------');
    if (req.body.delete === 1) {
        Announcement.destroy({ where: { id: req.body.id } }).then(() => {
            res.status(200).send({ message: "삭제했습니다!" });
            /// !!! /user 로 redirect 구현
        });
    }

    if (!req.body.delete) {
        await Announcement.create({
            title: req.body.title,
            date: req.body.date,
            writer: req.body.writer,
            body: req.body.body
        }).then(() => {
            res.status(200).send({ message: "공지사항 등록 성공!" });
        })
            .catch(err => {
                res.status(500).send({ message: err.message });
            });
    }
};



// 신규 가입자 승인
exports.get_Approve_new_member = (req, res) => {
    console.log('--------------- get /manager/approveNewMember ---------------');
    let output = []; // Json array

    User.findAll().then(async users => {
        //var output = [];
        for (let j = 0; j < users.length; j++) {
            await users[j].getPositions().then(positions => {
                for (let i = 0; i < positions.length; i++) {
                    if (positions[i].name === "not_approved") {
                        output.push({ 'userName': users[j].userName, 'major': users[j].major, 'studentId': users[j].studentId });
                    }
                }
            });

        }

        res.status(200).send(output);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });


};

exports.post_Approve_new_member = (req, res) => {
    console.log('--------------- post /manager/approveNewMember ---------------')
    User.findOne({ where: { studentId: req.body.studentId } }).then(user => {
        user.setPositions([2]).then(() => {
            res.status(200).send({ message: "회원 승인 성공!" });
        })

    });
};
