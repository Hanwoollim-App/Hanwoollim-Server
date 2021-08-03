const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/user/signup",
        [
            verifySignUp.checkDuplicateIdOrStdId
        ],
        controller.signup
    );

    app.post("/user/signin", controller.userSignin);
    app.post("/manager/signin", controller.managerSignin);
};