require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const app = express()

app.use(express.json())

groupSchema = mongoose.Schema

const newGroup = new groupSchema({

    groupname:{type: String},
    user_id:{type: String},
    is_owner:{type: Boolean}

})

const group = mongoose.model('newGroup', newGroup)


//create new group
app.post('/', async (req, res) => {
    console.log(req.body)
    try{
      const createGroup = await group.create(req.body)
    }catch(error){
      console.log({error: error.message})
    }
  
  })

  //add new user to group
  app.patch('/user_id', async (req, res) => {
    console.log(req.body)
    try{
      const newUser = await users.create(req.body)
    }catch(error){
      console.log({error: error.message})
    }
  
  })

  //user leaves group
  app.delete('/user_id', async (req, res) => {
    console.log(req.body)
    try{
      const leaveGroup = await group.deleteOne(req.body)
    }catch(error){
      console.log({error: error.message})
    }
  
  })

  //user deletes group

  app.delete('/', async (req, res) => {
    console.log(req.body)
    try{
      const deleteGroup = await group.delete(req.body)
    }catch(error){
      console.log({error: error.message})
    }
  
  })

  mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("connected to db and listening on port ", process.env.PORT)
    })
  })
    .catch((error) => {
      console.log({error:error.message})
    })