const {User, Notes} = require("../model")


const addNote = async(req,res)=>{
    try {
        const {content, completed} = req.body
        const userId = req.user.id
    
        await Notes.create({
            content:content,
            userId:userId,
            completed:completed
        })

        res.status(200).send("Note created")
    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong")
    }
}


const updateNote = async(req,res)=>{
    try {
        const {content, noteId, completed} = req.body
        const userId = req.user.id
        const note = await Notes.findOne({where:{
            id:noteId,
            userId:userId
        }})

        if(!note){
            return res.status(404).send("Note not found")
        }

        const updatedNote = {
            content:content ?? note.content,
            completed:completed ?? note.completed
        }
        // console.log("Updating note",updatedNote)
        await note.update(updatedNote)
        // console.log("Note updated")
        res.status(200).send("Note updated")
    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong")
    }
}


const deleteNote = async(req,res)=>{
    try {
        const {noteId} = req.body
        const userId = req.user.id
        const note = await Notes.destroy({where:{
            id:noteId,
            userId:userId
        }})

        if(!note){
            return res.status(404).send("note not found")
        }

        res.status(200).send("Note deleted")
    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong")
    }
}


const getNotes = async(req,res)=>{
    try {
        const userId = req.user.id

        const notes = await Notes.findAll({where:{
            userId:userId,
        },
        order:[["createdAt","DESC"]]
    })

        res.status(200).json(notes)
    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong")
    }
}


module.exports = {addNote,deleteNote,updateNote,getNotes}