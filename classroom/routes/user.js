const express = require("express");
const router = express.Router();
const User = require("../../models/user.js");
const wrapAsync = require("../../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../../middleware.js");
const userController = require("../../controllers/user.js");
const multer = require("multer");
const { storage } = require("../../cloudConfig.js");
const upload = multer({ storage });

router
.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(
     saveRedirectUrl,
      passport.authenticate("local",
         { failureRedirect: '/login',
             failureFlash: true,
             }),
              userController.login
            );

router.route("/profile")
    .get(isLoggedIn, wrapAsync(userController.renderProfileForm))
    .post(isLoggedIn, upload.single("profileImage"), wrapAsync(userController.updateProfile));

router.get("/logout", userController.logout);
module.exports = router;
