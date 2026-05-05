const express = require("express")
const router = express.Router()
const companyController = require("../controller/companyController")
const authenticate = require("../middleware/auth")

router.post("/addCompany",authenticate, companyController.addCompany)
router.delete("/deleteCompany", authenticate, companyController.deleteCompany)
router.put("/editCompany",authenticate, companyController.editCompany)
router.get("/getCompanies",authenticate, companyController.getCompanies)
router.get("/getCompany",authenticate, companyController.getCompany)

module.exports = router