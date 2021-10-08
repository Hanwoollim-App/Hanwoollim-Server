const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Board = db.board;
const Reservation = db.reservation;
const controller = require("../controllers/auth.controller");

const ubuntu_path = require("../controllers/ubuntu_board_path");
ubuntu_path.changePath();
// AWS에서 작동할 경우 board 파일 경로를 변경(AWS에 ./controllers/isAWS 파일이 존재해야함) !! pm2 start --watch 사용불가

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
        var output = []
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

                output.push({ "isMine": isMine, "name": userName, "startTime": startTime[i], "endTime": endTime[i], "session1": session1[i], "session2": session2[i] });
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
        var output = []
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
                output.push({ "name": nameArr[i], "startTime": startTime[i], "endTime": endTime[i], "session1": session1[i], "session2": session2[i] });
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
                    // console.log(curr_res)
                    output.startDate = controller.dateFormat(curr_res.startDate)
                    output.reservationType = curr_res.reservationType
                    for (let w in curr_res) {
                        if (curr_res[w] !== null && w !== "createdAt" && w != "updatedAt" && w !== "id" && w !== "startDate" && w !== "reservationType" && w !== "sidArr" && w !== "session") { // 요일 (MON~SUN) 만 포함한다.
                            output[w] = []
                            output[w] = await codeToReservation_user(curr_res.sidArr[w], curr_res.session[w], curr_res[w]);
                            console.log(output[w])
                            
                        }
                    }
                    outputArr.push(JSON.parse(JSON.stringify(output))) // reference가 copy되기 때문에 newcopy를 만들어준것
                    output={} // 같은 날짜에 Personal이 테이블에서 아래에 위치해있을 때 다른 Type이 섞여 출력되는 버그(그 반대는 정상실행됨)
                } else{
                    curr_res = reservation[i].dataValues
                    // console.log(curr_res)
                    output.startDate = controller.dateFormat(curr_res.startDate)
                    output.reservationType = curr_res.reservationType
                    for (let w in curr_res) {
                        if (curr_res[w] !== null && w !== "createdAt" && w != "updatedAt" && w !== "id" && w !== "startDate" && w !== "reservationType" && w !== "nameArr" && w !== "session") { // 요일 (MON~SUN) 만 포함한다.
                            output[w] = []
                            output[w] = await codeToReservation_manager(curr_res.nameArr[w], curr_res.session[w], curr_res[w]);
                            console.log(output[w])
                        }
                    }
                    outputArr.push(JSON.parse(JSON.stringify(output))) // reference가 copy되기 때문에 newcopy를 만들어준것
                    output={}
                }
            }
        }
        res.status(200).send(outputArr);
    }).catch(err => {
        res.status(500).send({ message: err.message, error: err.stack });
    });

    console.log('req.query: ' + req.query.startDate)


};

