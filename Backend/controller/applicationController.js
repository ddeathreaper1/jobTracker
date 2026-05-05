const {User, Application} = require("../model")
const AWS = require("aws-sdk")


function uploadToS3(data, filename, mimetype){
    const BUCKET_NAME = process.env.AWS_BUCKET_NAME
    const IAM_USER_KEY = process.env.AWS_IAM_USER_KEY
    const IAM_USER_SECRET = process.env.AWS_IAM_USER_SECRET


    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        region: 'ap-south-2'
    })

    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ContentType: mimetype,
        ACL: 'public-read',
        ContentDisposition: 'attachment; filename="document.pdf"'
    }

    return new Promise((resolve,reject)=>{

        s3bucket.upload(params, (err,s3response)=>{
            if(err){
                console.log("Something went wrong")
                reject(err)
            }else{
                // console.log('success',s3response)
                resolve(s3response.Location)
            }
        })

    })
    

}


const addApplication = async(req,res)=>{
    try {
        const {companyName, applyDate, post, note, status} = req.body
        const userId = req.user.id

        let attachmentURL = null

        if (req.file){
            const extension = req.file.originalname.split(".").pop()
        const filename = `${userId}/${Date.now()}.pdf`
        attachmentURL = await uploadToS3(req.file.buffer, filename, req.file.mimetype)
        }


        await Application.create({
            companyName:companyName,
            applyDate:applyDate,
            userId:userId,
            post:post,
            note:note,
            status:status,
            attachments:attachmentURL
        })

        return res.status(200).send("Application created")
    } catch (error) {
        console.log(error)
        return res.status(500).send("Something went wrong")
    }
}




const deleteApplication = async(req,res)=>{
    try {
        const {applicationId} = req.body
        const userId = req.user.id

        const application = await Application.destroy({
            where:{
                id:applicationId,
                userId:userId
            }
        })

        if(!application){
            return res.status(404).send("Application not found")
        }

        return res.status(200).send("Application deleted successfully")
    } catch (error) {
        console.log(error)
        return res.status(500).send("Something went wrong")
    }
}


const editApplication = async(req,res)=>{
    try {
        const {applicationId, ...updateData } = req.body
        const userId = req.user.id

        const [application] = await Application.update(updateData,
            {
                where:{
                    id:applicationId,
                    userId:userId
                }
            })
    
        if (application===0){
            return res.status(404).send("Application not found")
        }
    
        return res.status(200).send("Application updated")
    } catch (error) {
        console.log(error)
        return res.status(500).send("Something went wrong")
    }


}

const getApplications = async(req,res)=>{
    try {
        const userId = req.user.id

        const applications = await Application.findAll({
            where:{userId:userId},
            order:[['applyDate','DESC']]
        });
    
        res.status(200).json(applications)
    } catch (error) {
        console.log(error)
        return res.status(500).send("something went wrong")
    }

}


const getApplication = async(req,res)=>{
    try {
        const {applicationId} = req.query
        const userId = req.user.id
        const application = await Application.findOne({where:{
            id:applicationId,
            userId:userId
        }})
        if(!application){
            return res.status(404).send("Application not found")
        }

        return res.status(200).json(application)
    } catch (error) {
        console.log(error)
        return res.status(500).send("Something went wrong")
    }
}

module.exports = {addApplication, deleteApplication, editApplication, getApplications, getApplication}