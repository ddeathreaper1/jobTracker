const {User, Interview} = require("../model")


const addInterview = async(req,res)=>{
    try {
        const {companyName, interviewDate, post} = req.body
        const userId = req.user.id

        await Interview.create({
            companyName:companyName,
            interviewDate:interviewDate,
            userId:userId,
            post:post
        })

        return res.status(200).send("Interview created")
    } catch (error) {
        console.log(error)
        return res.status(500).send("Something went wrong")
    }
}




const deleteInterview = async(req,res)=>{
    try {
        const {interviewId} = req.body
        const userId = req.user.id

        const interview = await Interview.destroy({
            where:{
                id:interviewId,
                userId:userId
            }
        })

        if(!interview){
            return res.status(404).send("Interview not found")
        }

        return res.status(200).send("Interview deleted successfully")
    } catch (error) {
        console.log(error)
        return res.status(500).send("Something went wrong")
    }
}


const editInterview = async(req,res)=>{
    try {
        const {companyName, interviewDate, post, interviewId} = req.body
        const userId = req.user.id

        const [interview] = await Interview.update({companyName:companyName,interviewDate:interviewDate,userId:userId,post:post},{
            where:{
                id:interviewId,
                userId:userId
            }
        })
    
        if (interview===0){
            return res.status(404).send("Interview not found")
        }
    
        return res.status(200).send("Interview updated")
    } catch (error) {
        console.log(error)
        return res.status(500).send("Something went wrong")
    }


}

const getInterviews = async(req,res)=>{
    try {
        const userId = req.user.id

        const interviews = await Interview.findAll({
            where:{userId:userId},
            order:[['interviewDate','ASC']]
        });
    
        res.status(200).json(interviews)
    } catch (error) {
        console.log(error)
        return res.status(500).send("something went wrong")
    }

}


const getInterview = async(req,res)=>{
    try {
        const interviewId = req.headers['interviewId']
        const userId = req.user.id
        const interview = await Interview.findOne({
            where:{
                id:interviewId,
                userId:userId
            }
        })
        if(!interview){
            return res.status(404).send("Interview not found")
        }

        return res.status(200).json(interview)
    } catch (error) {
        console.log(error)
        return res.status(500).send("Something went wrong")
    }
}

module.exports = {addInterview, deleteInterview, editInterview, getInterviews, getInterview}