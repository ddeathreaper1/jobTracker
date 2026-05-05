const express = require("express")
const router = express.Router()
const applicationController = require("../controller/applicationController")
const authenticate = require("../middleware/auth")
const multer = require("multer")
const upload = multer()

router.post("/addApplication",authenticate,upload.single("attachments"), applicationController.addApplication)
router.delete("/deleteApplication", authenticate, applicationController.deleteApplication)
router.put("/editApplication",authenticate, applicationController.editApplication)
router.get("/getApplications",authenticate, applicationController.getApplications)
router.get("/getApplication",authenticate, applicationController.getApplication)

module.exports = router