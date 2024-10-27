const router = require("express").Router();
const verifyToken = require("../../middlewares/authJwt");
const Admin_Controller = require("./admin_controller");
const { authRole } = require("../../middlewares/authRole")
const {
    validateCreateManager,
    validateCreateTeam,
    validateMember
  }  = require ("./admin_validator");

// admin 
router.post("/manager",validateCreateManager, verifyToken, authRole(['ADMIN']), Admin_Controller.create_manager);// by admin
router.get("/manager", verifyToken,  authRole(['ADMIN']), Admin_Controller.list_manager);
router.post("/team",validateCreateTeam, verifyToken,authRole(['ADMIN']), Admin_Controller.create_team); //create team  by admin
router.get("/team", verifyToken, authRole(['ADMIN']), Admin_Controller.list_team)
router.get("/team/:_id/member",verifyToken, authRole(['ADMIN']), verifyToken, Admin_Controller.list_member);
router.patch("/team/:_id/member/add",validateMember, verifyToken, authRole(['ADMIN']), Admin_Controller.add_member); 
router.patch("/team/:_id/member/remove",validateMember, verifyToken, authRole(['ADMIN']), Admin_Controller.remove_member);

module.exports = router;