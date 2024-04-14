const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username:String
});


const userModel = mongoose.model("/user",userSchema);

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users",(req,res)=>{
  let newUsername = req.body.username;
  const newUser = new userModel({
    username: newUsername
  })
  newUser.save().then(data =>{
    res.json({"username":`${data.username}`,"_id":`${data._id.toString()}`})
   
  });

})

app.get("/api/users",(req,res)=>{
  userModel.find().then(data=>{
    console.log(data);
    res.send(data)
  }).catch(err=>{
    res.json({error:err})
  })
})


app.post("/api/users/:_id/exercises",(req,res)=>{
let date = new Date();

res.json({"_id":"id here","username":"irfan032","date":`${date}`,"duration":25,"description":"asad"})
})



mongoose.connect("mongodb://localhost:27017/exerciseTracker").then(result=>{
  console.log("connected to database");
  const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
  })

}).catch(err=>{
  console.error(err);
})
