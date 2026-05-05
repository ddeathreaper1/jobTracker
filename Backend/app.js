const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
require("./model")
const db = require("./config/dbConnection")
const userRoute = require("./route/userRoute")
const interviewRoute = require("./route/interviewRoute")
const applicationRoute = require("./route/applicationRoute")
const offerRoute = require("./route/offerRoute")
const noteRoute = require("./route/noteRoute")
const companyRoute = require("./route/companyRoute")
const applyLaterRoute = require("./route/applyLaterRoute")

app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
    res.status(200).send("Backend is running")
})

app.use("/user",userRoute)
app.use("/interviews",interviewRoute)
app.use("/applications",applicationRoute)
app.use("/offers",offerRoute)
app.use("/notes", noteRoute)
app.use("/companies",companyRoute)
app.use("/applyLater",applyLaterRoute)

db.sync().then(()=>{
    app.listen(process.env.PORT || 3000,()=>{
        console.log("Server is running")
    })
}).catch((err)=>{
    console.log(err)
})
