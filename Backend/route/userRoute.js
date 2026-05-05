const express = require("express")
const router = express.Router()
const userController = require("../controller/userController")
const authenticate = require("../middleware/auth")

router.post("/addUser",userController.addUser)
router.get("/getUser",authenticate, userController.getUser)
router.post("/validate", userController.validate)
router.get("/verifyUser", userController.verifyUser)
router.put("/updateUser",authenticate, userController.updateUser)

module.exports = router