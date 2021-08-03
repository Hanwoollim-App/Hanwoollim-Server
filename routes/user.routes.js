const express = require('express');
const router = express.Router();
const { authJwt } = require("../middleware");
const controller = require("../controllers/userpage.controller");

router.get("/", controller.root);

router.get("/signin", controller.signin);

router.get("/not_approved", [authJwt.verifyToken], controller.not_approved);

router.get("/gathering", [authJwt.verifyToken, authJwt.isApproved], controller.gathering);

router.get("/reservation", [authJwt.verifyToken, authJwt.isApproved], controller.reservation);

router.get("/board", [authJwt.verifyToken, authJwt.isApproved], controller.board);

router.get("/info", [authJwt.verifyToken, authJwt.isApproved], controller.info);

router.get("/edit_info", [authJwt.verifyToken, authJwt.isApproved], controller.edit_info);

module.exports = router;