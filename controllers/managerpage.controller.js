const db = require("../models");
const User = db.user;
const Announcement = db.announcement;
const Reservation = db.reservation;

// exports.root = (req, res) => {
//     res.status(200).send({ message: "This is the main page of 'Hanwoolim-Manager' application." });
// };

// exports.signin = (req, res) => {
//     res.status(200).send({ message: "관리자 앱 로그인 페이지." });
// };


// 회원 목록 및 회원정보 수정
exports.get_Manage_list = (req, res) => {
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

    async function CodeToReservation(sidJson, sessionJson, DoW, code) {

        // pass if nothing inside
        if (!code) {
            console.log('값이 없습니다')
            return;
        }
        var output = []
        var starttime = code.starttime;
        var endtime = code.endtime;
        var session1 = sessionJson[DoW].session1;
        var session2 = sessionJson[DoW].session2;
        var sidArr = sidJson[DoW];
        var passed = false;

        // 갯수 매칭 체크
        if (sidJson[DoW].length !== starttime.length || sessionJson[DoW].length !== endtime.length || starttime.length !== endtime.length) {
            console.log('이름,예약시작시간,예약종료시간,세션 갯수 매칭안됨!')
        }

        // Check Format
        passed = controller.CheckFormat(starttime, endtime);
        if (passed) {
            for (let i = 0; i < starttime.length; i++) {
                await User.findOne({ where: { studentid: sidArr[i] } }).then(user => {
                    username = user.name;
                }).catch(err => {
                    res.status(500).send({ message: err.message });
                });

                output.push({ "studentid": sidArr[i], "name": username, "starttime": starttime[i], "endtime": endtime[i], "session1": session1[i], "session2": session2[i] })
            }
        }
        return output;
    }

    Reservation.findOne({
        where: {
            STARTDATE: req.query.startdate
        }
    }).then(reservation => {
        console.log(reservation)
        var output = []
        if (reservation) {
            for (let r in reservation) {
                output.push(CodeToReservation(reservation.sidarr, reservation.session, reservation[w]));
            }
        }
        res.status(200).send(output);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });



    code1 = { "starttime": [], "endtime": [] }
    code2 = { "starttime": [8, 9.5], "endtime": [9, 10] }
    code3 = { "starttime": [7, 8], "endtime": [8, 10] }
    sid1 = { "MON": [2021013218, 2021013098], "TUE": [2021013217] }
    session1 = { "MON": { "session1": ["기타", "피아노"], "session2": ["", "베이스"] }, "TUE": { "session1": ["드럼", "베이스"], "session2": ["", "기타"] } }
    DoW = "TUE" // Day of Week
    //CodeToReservation(sid1, code2, session1, DoW)

    var outreservation = { // 클라이언트에게 보내는 형식
        "STARTDATE": "2021-08-08", // 월요일을 첫날 기준으로 한 주가 시작하는 날짜입니다.
        "ReservationType": "Together", //Personal, Together, Mentoring
        "MON": [{ // json array로 보내준다.
            "studentid": 2021013218, // 개인 식별용
            "name": "이재만",
            "starttime": 8, // integer로 변경 (24시간)
            "endtime": 8.5,
            "session1": "기타", // reservation type이 personal혹은 mentoring일 경우 session1, session2키를 보내지 않는다.
            "session2": "" // session2에 value가 없더라도 key를 전달한다.
        }, {
            "studentid": 2021013219,
            "name": "고병찬",
            "starttime": 9,
            "endtime": 10,
            "session1": "피아노",
            "session2": "베이스"
        }],
        "TUE": [{
            "studentid": 2021013220,
            "name": "고병찬",
            "starttime": 10.5,
            "endtime": 11,
            "session1": "베이스",
            "session2": "기타"
        }],
        "WEN": []
    }
};

