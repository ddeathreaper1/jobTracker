const express = require("express")
const router = express.Router()
const noteController = require("../controller/notesController")
const authenticate = require("../middleware/auth")

router.post("/addNote",authenticate, noteController.addNote)
router.delete("/deleteNote", authenticate, noteController.deleteNote)
router.put("/editNote",authenticate, noteController.updateNote)
router.get("/getNotes",authenticate, noteController.getNotes)

module.exports = router