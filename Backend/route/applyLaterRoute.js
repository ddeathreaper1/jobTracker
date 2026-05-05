const express = require("express")
const router = express.Router()
const applyLaterController = require("../controller/apppyLaterController")
const authenticate = require("../middleware/auth")

router.post("/addApplyLater",authenticate, applyLaterController.addApplyLater)
router.delete("/deleteApplyLater", authenticate, applyLaterController.deleteApplyLater)
router.put("/editApplyLater",authenticate, applyLaterController.editApplyLater)
router.get("/getApplyLaters",authenticate, applyLaterController.getApplyLaters)
router.get("/getApplyLater",authenticate, applyLaterController.getApplyLater)

module.exports = router