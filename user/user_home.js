const express = require('express');
const router = express.Router();

const board = require('./board');
const reservation = require('./reservation');

// 로그인 성공 또는 실패 후 회원가입 했을 때, '/user/home'으로 라우팅된 상황입니다
router.get('/', (req, res, next) => {
    // 홈페이지 진입했을 때 get 메소드로 진입에 대한 로직을 작성합니다
    res.send('homepage');
});

// 게시판을 클릭 시, '/user/home/board'로 라우팅됩니다
router.use('/board', board);

// 예약을 클릭 시, '/user/home/reservation'으로 라우팅됩니다
router.use('/reservation', reservation);

module.exports = router;