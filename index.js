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
  username: { type: mongoose.Schema.Types.ObjectId, ref: userModel },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: Date,
});
const exerModel = mongoose.model("exercise", exerSchema);

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
    .then((reslt) => {
      const newExer = new exerModel({
        username: id,
        description: req.body.description,
        duration: req.body.duration,
        date: date,
      });
      newExer
        .save()
        .then((data) => {
          res.json({
            _id: id,
            username: reslt.username,
            date: `${date.toDateString()}`,
            duration: data.duration,
            description: data.description,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })

    .catch((err) => {
      console.error(err);
    });
});

app.get("/api/users/:_id/logs", (req, res) => {
  let id = req.params["_id"];
  console.log(id);
  userModel.findById(id).then((user) => {
    exerModel.find({username:id}).then(data=>{
      console.log(data);
      let obj ={};
      let array = [];
      data.forEach(elem =>{
        obj.description = elem.description,
        obj.duration = elem.duration,
        obj.date = elem.date.toDateString();
        array.push(obj);
      })
      let count = data.length;



      res.json({ _id: id, username: user.username, "count": count,"log":array });
      
    })
    console.log(user);
  }).catch(err=>{
    console.log(err);
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
    console.log("connected to database");
    const listener = app.listen(process.env.PORT || 3000, () => {
      console.log("Your app is listening on port " + listener.address().port);
    });
  })
  .catch((err) => {
    console.error(err);
  });
