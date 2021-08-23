const express = require('express');
const router = express.Router();
const { authJwt } = require("../middleware");
const controller = require("../controllers/userpage.controller");

// router.get("/", controller.root);

// router.get("/signin", controller.signin);

// router.get("/not_approved", [authJwt.verifyToken], controller.not_approved);

// 번개모임
router.get("/lightningGathering", [authJwt.verifyToken, authJwt.isApproved], controller.get_Lightning_gathering);
router.post("/lightningGathering", [authJwt.verifyToken, authJwt.isApproved], controller.post_Lightning_gathering);

// 예약하기
router.get("/reservation", [authJwt.verifyToken, authJwt.isApproved], controller.get_Reservation);
router.post("/reservation", [authJwt.verifyToken, authJwt.isApproved], controller.post_Reservation);

// 자료게시판
router.get("/board", [authJwt.verifyToken, authJwt.isApproved], controller.get_Board);
router.post("/board", [authJwt.verifyToken, authJwt.isApproved], controller.post_Board);

// 개인정보 설정
router.get("/info", [authJwt.verifyToken, authJwt.isApproved], controller.get_Info);
router.post("/info", [authJwt.verifyToken, authJwt.isApproved], controller.post_Info);

// 개인정보 수정
router.patch("/editInfo", [authJwt.verifyToken, authJwt.isApproved], controller.patch_Edit_info);

module.exports = router;