exports.post_Reservation = (req, res) => {
//     const controller = require("./auth.controller");
//     var jwt = require("jsonwebtoken");
//     const config = require("../config/auth.config");

//     async function ReservationToDb(new_reservation) { // json from client
//         let token = req.headers["x-access-token"];
//         var studentid;
//         await jwt.verify(token, config.secret, (err, decoded) => {
//             if (err) {
//                 return res.status(401).send({
//                     message: "토큰 오류!"
//                 });
                
//             }
//             userId = decoded.jwt_id;
//         });

//         await User.findOne({ where: { id: userId } }).then(user => {
//             studentid = user.studentid;
//         }).catch(err => {
//             res.status(500).send({ message: err.message });
//             return;
//         });
        
        
        

//                 Reservation.findOne({
//                     where: {
//                         STARTDATE: new_startdate,
//                         ReservationType: new_reservationtype
//                     }
//                 }).then(async reservation => {
//                     for (let w in new_reservation) { // Week의 예약 내용 불러오기
//                         if (w !== "STARTDATE" && w !== "ReservationType") { // 요일 (MON~SUN) 만 포함한다.
//                             var new_startdate = new_reservation.STARTDATE;
//                             var new_reservationtype = new_reservation.ReservationType;
//                             var new_stime = new_reservation[w].starttime; // int
//                             var new_etime = new_reservation[w].endtime; // int
//                             var new_session1 = new_reservation[w].session1; // string
//                             var new_session2 = new_reservation[w].session2; // string
//                             var passed = false;

//                     console.log(reservation)
//                     let stimearr = reservation[w].starttime; // array
//                     let etimearr = reservation[w].endtime; // array
//                     let session1 = reservation.session[w].session1; // array
//                     let session2 = reservation.session[w].session2; // array

//                     if (reservation===null || reservation.ReservationType !== new_reservationtype) { // 해당하는 날짜 또는 reservationtype이 없을 경우
//                         console.log('create')
//                         await Reservation.create({
//                             STARTDATE: new_startdate,
//                             ReservationType: new_reservationtype,
//                             [w]: // 'reservation Table' 속 '요일(w)' 열 - type: json
//                             {
//                                 starttime: [new_stime], // 배열속에 저장
//                                 endtime: [new_etime]
//                             },
//                             session: // session = {"MON":{"session1":["기타","피아노"],"session2":["","베이스"]}, "TUE":{"session1":["드럼","베이스"],"session2":["","기타"]}}
//                             {
//                                 [w]: {
//                                     session1: [new_reservation[w].session1],
//                                     session2: [new_reservation[w].session2]
//                                 }
//                             }
//                         })
//                         return;
//                     }


//                     if (Object.keys(new_reservation[w]).length) { // reservation이 존재하는 요일의 reservation json을 불러옴
//                         console.log(w, new_reservation[w])


//                         if (reservation[w].STARTDATE == new_startdate) {

//                         }


//                         if (Object.keys(reservation[w]).length) { // 해당요일(w)에 기존 예약이 하나라도 있을 경우

//                             if (stimearr.length !== session1.length || etimearr.length !== session2.length) {
//                                 console.log("연주 session 갯수가 맞지 않습니다.")
//                                 return false
//                             }

//                             if (new_etime < stimearr[0]) { // 맨 앞자리에 삽입가능한 경우
//                                 stimearr.splice(0, 0, new_stime);
//                                 etimearr.splice(0, 0, new_etime);
//                                 session1.splice(0, 0, new_session1);
//                                 session2.splice(0, 0, new_session2);
//                                 passed = true;
//                             }
//                             if (new_stime > etimearr[-1]) { // 맨 뒷자리에 삽입가능한 경우
//                                 stimearr.splice(-1, 0, new_stime);
//                                 etimearr.splice(-1, 0, new_etime);
//                                 session1.splice(-1, 0, new_session1);
//                                 session2.splice(-1, 0, new_session2);
//                                 passed = true;
//                             }
//                             if (!passed) {
//                                 for (let i = 0; i < etimearr.length; i++) { // 중간에 삽입하는 경우
//                                     if (new_stime >= etimearr[i]) {
//                                         if (new_etime <= stimearr[i + 1]) {
//                                             await stimearr.splice(i + 1, 0, new_stime);
//                                             await etimearr.splice(i + 1, 0, new_etime);
//                                             await session1.splice(i + 1, 0, new_session1);
//                                             await session2.splice(i + 1, 0, new_session2);
//                                             passed = true;
//                                             break;
//                                         }
//                                         continue;
//                                     }
//                                 }
//                             }
//                             if (!passed) {
//                                 console.log("이미 예약시간이 있습니다.")
//                                 return false
//                             }

//                             passed = controller.CheckFormat(stimearr, etimearr);;
//                             // 포멧확인
//                             // reservation.fn("json_extract", Sequelize.col("session"), "$.MON")
//                             await reservation.update(
//                                 {
//                                     [w]: // 'reservation Table' 속 '요일(w)' 열 - type: json
//                                     {
//                                         starttime: stimearr, // 배열속에 저장
//                                         endtime: etimearr
//                                     }
//                                     , session:// session = {"MON":{"session1":["기타","피아노"],"session2":["","베이스"]}, "TUE":{"session1":["드럼","베이스"],"session2":["","기타"]}}
//                                     {
//                                         [w]: {
//                                             session1: session1, // array
//                                             session2: session2
//                                         }
//                                     }
//                                     , sidarr:
//                                     {
//                                         [w]: [studentid]
//                                     }
//                                 }, {
//                                 where: {
//                                     STARTDATE: new_startdate,
//                                     ReservationType: new_reservationtype
//                                 }
//                             })



//                         } else { // 해당reservation date, type의 요일에 예약정보추가
//                             await reservation.update({
//                                 [w]: // 'reservation Table' 속 '요일(w)' 열 - type: json
//                                 {
//                                     starttime: [new_stime], // 배열속에 저장
//                                     endtime: [new_etime]
//                                 },
//                                 session: // session = {"MON":{"session1":["기타","피아노"],"session2":["","베이스"]}, "TUE":{"session1":["드럼","베이스"],"session2":["","기타"]}}
//                                 {
//                                     [w]: {
//                                         session1: [new_reservation[w].session1],
//                                         session2: [new_reservation[w].session2]
//                                     }
//                                 },
//                                 sidarr:
//                                 {
//                                     [w]: [studentid]
//                                 }
//                             }, {
//                                 where: {
//                                     STARTDATE: new_startdate,
//                                     ReservationType: new_reservationtype
//                                 }
//                             })

//                         }
//                         console.log(`${w}변경 완료!`)
//                         return;
//                     }

//                 }).catch(err => {
//                     res.status(500).send({ message: err.message });
//                     return;
//                 });

//             }
//         }

//     }

//     var reservation1 = { //클라이언트한테서 받는 형식
//         "STARTDATE": "2021-08-02", // 월요일을 첫날 기준으로 한 주가 시작하는 날짜입니다.
//         "ReservationType": "Personal", //Personal, Together, Mentoring
//         "MON": {
//             "starttime": 8,
//             "endtime": 8.5,
//             "session1": "베이스",
//             "session2": ""
//         },
//         "TUE": {
//             "starttime": 10.5,
//             "endtime": 11,
//             "session1": "기타",
//             "session2": "피아노"
//         },
//         "WEN": {},
//     };

//     var reservation2 = { //클라이언트한테서 받는 형식
//         "STARTDATE": "2021-08-08", // 월요일을 첫날 기준으로 한 주가 시작하는 날짜입니다.
//         "ReservationType": "Together", //Personal, Together, Mentoring
//         "MON": {
//             "starttime": 8,
//             "endtime": 8.5,
//             "session1": "기타",
//             "session2": "" // session2에 아무것도 없더라도 key를 전달해야 한다.
//         },
//         "TUE": {
//             "starttime": 10.5,
//             "endtime": 11,
//             "session1": "베이스",
//             "session2": "기타"
//         }
//     };

//     var reservation = {
//         "STARTDATE": req.body.STARTDATE,
//         "ReservationType": req.body.ReservationType,
//         "MON": req.body.MON,
//         "TUE": req.body.TUE,
//         "WEN": req.body.WEN,
//         "THUR": req.body.THUR,
//         "FRI": req.body.FRI,
//         "SAT": req.body.SAT,
//         "SUN": req.body.SUN,
//     }
//     console.log(req.body.a)
//     ReservationToDb(reservation)

//     var dbreservation = { // db에 저장되는 형식
//         "STARTDATE": "2021-08-08", // 월요일을 첫날 기준으로 한 주가 시작하는 날짜입니다.
//         "ReservationType": "Together", //Personal, Together, Mentoring
//         "sidArray": { "MON": [2021013218, 2021013098], "TUE": [2021013217, 2020023019] },
//         "MON": { "starttime": [8, 9.5], "endtime": [9, 10] },
//         "TUE": { "starttime": [10, 11.5], "endtime": [11, 12] },
//         "WEN": {},
//         "session": { "MON": { "session1": ['기타', '베이스'], "session2": ['피아노', ''] }, "TUE": { "session1": ['드럼', '베이스'], "session2": ['', '기타'] } }
//     }

//     //res.status(200).send({ message: "manager Reservation." });
};


// 공지사항 등록
exports.get_Announcement = (req, res) => {
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
    let output = []; // Json array

    User.findAll().then(async users => {
        //var output = [];
        for (let j = 0; j < users.length; j++) {
            //console.log("managerpage_user", users[j]);
            await users[j].getPositions().then(positions => {
                for (let i = 0; i < positions.length; i++) {
                    if (positions[i].name === "not_approved") {
                        output.push({ 'username': users[j].username, 'major': users[j].major, 'studentid': users[j].studentid });
                        console.log(output);
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
    User.findOne({ where: { studentid: req.body.studentid } }).then(user => {
        user.setPositions([2]).then(() => {
            res.status(200).send({ message: "회원 승인 성공!" });
        })

    });
};
