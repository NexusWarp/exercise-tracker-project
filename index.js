const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
});
const userModel = mongoose.model("/user", userSchema);
const exerSchema = new mongoose.Schema({
  username: {type:mongoose.Schema.Types.ObjectId, ref:userModel} ,
  description: { type: String, required: true },
  duration:{ type: Number, required: true },
  date:Date
});
const exerModel = mongoose.model("exercise",exerSchema);

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  let newUsername = req.body.username;
  const newUser = new userModel({
    username: newUsername,
  });
  newUser.save().then((data) => {
    res.json({ username: `${data.username}`, _id: `${data._id.toString()}` });
  });
});

app.get("/api/users", (req, res) => {
  userModel
    .find()
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      res.json({ error: err });
    });
});

let date;
app.post("/api/users/:_id/exercises", (req, res) => {
  if (req.body.date == "") {
    date = new Date();
  } else {
    date = new Date(req.body.date);
  }
  let id = req.body[":_id"];

  userModel
    .findById(id)
    .then((data) => {
      const newExer = new exerModel({
        username: id,
        description:req.body.description,
        duration:req.body.duration,
        date:date.toDateString()
      })
      newExer.save().then(data=>{

        res.json({
          _id: "id here",
          username: "irfan032",
          date: `${date.toDateString()}`,
          duration: 25,
          description: "asad",
        });
      });
    })
      
    .catch((err) => {
      console.error(err);
    });
});

mongoose
  .connect("mongodb://localhost:27017/exerciseTracker")
  .then((result) => {
    console.log("connected to database");
    const listener = app.listen(process.env.PORT || 3000, () => {
      console.log("Your app is listening on port " + listener.address().port);
    });
  })
  .catch((err) => {
    console.error(err);
  });
