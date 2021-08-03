const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ message: "This is the main page of 'Hanwoolim-User' application."});
});

router.get("/signin", (req, res) => {
    res.json({ message: "유저용 앱 로그인 페이지."});
});

router.get("/not_approved", (req, res) => {
    res.json({ message: "아직 승인되지 않은 계정입니다."});
});

module.exports = router;