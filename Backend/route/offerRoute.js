const express = require("express")
const router = express.Router()
const offerController = require("../controller/offerController")
const authenticate = require("../middleware/auth")

router.post("/addOffer",authenticate, offerController.addOffer)
router.delete("/deleteOffer", authenticate, offerController.deleteOffer)
router.put("/editOffer",authenticate, offerController.editOffer)
router.get("/getOffers",authenticate, offerController.getOffers)
router.get("/getOffer",authenticate, offerController.getOffer)

module.exports = router