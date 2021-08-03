
exports.root = (req, res) => {
    res.status(200).send({ message: "This is the main page of 'Hanwoolim-User' application."});
};

exports.signin = (req, res) => {
    res.status(200).send({ message: "유저용 앱 로그인 페이지."});
};

exports.not_approved = (req, res) => {
    res.status(200).send({ message: "아직 승인되지 않은 계정입니다."});
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
    res.status(200).send("User Board.");
};

exports.post_Board = (req, res) => {
    res.status(200).send("User Board.");
};


// 개인정보 설정
exports.get_Info = (req, res) => {
    res.status(200).send("User Info.");
};

exports.post_Info = (req, res) => {
    res.status(200).send("User Info.");
};


// 개인정보 수정
exports.get_Edit_info = (req, res) => {
    res.status(200).send("User Edit Info.");
};

exports.post_Edit_info = (req, res) => {
    res.status(200).send("User Edit Info.");
};

