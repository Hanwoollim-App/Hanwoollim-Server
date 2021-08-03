
exports.root = (req, res) => {
    res.status(200).send({ message: "This is the main page of 'Hanwoolim-User' application."});
};

exports.signin = (req, res) => {
    res.status(200).send({ message: "유저용 앱 로그인 페이지."});
};

exports.not_approved = (req, res) => {
    res.status(200).send({ message: "아직 승인되지 않은 계정입니다."});
};

exports.gathering = (req, res) => {
    res.status(200).send("User Gathering.");
};

exports.reservation = (req, res) => {
    res.status(200).send("User Reservation.");
};

exports.board = (req, res) => {
    res.status(200).send("User Board.");
};

exports.info = (req, res) => {
    res.status(200).send("User Info.");
};

exports.edit_info = (req, res) => {
    res.status(200).send("User Edit Info.");
};

