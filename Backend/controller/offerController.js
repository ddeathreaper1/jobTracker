const {User, Offers} = require("../model")


const addOffer = async(req,res)=>{
    try {
        const {companyName, lastDate, post} = req.body
        const userId = req.user.id

        await Offers.create({
            companyName:companyName,
            lastDate:lastDate,
            userId:userId,
            post:post
        })

        return res.status(200).send("Offer created")
    } catch (error) {
        console.log(error)
        return res.status(500).send("Something went wrong")
    }
}




const deleteOffer = async(req,res)=>{
    try {
        const {offerId} = req.body
        const userId = req.user.id

        const offer = await Offers.destroy({
            where:{
                id:offerId,
                userId:userId
            }
        })

        if(!offer){
            return res.status(404).send("Offer not found")
        }

        return res.status(200).send("Offer deleted successfully")
    } catch (error) {
        console.log(error)
        return res.status(500).send("Something went wrong")
    }
}


const editOffer = async(req,res)=>{
    try {
        const {companyName, lastDate, post, offerId} = req.body
        const userId = req.user.id

        const [offer] = await Offers.update({companyName:companyName,lastDate:lastDate,userId:userId,post:post},{
            where:{
                id:offerId,
                userId:userId
            }
        })
    
        if (offer===0){
            return res.status(404).send("Offer not found")
        }
    
        return res.status(200).send("Offer updated")
    } catch (error) {
        console.log(error)
        return res.status(500).send("Something went wrong")
    }


}

const getOffers = async(req,res)=>{
    try {
        const userId = req.user.id

        const offers = await Offers.findAll({
            where:{userId:userId},
            order:[['lastDate','DESC']]
        });
    
        res.status(200).json(offers)
    } catch (error) {
        console.log(error)
        return res.status(500).send("something went wrong")
    }

}


const getOffer = async(req,res)=>{
    try {
        const offerId = req.headers['offerId']
        const userId = req.user.id
        const offer = await Offers.findOne({
            where:{
                id:offerId,
                userId:userId
            }
        })
        if(!offer){
            return res.status(404).send("Offer not found")
        }

        return res.status(200).json(offer)
    } catch (error) {
        console.log(error)
        return res.status(500).send("Something went wrong")
    }
}

module.exports = {addOffer, deleteOffer, editOffer, getOffers, getOffer}