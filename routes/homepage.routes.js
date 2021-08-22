const { authJwt } = require("../middleware");
const controller = require("../controllers/homepage.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH');
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });

    app.get("/user/home", [authJwt.verifyToken, authJwt.isApproved], controller.userHome);
    app.get("/manager/admin_home", [authJwt.verifyToken, authJwt.isAdmin], controller.adminHome);
    app.get("/manager/chairman_home", [authJwt.verifyToken, authJwt.isChairman], controller.chairmanHome);
};