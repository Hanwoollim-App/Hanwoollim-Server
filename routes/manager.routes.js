const express = require('express');
const router = express.Router();
const { authJwt } = require("../middleware");
const controller = require("../controllers/managerpage.controller");


router.get("/", controller.root);

router.get("/signin", controller.signin);

// 회원 목록 및 회원정보 수정하기 (관리자)
router.get("/manage_list", [authJwt.verifyToken, authJwt.isChairman], controller.manage_list);

// 고정합주 예약하기 (관리자, 집행기)
router.get("/reservation", [authJwt.verifyToken, authJwt.isAdminOrChairman], controller.reservation);

// 공지사항 등록하기 (관리자)
router.get("/anouncement", [authJwt.verifyToken, authJwt.isChairman], controller.anouncement);

// 신규 가입자 승인하기 (관리자)
router.get("/approve_new_member", [authJwt.verifyToken, authJwt.isChairman], controller.approve_new_member);



module.exports = router;