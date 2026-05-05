const bcrypt = require("bcrypt")
const User = require("../model/user")
const jwt = require("jsonwebtoken")


function generateToken(id){
    return jwt.sign({id: id}, process.env.AUTH_SECRET_KEY)
}

const addUser = async (req,res)=>{
    try {
     
    const {name, email, phone, password} = req.body
    const saltRounds = 10

    const hash = await bcrypt.hash(password,saltRounds)
    await User.create({
        name:name,
        email:email,
        phoneno:phone,
        password:hash
    })   

    console.log("User is created")
    res.status(200).send("User created successfully")
    } catch (error) {
        res.status(500).send(error)
     console.log(error)   
    }
}


const validate = async (req,res)=>{
    try {
        const {identifier,password} = req.body

        let user
        if (identifier.includes("@")){
            user = await User.findOne({where:{email:identifier}})
        }else{
            user = await User.findOne({where:{phoneno: identifier}})
        }
        if(!user){
            return res.status(404).json({message:"Error:404 User not found"})
        
        }
        id = user.id

        bcrypt.compare(password, user.password, (err,result)=>{
            if (err){
                return res.status(400).json("Something went wrong")
            }
            if (result){
                return res.status(200).json({message:"User logged in succesfully", id: id, token: generateToken(user.id), phone: user.phoneno})
            }else{
                return res.status(401).json({message:"Password is incorrect"})
            }
        })      
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}



const updateUser = async(req,res)=>{
    try {
        const {name, email, phone, pass} = req.body
        const userId = req.user.id
    
        const user = await User.findByPk(userId)
        if(!user){
            return res.status(404).send("User not found")
        }
    
        const updatedFields = {
            name:name,
            email:email,
            phoneno:phone
        }
    
        if(pass){
            const saltRounds = 10
            updatedFields.password = await bcrypt.hash(pass, saltRounds)
        }
    
        await user.update(updatedFields)
    
        res.status(200).send("User updated")
    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong")
    }


}



const getUser = async(req,res)=>{
    try {
        const userId = req.user.id

        const user = await User.findByPk(userId)
        if(!user){
            return res.status(404).send("User not found")
        }

        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong")
    }

}

const verifyUser = async (req,res)=>{
    try {
     
    const authHeader = req.headers['authorization']
    
    if(!authHeader){
        return res.status(403).send("No token found")
    }

    const token = authHeader.split(' ')[1]
    // console.log(token)

    if (!token){
        return res.status(403).send("No token found")
    }

    const decryptedToken = jwt.verify(token,process.env.AUTH_SECRET_KEY)
    // console.log(decryptedToken)
    const userId = decryptedToken.id

    const user = await User.findByPk(userId)

    if (!user){
        return res.status(403).send("No user found")
    }

    return res.status(200).send("User is valid")   
    } catch (error) {
     return res.status(401).send("Something went wrong")   
    }
}

module.exports = {addUser,validate, verifyUser, updateUser, getUser}