exports.post_Reservation = async (req, res) => { // 관리자용 앱과 완전히 동일
    console.log('--------------- post /user/reservation ---------------');
    let jwt = require("jsonwebtoken");
    let token = req.headers["x-access-token"];
    let studentId;
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

    async function reservationToDb(new_reservation) { // json from client

        if(new_reservation.reservationType === 'Together' || new_reservation.reservationType === 'Mentoring'){
            res.status(400).send({ message: "Together/Mentoring ReservationType은 Manager-App에서 실행되어야 합니다."})
            return;
        }


        Reservation.findOne({ // 추가할 내용이 기존에 있는 startDate, reservationType인지 확인
            where: {
                startDate: Date.parse(new_reservation.startDate),
                reservationType: new_reservation.reservationType
            }
        }).then(async reservation => {
            var new_startDate = new_reservation.startDate;
            var new_reservationType = new_reservation.reservationType;


            if (reservation == null) { // 해당하는 날짜와 reservationType이 없을 경우 (왜 인지 모르겠지만 !reservation 대신 reservation==0이 먹힌다)--> 그 전에는 findAll을 사용했기 때문
                var output = { 'sidArr': {}, 'session': {} }
                var passedArr = []

                for (let w in new_reservation) {
                    if (w !== "startDate" && w !== "reservationType") {
                        passedArr = controller.checkFormat([new_reservation[w].startTime], [new_reservation[w].endTime]);
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

            // 해당하는 날짜와 reservationType에 기존 예약이 있을 경우
            var output = { 'sidArr': {}, 'session': {} }
            var passedArr = [false];
            current_res = reservation.dataValues // Sequelize를 통해 받아온 구조 분석 후 사용한 것.
            for (let w in current_res) { // Week의 예약 내용 불러오기
                if ( w == 'MON' || w == 'TUE' || w == 'WEN' || w == 'THUR' || w == 'FRI' || w == 'SAT' || w == 'SUN' ) { // 요일 (MON~SUN) 만 포함한다.
                    if (current_res[w]!==null){
                        var stimeArr = current_res[w].startTime; // json
                        var etimeArr = current_res[w].endTime; // json
                        var session1 = current_res.session[w].session1; // json
                        var session2 = current_res.session[w].session2; // json
                        var sidArr = current_res.sidArr[w];
                        output.sidArr[w] = current_res.sidArr[w];
                        output.session[w] = current_res.session[w];
                    }

                    if (new_reservation[w] !== undefined){    
                        var new_stime = new_reservation[w].startTime; // int
                        var new_etime = new_reservation[w].endTime; // int
                        var new_session1 = new_reservation[w].session1; // string
                        var new_session2 = new_reservation[w].session2; // string
                    
                        if (Object.keys(new_reservation[w]).length) { // reservation이 존재하는 요일의 reservation json을 불러옴
                            if (reservation!=0 && current_res[w]!=null) { // 해당요일(w)에 기존 예약이 하나라도 있을 경우
                                
                                if (stimeArr.length !== session1.length || etimeArr.length !== session2.length) {
                                    res.status(400).send("예약시간과 session 갯수가 매칭되지 않습니다.")
                                    return false
                                }

                                if (new_etime <= stimeArr[0]) { // 맨 앞자리에 삽입가능한 경우
                                    stimeArr.splice(0, 0, new_stime);
                                    etimeArr.splice(0, 0, new_etime);
                                    session1.splice(0, 0, new_session1);
                                    session2.splice(0, 0, new_session2);
                                    sidArr.splice(0, 0, studentId);
                                    passedArr[0] = true;
                                }

                                if (new_stime >= etimeArr[etimeArr.length-1]) { // 맨 뒷자리에 삽입가능한 경우
                                    stimeArr.splice(stimeArr.length, 0, new_stime);
                                    etimeArr.splice(etimeArr.length, 0, new_etime);
                                    session1.splice(session1.length, 0, new_session1);
                                    session2.splice(session2.length, 0, new_session2);
                                    sidArr.splice(sidArr.length, 0, studentId);
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
                                                await sidArr.splice(i + 1, 0, studentId)
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
                                if (passedArr[0]===true) {
                                    output.sidArr[w] = sidArr
                                    output[w] = { 'startTime': [], 'endTime': []}
                                    output[w].startTime = stimeArr
                                    output[w].endTime = etimeArr
                                    output.session[w]= {'session1':[],'session2':[]}
                                    output.session[w].session1 = session1
                                    output.session[w].session2 = session2
                                }else if (passedArr[0]===false){
                                    res.status(400).send(passedArr[1])
                                }

                            } else { // 해당reservation date, type의 요일에 예약정보추가
                                output.sidArr[w] = []
                                output.sidArr[w].push(studentId)
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

            if (passedArr[0]===true) res.status(200).send({ message: "예약성공!" });


        }).catch(err => {
            res.status(500).send({ message: err.message, line: err.stack });
            return;
        });

    }

    var reservation = {
        "startDate": req.body.startDate,
        "reservationType": req.body.reservationType
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

exports.delete_Reservation = async (req, res) => {
    console.log('--------------- delete /user/reservation ---------------');
    let jwt = require("jsonwebtoken");

    let token = req.headers["x-access-token"];
    let studentId;
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

    async function deleteReservation(del_reservation){
        
        if(del_reservation.reservationType === 'Together' || del_reservation.reservationType === 'Mentoring'){
            res.status(400).send({ message: "Together/Mentoring ReservationType은 Manager-App에서 실행되어야 합니다."})
            return;
        }


        Reservation.findOne({ // 추가할 내용이 기존에 있는 startDate, reservationType인지 확인
            where: {
                startDate: Date.parse(del_reservation.startDate),
                reservationType: del_reservation.reservationType
            }
        }).then(async reservation => {

            if (reservation==null) {
                return res.status(400).send({ message: "삭제 대상인 startDate/reservationType이 존재하지 않습니다." })
            }

            let passed = false;
            let empty = false;

            current_res = reservation.dataValues
            for (let w in current_res) { // Week의 예약 내용 불러오기
                // console.log(current_res[w])
                if ( w == del_reservation.day ){

                    if (current_res[w]==null){

                        return res.status(400).send({ message: "입력하신 요일에 기존예약이 존재하지 않습니다." })

                    }else{

                        index = current_res[w].startTime.indexOf(del_reservation.startTime)
                        
                        if (index > -1){
                            
                            if (current_res.sidArr[w][index]!==studentId) res.status(400).send({ message: "본인만 삭제할 수 있습니다." })
                            
                            current_res.sidArr[w].splice(index, 1)
                            current_res.session[w].session1.splice(index, 1)
                            current_res.session[w].session2.splice(index, 1)
                            current_res[w].startTime.splice(index, 1)
                            current_res[w].endTime.splice(index, 1)
                            

                            // 예약 갯수가 0이 될 경우 [] 또는 {}를 반환하지 않게 하기 위해 포멧을 맞춰준다
                            if (current_res.sidArr[w].length==0) delete current_res.sidArr[w]
                            if (current_res.session[w].session1.length==0) delete current_res.session[w].session1
                            if (current_res.session[w].session2.length==0) delete current_res.session[w].session2
                            if (current_res[w].startTime.length==0) delete current_res[w].startTime
                            if (current_res[w].endTime.length==0) delete current_res[w].endTime

                            if (Object.keys(current_res[w]).length == 0) current_res[w] = null
                            if (Object.keys(current_res.session[w]).length == 0) delete current_res.session[w]
                            
                            if (Object.keys(current_res.sidArr).length == 0) empty=true;
                                

                            passed = true

                        }else{
                            passed = false
                            return res.status(400).send({ message: "입력하신 날짜에 startTime이 존재하지 않습니다." })
                        }



                    }
                }
            
            }

            if(passed===true){
                
                if(empty===true){
                    await Reservation.destroy({
                        where: {
                            startDate: Date.parse(del_reservation.startDate),
                            reservationType: del_reservation.reservationType
                        }
                    })
                }else{
                    await Reservation.update(
                        {
                            startDate: Date.parse(current_res.startDate),
                            reservationType: current_res.reservationType,
                            sidArr: current_res.sidArr,
                            session: current_res.session,
                            MON: current_res.MON,
                            TUE: current_res.TUE,
                            WEN: current_res.WEN,
                            THUR: current_res.THUR,
                            FRI: current_res.FRI,
                            SAT: current_res.SAT,
                            SUN: current_res.SUN,
                            
                        }, {
                        where: {
                            startDate: Date.parse(del_reservation.startDate),
                            reservationType: del_reservation.reservationType
                        }
                    })
                }

                res.status(200).send({ message: "삭제성공!"});
            }
            
            
        }).catch(err => {
            res.status(500).send({ message: err.message, line: err.stack });
            return;
        });
    }



    var reservation = {
        "startDate": req.params['startDate'],
        "reservationType": req.params['reservationType'],
        "day": req.params['day'],
        "startTime": parseInt(req.params['startTime'])
    }

    deleteReservation(reservation);

}
// 자료게시판
exports.get_Board = (req, res) => {
    console.log('--------------- get /user/board ---------------');
    let output = []; // Json array
    const now = Date.now();
    const fs = require('fs');
    const path = require('path');
    const fileName = req.query.fileName
    var fileDownload = false;
    
    let token = req.headers["x-access-token"];
    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "토큰 오류!"
            });
        }
        userId = decoded.jwt_id;
    });

    Board.findAll().then(async boards => { // 미리보기(제목+만료일)
        for (let j = 0; j < boards.length; j++) {
            var expireDate = new Date(boards[j].expireDate).getTime()

            if (now < expireDate) { // expireDate이 현재시간보다  클 경우에만 가져온다
                if (boards[j].fileUpload && fileName == `${boards[j].id}_${boards[j].title}`) {
                    var filePath = path.join(`/Users/jaeman/board_uploaded_file/${userId}_${boards[j].fileName}`)
                    var readStream = fs.createReadStream(filePath);
                    // We replaced all the event handlers with a simple call to readStream.pipe()
                    await readStream.pipe(res)

                    fileDownload = true;
                } else {
                    output.push({ 'id': boards[j].id, 'title': boards[j].title, 'expireDate': controller.dateFormat(boards[j].expireDate), 'body': boards[j].body });
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
            body: fields.body
        }).then(()=>{
                if(files.file){
                    Board.update({
                        fileName: `${files.file.name}`
                    }, { where: { title : fields.title, writer : userId} } ).then(()=>{
                        var oldpath = files.file.path;
                        var newpath = `/Users/jaeman/board_uploaded_file/${userId}_${files.file.name}`;
                        fs.rename(oldpath, newpath, (err) => {
                            if (err) throw err;
                            res.status(200).send({ message: '게시글 등록 성공!, File uploaded to board_uploaded_file!' });
                        })
                    })
                }else{
                    res.status(200).send({ message: "게시글 등록 성공!" });
                }
            
        }).catch(err => {
            res.status(500).send({ message: err.message , stack: err.stack });
        });
    });
};


// 공지사항 등록
exports.get_Announcement = (req, res) => {
    console.log('--------------- get /user/announcement ---------------');
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

