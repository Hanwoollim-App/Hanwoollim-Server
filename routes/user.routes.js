const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/user", [authJwt.verifyToken], controller.userBoard);
    app.get("/manager", [authJwt.verifyToken], controller.adminBoard);
    app.get("/chairman", [authJwt.verifyToken], controller.chairmanBoard);
};