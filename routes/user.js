const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utiles/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/users");

router
    .route("/signup")
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.signUp))


router
    .route("/login")    
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,passport.authenticate("local", { 
        failureRedirect: '/login', 
        failureFlash: true 
    }),userController.Login);

router.get("/logout",userController.logout);
module.exports = router;