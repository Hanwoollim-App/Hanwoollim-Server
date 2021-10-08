const express = require('express');
const router = express.Router();
const { authJwt } = require("../middleware");
const controller = require("../controllers/managerpage.controller");


// router.get("/", controller.root);

// router.get("/signin", controller.signin);

// 회원 목록 및 회원정보 수정 (관리자)
router.get("/manageList", [authJwt.verifyToken, authJwt.isChairman], controller.get_Manage_list);
router.post("/manageList", [authJwt.verifyToken, authJwt.isChairman], controller.post_Manage_list);

// 고정합주 예약 (관리자, 집행기)
router.get("/reservation", [authJwt.verifyToken, authJwt.isAdminOrChairman], controller.get_Reservation);
router.post("/reservation", [authJwt.verifyToken, authJwt.isAdminOrChairman], controller.post_Reservation);
router.delete("/reservation/delete/:startDate/:reservationType/:day/:startTime", [authJwt.verifyToken, authJwt.isAdminOrChairman], controller.delete_Reservation)

// 공지사항 등록 (관리자)
router.get("/announcement", [authJwt.verifyToken, authJwt.isApproved], controller.get_Announcement);
router.post("/announcement", [authJwt.verifyToken, authJwt.isChairman], controller.post_Announcement);

// 신규 가입자 승인 (관리자)
router.get("/approveNewMember", [authJwt.verifyToken, authJwt.isChairman], controller.get_Approve_new_member);
router.post("/approveNewMember", [authJwt.verifyToken, authJwt.isChairman], controller.post_Approve_new_member);


module.exports = router;