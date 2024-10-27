const router = require("express").Router();
const verifyToken = require("../../middlewares/authJwt");
const { authRole } = require('../../middlewares/authRole');
const controller = require("./user_controller");
const {
    validateSignUp,
    validateLogin,
    validateOtp,
    validateEditProfile,
    validateChangePassword,
    validateForgotPassword,
    validateForgotPassVerify,
    validateResetPassword,
  }  = require ("./user_validator");

router.post("/sign/up", validateSignUp, controller.signUp); 
router.post("/verify/email", validateOtp, verifyToken, authRole(["USER", "MANAGER"]), controller.verifyEmail);

router.post("/login", validateLogin, controller.login);
router.put("/logout", verifyToken, controller.logout);

router.get("/profile", verifyToken, controller.getProfile);
router.put("/profile", validateEditProfile, verifyToken,authRole(["USER", "MANAGER"]), controller.editProfile);

router.patch("/change/password",validateChangePassword, verifyToken, authRole(["USER", "MANAGER"]), controller.changePassword );

router.put("/forgot/password", validateForgotPassword, controller.forgotPassword);
router.post("/forgot/verify/otp", validateForgotPassVerify, authRole(["USER", "MANAGER"]), controller.forgotPasswordVerifyOtp);

router.post("/reset/password", validateResetPassword, controller.resetPassword);
router.post("/resend/email/otp", verifyToken, authRole(["USER", "MANAGER"]), controller.resendEmailOtp);

router.get("/other", verifyToken, authRole(["MANAGER"]), controller.getOtherUser); // manager and admin access 
 


module.exports = router;
