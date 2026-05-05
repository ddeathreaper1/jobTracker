const {User, ApplyLater} = require("../model")

const addApplyLater = async(req,res)=>{
    try {
        const {companyName, applyLink} = req.body
        const userId = req.user.id

        await ApplyLater.create({
            companyName:companyName,
            applyLink:applyLink,
            applied:false,
            userId:userId
        })
        res.status(200).send("ApplyLater created")
    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong")
    }
}


const deleteApplyLater = async(req,res)=>{
    try {
        const {applyLaterId} = req.body
        const userId = req.user.id
        const applyLater = await ApplyLater.destroy({where:{
            id:applyLaterId,
            userId:userId
        }})

        if(!applyLater){
            return res.status(404).send("ApplyLater not found")
        }

        res.status(200).send("Apply Later deleted")
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}


const editApplyLater = async(req,res)=>{
    try {
        const {companyName, applyLink, applied, id} = req.body
        const userId = req.user.id

        const [applyLater] = await ApplyLater.update({
            companyName:companyName,
            applyLink:applyLink,
            applied: applied,
        },{
            where:{
                id:id, userId:userId
            }
        })
        if(applyLater === 0){
            return res.status(404).send("Apply later not found")
        }
        res.status(200).send("Apply Later edited")
    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong")
    }
}


const getApplyLaters = async(req,res)=>{
    try {
        const userId = req.user.id

        const applyLaters = await ApplyLater.findAll({
            where:{userId: userId},
            order:[["createdAt", "DESC"]]
        }
        )

        res.status(200).json(applyLaters)
    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong")
    }
}

const getApplyLater = async(req,res)=>{
    try {
        const {applyLaterId} = req.headers["applyLaterId"]
        const userId = req.user.id
    
        const applyLater = await ApplyLater.findOne({where:{
            id:applyLaterId,
            userId:userId
        }})
    
        res.status(200).json(applyLater)
    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong")
    }
}


module.exports = {addApplyLater,deleteApplyLater,editApplyLater,getApplyLater,getApplyLaters}