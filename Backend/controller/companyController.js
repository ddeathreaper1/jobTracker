const {User, Companies} = require("../model")

const addCompany = async(req,res)=>{
    try {
        const {companyName, companySize, industry, contactDetails, note} = req.body
        const userId = req.user.id

        await Companies.create({
            companyName:companyName,
            companySize:companySize,
            industry:industry,
            contactDetails:contactDetails,
            note:note,
            userId:userId
        })
        res.status(200).send("Company created")
    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong")
    }
}


const deleteCompany = async(req,res)=>{
    try {
        const {companyId} = req.body
        const userId = req.user.id
        const company = await Companies.destroy({where:{
            id:companyId,
            userId:userId
        }})

        if(!company){
            return res.status(404).send("Company not found")
        }

        res.status(200).send("Company deleted")
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}


const editCompany = async(req,res)=>{
    try {
        const {companyName, companySize, industry, contactDetails, note, companyId} = req.body
        const userId = req.user.id

        const [company] = await Companies.update({
            companyName:companyName,
            companySize:companySize,
            industry:industry,
            contactDetails:contactDetails,
            note:note,
            userId:userId
        },
        {where:{
            id:companyId, userId:userId
        }})

        res.status(200).send("Company edited")
    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong")
    }
}


const getCompanies = async(req,res)=>{
    try {
        const userId = req.user.id

        const companies = await Companies.findAll({
            where:{userId: userId},
            order:[["createdAt", "DESC"]]
        }
        )

        res.status(200).json(companies)
    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong")
    }
}

const getCompany = async(req,res)=>{
    try {
        const {companyId} = req.headers["companyId"]
        const userId = req.user.id
    
        const company = await Companies.findOne({where:{
            id:companyId,
            userId:userId
        }})
    
        res.status(200).json(company)
    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong")
    }
}


module.exports = {addCompany, deleteCompany, editCompany, getCompanies, getCompany}