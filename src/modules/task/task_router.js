const router = require("express").Router();
const verifyToken = require("../../middlewares/authJwt");
const { authRole } = require('../../middlewares/authRole');
const Task_Controller = require("./task_controller");
const {
    validateCreateTask,
    validateEditTask,
    validateAssignTask,
    validateStatusUpdate,
} = require("./task_validator")

//ADMIN HAVE BYDEFAULT ACCESS TO ALL endpoints
// task management
router.post("/",validateCreateTask, verifyToken, authRole(['MANAGER']), Task_Controller.create_task); // by admin and manager
router.get("/", verifyToken, authRole(['MANAGER',"USER"]), Task_Controller.get_tasks); /// different task for user and manager
router.put("/:_id", validateEditTask,verifyToken, authRole(['MANAGER']), verifyToken, Task_Controller.edit_task); 
router.get("/:_id", verifyToken, authRole(['MANAGER',"USER"]), Task_Controller.get_task_detail);
router.delete("/:_id", verifyToken, authRole(['ADMIN']), Task_Controller.delete_task);

router.put("/status/:_id", validateStatusUpdate, verifyToken, authRole(['USER','MANAGER']), Task_Controller.change_status);  // for user manager and admin
// task assignment

router.put("/assign/:_id", validateAssignTask, verifyToken, authRole(['MANAGER']), Task_Controller.assign_task); // role admin or manager



module.exports = router;