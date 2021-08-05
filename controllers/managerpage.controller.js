const db = require("../models");
const User = db.user;
const Announcement = db.announcement;

exports.root = (req, res) => {
    res.status(200).send({ message: "This is the main page of 'Hanwoolim-Manager' application." });
};

exports.signin = (req, res) => {
    res.status(200).send({ message: "관리자 앱 로그인 페이지." });
};



// 회원 목록 및 회원정보 수정
exports.get_Manage_list = (req, res) => {
    let output = []; // Json array

    User.findAll().then(users => {
        //var output = [];
        for (let j = 0; j < users.length; j++) {
           output.push( { 'username': users[j].username, 'major': users[j].major, 'studentid': users[j].studentid } );
        }

        res.status(200).send(output);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

exports.post_Manage_list = (req, res) => {
    var execute = req.body.execute;
    if (execute === 0){
        User.findOne({ where: { studentid: req.body.studentid} }).then(user => {
            user.setPositions([0]).then(() => {
                User.findOne({ where: { studentid: req.body.chairman_studentid} }).then(user => {
                    user.setPositions([2]).then(() => {
                        res.status(200).send({ message: "회장직위 위임 성공!" });
                        /// !!!! /manager/admin_home 으로 redirect
                    });
                        
                });
            })
                
        });
    }
    if (execute === 1){
        User.findOne({ where: { studentid: req.body.studentid} }).then(user => {
            user.setPositions([1]).then(() => {
                res.status(200).send({ message: "집행기로 지정 성공!" });
            });
                
        });
    }
    if (execute === 2){
        User.destroy({ where: { studentid: req.body.studentid} }).then(() => {
            res.status(200).send({ message: "성공적으로 탈퇴 처리되었습니다!" });
        });
    }
    
    if (!execute){
        res.status(404).send({ message: "오류!" });
    }
    
};


// 고정합주 예약 
exports.get_Reservation = (req, res) => {
    res.status(200).send({ message: "manager Reservation." });
};

exports.post_Reservation = (req, res) => {
    res.status(200).send({ message: "manager Reservation." });
};


// 공지사항 등록
exports.get_Announcement = (req, res) => {
    let output = []; // Json array

    Announcement.findAll().then(announcements => {
        //var output = [];
        for (let j = 0; j < announcements.length; j++) {
           output.push( {'title': announcements[j].title, 'date': announcements[j].date} );
        }

        res.status(200).send(output);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

exports.post_Announcement = (req, res) => {
    var output = `
    
    `
    res.status(200).send(output);
};



// 신규 가입자 승인
exports.get_Approve_new_member = (req, res) => {
    let output = []; // Json array

    User.findAll().then(async users => {
        //var output = [];
        for (let j = 0; j < users.length; j++) {
            //console.log("managerpage_user", users[j]);
            await users[j].getPositions().then( positions => {
                for (let i = 0; i < positions.length; i++) {
                    if (positions[i].name === "not_approved") {
                        output.push( {'username': users[j].username, 'major': users[j].major, 'studentid': users[j].studentid} );
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
    User.findOne({ where: { studentid: req.body.studentid} }).then(user => {
        user.setPositions([2]).then(() => {
            res.status(200).send({ message: "회원 승인 성공!" });
        })
            
    });
};
