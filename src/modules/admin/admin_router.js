const router = require("express").Router();
const verifyToken = require("../../middlewares/authJwt");
const Admin_Controller = require("./admin_controller");
const { authRole } = require("../../middlewares/authRole")

// admin 
router.post("/manager", verifyToken, authRole(['ADMIN']), Admin_Controller.create_manager);// by admin
router.get("/manager", verifyToken,  authRole(['ADMIN']), Admin_Controller.list_manager);
router.post("/team", verifyToken,authRole(['ADMIN']), Admin_Controller.create_team); //create team  by admin
router.get("/team", verifyToken, authRole(['ADMIN']), Admin_Controller.list_team)
router.get("/team/:_id/member",verifyToken, authRole(['ADMIN']), verifyToken, Admin_Controller.list_member);
router.patch("/team/:_id/member/add", verifyToken, authRole(['ADMIN']), Admin_Controller.add_member); 
router.patch("/team/:_id/member/remove", verifyToken, authRole(['ADMIN']), Admin_Controller.remove_member);

module.exports = router;