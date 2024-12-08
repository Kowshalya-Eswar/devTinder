/*const express = require('express');

const app = express();

/* app.use("/user",(req, res) => {
    res.send("general user, if we use first it overrides all the differnt get, post, delete");
  }); */
/* app.get("/user",(req, res) => {
   console.log(req.query);
    res.send("get user");
  }); */
 /* app.get("/user/:userid/:password",(req, res) => {
    console.log(req.params);
     res.send("get user");
   });
  app.post("/user",(req, res) => {
    res.send("post user");
  });
  app.delete("/user",(req, res) => {
    res.send("delete user");
  });

app.use("/t(es)?t",(req, res) => {
    res.send("test regex");
  });

/* app.use("/test",(req, res) => {
    res.send("Hello from server1");
  }); */
 /* app.use("/hello/2",(req, res) => {
    res.send("Hello2");
  });
  app.use("/hello",(req, res) => {
    res.send("Hello");
  });

/*   app.use("/",(req, res) => {
    res.send("Hello from server");
  }); */
/*app.listen(7777, () =>{ 
    console.log("server is successfully listening on port 7777");
});*/

const mongoose = require("mongoose");

const express = require('express');

const User = require("./models/user");
const app = express();

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://kowsiganeshan:test123@cluster0.wsbnn.mongodb.net/devTinder");
};

connectDB()
.then(() => {
  console.log("database connected");
  app.listen(7777, () =>{
      console.log("server is successfully listening on port 7777");
  });    
})
.catch((err) => {
  console.log("database not connected");
});

app.post("/signup", async (req,res) => {
  const UserObj = req.body;

  const user = new User(UserObj);
  try {
    await user.save();
    res.send("User Added successfully");
  } catch(err) {
    res.status(400).send("error saving user:"+ err.message);
  }

})

