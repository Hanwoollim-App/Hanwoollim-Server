const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
        console.log('used')
    });

    app.post(
        "/user/signUp",
        [
            verifySignUp.checkDuplicateIdOrStdId
        ],
        controller.signUp
    );

    app.post("/user/signIn", controller.userSignIn);
    app.post("/manager/signIn", controller.managerSignIn);
};