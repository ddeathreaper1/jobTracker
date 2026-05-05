const express = require("express")
const router = express.Router()
const interviewController = require("../controller/interviewController")
const authenticate = require("../middleware/auth")

router.post("/addInterview",authenticate, interviewController.addInterview)
router.delete("/deleteInteriew", authenticate, interviewController.deleteInterview)
router.put("/editInterview",authenticate, interviewController.editInterview)
router.get("/getInterviews",authenticate, interviewController.getInterviews)
router.get("/getInterview",authenticate, interviewController.getInterview)

module.exports = router