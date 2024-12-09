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
const cookieParser = require("cookie-parser");
const {validateData} = require('./utils/validation');
const {userAuth} = require('./middleware/auth');
const bcrypt = require('bcrypt');
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
app.use(express.json()); //run for every requests, converts the requests to js object 
app.use(cookieParser());
app.post("/signup", async (req,res) => {
  //create new instance of user modal
  const UserObj = req.body;
  const {firstName, lastName, gender, emailId, password, age} = req.body;
 // console.log(UserObj);
  const user = new User(UserObj);
  
  try {
    validateData(UserObj);
    const passwordHash = await bcrypt.hash(password,10);
    console.log(passwordHash);
    const user = new User({
      firstName,
      lastName,
      gender,
      emailId,
      age,
      password: passwordHash
    });
    await user.save();
    res.send("User Added successfully");
  } catch(err) {
    res.status(400).send("error saving user:"+ err.message);
  }

})

app.post("/user", async(req,res) => {

  try {
    const userEmail = req.body.emailId;
    console.log(userEmail);
    const user = await User.findOne({emailId:userEmail});
    if(!user) {
      res.status(404).send('user not found');
    } else {
      res.send(user);
    }
  } catch(err) {
    res.status(400).send('something went wrong..' +err.message);
  }
});

//Feed API - GET /feed - get all the data
app.get("/feed", async(req,res) => {
  
  try {
    const user = await User.find({});
      res.send(user);
    }
  catch(err) {
    res.status(400).send('something went wrong..' +err.message);
  }
});

app.delete('/deleteUser', async(req,res) => {
  try {
    const userId = req.body.userId;
    const id = await User.findByIdAndDelete({_id:userId});
    //const id = await User.findByIdAndDelete(userId); //same as above
    res.send("user deleted successfully");
  }  catch(err) {
    res.status(400).send('something went wrong..' +err.message);
  }
})

app.patch('/updateUser/:emailId',async(req,res)=>{
  try {
    const emailId = req.params?.emailId;
    data = req.body;
    const ALLOWED_UPDATES = ['userId','photoURL','gender','skills','age'];
    const isUpdateAllowed = Object.keys(data).every((k) => 
      ALLOWED_UPDATES.includes(k)
    );
    if(!isUpdateAllowed) {
      throw new Error("update not allowed");
    }
    if(data?.skills.length() > 10) {
      throw new Error("skills should not greater than 10");
    }
   /* userbefore = await User.findByIdAndUpdate({_id: userId},data, {
      returnDocument: "before"
    });*/
    userbefore = await User.findOneAndUpdate({emailId: emailId},data, {
      returnDocument: "before",
      runValidators:true
    });
    console.log(userbefore);
    res.send("user updated successfully");
  } catch(err) {
    res.status(400).send('something went wrong..' +err.message);
  }
})

app.post("/login", async(req,res) => {
  const {emailId, password} = req.body;

  try {

      const user = await User.findOne({emailId: emailId});
      if (!user) {
        throw new Error('Invalid credentials');
      }
      const isPasswordValid = await user.isPasswordValidate(password);
      if (!isPasswordValid) {
       
        throw new Error('Invalid credentials');
      } else {
        const token = await user.getJWT();
        res.cookie("token",token, {expires: new Date(Date.now() +8 * 360000)} );
        res.send("Login succesfull");
      }
    }
  catch(err) {
    res.status(400).send('something went wrong..' +err.message);
  }
});

app.post("/profile", userAuth, async(req,res) => {
 
  try {
      const user = req.user
      res.send(user);
  }
  catch(err) {
    res.status(400).send('something went wrong..' +err.message);
  }
});

app.post("/sendingConnectionRequest", userAuth, async(req,res) => {
   res.send(req.user.firstName+ " sending connection request");
});