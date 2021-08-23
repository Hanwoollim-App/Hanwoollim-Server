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
    console.log('--------------- get /manager/manage_list ---------------');
    let output = []; // Json array

    User.findAll().then(users => {
        //var output = [];
        for (let j = 0; j < users.length; j++) {
            output.push({ 'username': users[j].username, 'major': users[j].major, 'studentid': users[j].studentid });
        }

        res.status(200).send(output);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

exports.post_Manage_list = (req, res) => {
    console.log('--------------- post /manager/manage_list ---------------');
    var execute = req.body.execute;
    if (execute === 0) {
        User.findOne({ where: { studentid: req.body.studentid } }).then(user => {
            user.setPositions([0]).then(() => {
                User.findOne({ where: { studentid: req.body.chairman_studentid } }).then(user => {
                    user.setPositions([2]).then(() => {
                        res.status(200).send({ message: "회장직위 위임 성공!" });
                        /// !!!! /manager/admin_home 으로 redirect
                    });

                });
            })

        });
    }
    if (execute === 1) {
        User.findOne({ where: { studentid: req.body.studentid } }).then(user => {
            user.setPositions([1]).then(() => {
                res.status(200).send({ message: "집행기로 지정 성공!" });
            });

        });
    }
    if (execute === 2) {
        User.destroy({ where: { studentid: req.body.studentid } }).then(() => {
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
    async function CodeToReservation(sidArr, sessionJson, code) {

        if (!code) {
            res.status(400).send({ message: '입력값이 없습니다' })
            return;
        }
        var output = {} // function-out-json
        var starttime = code.starttime;
        var endtime = code.endtime;
        var session1 = sessionJson.session1;
        var session2 = sessionJson.session2;
        var passed = false;

        // 갯수 매칭 체크
        //console.log(sidArr.length, Object.keys(starttime).length, Object.keys(session1).length, Object.keys(endtime).length, Object.keys(starttime).length, Object.keys(endtime).length)
        if (sidArr.length !== Object.keys(starttime).length || Object.keys(session1).length !== Object.keys(endtime).length || Object.keys(starttime).length !== Object.keys(endtime).length) {
            return res.status(400).send({ message: '이름,예약시작시간,예약종료시간,세션 갯수 매칭안됨!' })
        }

        // Check Format
        passed = controller.CheckFormat(starttime, endtime);
        if (passed) {
            for (let i = 0; i < Object.keys(starttime).length; i++) {
                await User.findOne({ where: { studentid: sidArr[i] } }).then(user => {
                    username = user.name;
                }).catch(err => {
                    res.status(500).send({ message: err.message });
                });

                output = { "studentid": sidArr[i], "name": username, "starttime": starttime[i], "endtime": endtime[i], "session1": session1[i], "session2": session2[i] } 
            }
        }
        return output;
    }

    Reservation.findAll({
        where: {
            STARTDATE: Date.parse(req.query.startdate)
        }
    }).then(async reservation => {
        var outputArr = [] // json array
        var output = {}
        if (reservation){
            
            for (let i = 0; i < reservation.length; i++) {
                if (reservation[i].dataValues.ReservationType==="Together" || reservation[i].dataValues.ReservationType==="Mentoring") {
                    curr_res = reservation[i].dataValues
                    //console.log(curr_res)
                    output.STARTDATE = controller.Dateformat(curr_res.STARTDATE)
                    output.ReservationType = curr_res.ReservationType
                    for (let w in curr_res) {
                        if (curr_res[w] !== null && w!== "createdAt" && w!= "updatedAt" && w !== "id" && w !== "STARTDATE" && w !== "ReservationType" && w !== "sidarr" && w !== "sidarr" && w !== "session") { // 요일 (MON~SUN) 만 포함한다.
                            output[w]=[]
                            output[w].push(await CodeToReservation(curr_res.sidarr[w], curr_res.session[w], curr_res[w]));
                        }
                    }
                    outputArr.push( JSON.parse(JSON.stringify(output)) ) // reference가 copy되기 때문에 newcopy를 만들어준것

                }
            }
        }
        res.status(200).send(outputArr);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });

    console.log('req.query: '+req.query.startdate)
};

exports.post_Reservation = (req, res) => {
    console.log('--------------- post /manager/reservation ---------------');
    const controller = require("./auth.controller");
    var jwt = require("jsonwebtoken");
    const config = require("../config/auth.config");

    async function ReservationToDb(new_reservation) { // json from client
        let token = req.headers["x-access-token"];
        var studentid;
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "토큰 오류!"
                });

            }
            userId = decoded.jwt_id;
        });

        await User.findOne({ where: { id: userId } }).then(user => {
            studentid = user.studentid;
        }).catch(err => {
            res.status(500).send({ message: err.message });
            return;
        });




        Reservation.findOne({ // 추가할 내용이 기존에 있는 startdate, reservationType인지 확인
            where: {
                STARTDATE: Date.parse(new_reservation.STARTDATE),
                ReservationType: new_reservation.ReservationType
            }
        }).then(async reservation => {
            var output = { 'sidarr': {}, 'session':{}}
            var new_startdate = new_reservation.STARTDATE;
            var new_reservationtype = new_reservation.ReservationType;
            

            if (reservation==null) { // 해당하는 날짜와 reservationtype이 없을 경우 (왜 인지 모르겠지만 !reservation 대신 reservation==0이 먹힌다)--> 그 전에는 findAll을 사용했기 때문
                var passedArr = []

                for (let w in new_reservation){
                    if (w !== "STARTDATE" && w !== "ReservationType") {
                        passedArr = controller.CheckFormat([new_reservation[w].starttime], [new_reservation[w].endtime]);;
                        if (passedArr[0]===false) {
                            return res.status(400).send(passedArr[1])
                        }  
                        output[w] = { 'starttime': [], 'endtime': []}
                        output.sidarr[w] = [studentid]
                        output[w].starttime = []
                        output[w].endtime = []
                        output[w].starttime.push(new_reservation[w].starttime)
                        output[w].endtime.push(new_reservation[w].endtime)
                        output.session[w]= {'session1':[],'session2':[]}
                        output.session[w].session1.push(new_reservation[w].session1)
                        output.session[w].session2.push(new_reservation[w].session2)
                    }
                }
                
                

                if (passedArr[0]===true) {
                    await Reservation.create({
                        STARTDATE: new_startdate,
                        ReservationType: new_reservationtype,
                        sidarr: output.sidarr,
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
            var passed = false;
            current_res = reservation.dataValues // Sequelize를 통해 받아온 구조 분석 후 사용한 것.
            for (let w in current_res) { // Week의 예약 내용 불러오기
                if (new_reservation[w] !== undefined && w !== "id" && w !== "STARTDATE" && w !== "ReservationType" && w !== "sidarr" && w !== "sidarr" && w !== "session") { // 요일 (MON~SUN) 만 포함한다.
                    var new_stime = new_reservation[w].starttime; // int
                    var new_etime = new_reservation[w].endtime; // int
                    var new_session1 = new_reservation[w].session1; // string
                    var new_session2 = new_reservation[w].session2; // string

                    if (current_res[w]){
                        var stimearr = current_res[w].starttime; // json
                        var etimearr = current_res[w].endtime; // json
                        var session1 = current_res.session[w].session1; // json
                        var session2 = current_res.session[w].session2; // json
                        var stdid = current_res.sidarr[w];
                    }
                
                    
                    if (Object.keys(new_reservation[w]).length) { // reservation이 존재하는 요일의 reservation json을 불러옴

                        if (reservation!=0 && Object.keys(current_res[w]).length) { // 해당요일(w)에 기존 예약이 하나라도 있을 경우

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

                            if (new_stime >= etimearr[etimearr.length-1]) { // 맨 뒷자리에 삽입가능한 경우
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

                            passed = controller.CheckFormat(stimearr, etimearr);;
                            // 변경 후 포멧확인으로 2차 점검
                            if (passed){                            output.sidarr[w] = stdid
                                output.sidarr[w].push(studentid)
                                output[w] = { 'starttime': [], 'endtime': []}
                                console.log(w,output[w].starttime )
                                output[w].starttime = stimearr
                                output[w].endtime = etimearr
                                output.session[w]= {'session1':[],'session2':[]}
                                output.session[w].session1 = session1
                                output.session[w].session2 = session2
                            }

                        } else { // 해당reservation date, type의 요일에 예약정보추가
                            output.sidarr[w] = stdid
                            output.sidarr[w].push(studentid)
                            output[w] = { 'starttime': [], 'endtime': []}
                            output[w].starttime = []
                            output[w].endtime = []
                            output[w].starttime.push(new_reservation[w].starttime)
                            output[w].endtime.push(new_reservation[w].endtime)
                            output.session[w]= {'session1':[],'session2':[]}
                            output.session[w].session1.push(new_reservation[w].session1)
                            output.session[w].session2.push(new_reservation[w].session2)
                        }
                    
                    }
                }    
            } // end of for-loop

            await Reservation.update(
                {
                    STARTDATE: new_startdate,
                    ReservationType: new_reservationtype,
                    sidarr: output.sidarr,
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
                    STARTDATE: Date.parse(new_startdate),
                    ReservationType: new_reservationtype
                }
            })

            if(passed || passedArr[0]) res.status(200).send({ message: "예약성공!"});
    

        }).catch(err => {
            res.status(500).send({ message: err.message, line: err.stack });
            return;
        });

    }

    var reservation = {
        "STARTDATE": req.body.STARTDATE,
        "ReservationType": req.body.ReservationType
    }
    if(req.body.MON) reservation.MON = req.body.MON
    if(req.body.TUE) reservation.TUE = req.body.TUE
    if(req.body.WEN) reservation.WEN = req.body.WEN
    if(req.body.THUR) reservation.THUR = req.body.THUR
    if(req.body.FRI) reservation.FRI = req.body.FRI
    if(req.body.SAT) reservation.SAT = req.body.SAT
    if(req.body.SUN) reservation.SUN = req.body.SUN

    ReservationToDb(reservation)

};


// 공지사항 등록
exports.get_Announcement = (req, res) => {
    console.log('--------------- get /manager/announcement ---------------');
    let output = []; // Json array

    Announcement.findAll().then(announcements => { // 미리보기 불러오기(제목, 날짜)
        for (let j = 0; j < announcements.length; j++) {
            output.push({ 'id': announcements[j].id, 'title': announcements[j].title, 'date': announcements[j].date, 'writer': announcements[j].writer, 'body': announcements[j].body });
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
    console.log('--------------- get /manager/approve_new_member ---------------');
    let output = []; // Json array

    User.findAll().then(async users => {
        //var output = [];
        for (let j = 0; j < users.length; j++) {
            await users[j].getPositions().then(positions => {
                for (let i = 0; i < positions.length; i++) {
                    if (positions[i].name === "not_approved") {
                        output.push({ 'username': users[j].username, 'major': users[j].major, 'studentid': users[j].studentid });
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
    console.log('--------------- post /manager/approve_new_member ---------------')
    User.findOne({ where: { studentid: req.body.studentid } }).then(user => {
        user.setPositions([2]).then(() => {
            res.status(200).send({ message: "회원 승인 성공!" });
        })

    });
};
