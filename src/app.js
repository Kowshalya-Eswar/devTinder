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

const express = require('express');

const app = express();
const {adminAuth} = require('./middleware/auth');
app.use("/user",
   [ (req,res, next) => {
    console.log("Handlinf the route user");
    next();
   // res.send("Response");
},
(req,res, next) => {
    console.log("Handling the route user2");
    //res.send("2nd response");
    next();
},
(req,res, next) => {
  console.log("Handling the route user2");
  //res.send("3rd response");
  next();
}],
(req,res, next) => {
  console.log("Handling the route user2");
  res.send("4th response");
 // next();
});
app.listen(7777, () =>{
    console.log("server is successfully listening on port 7777");
});

app.use("/admin",adminAuth,(req,res,next)=>{
  console.log("test");
  next();
});

app.get("/admin/User",(req,res)=> {
  res.send("adminuser");
});
app.use("/userError",(req,res)=> {
 /* try {
    throw newError("test");
  } catch (e) {
    res.status(500).send("something went wrong1");
  }*/
  //res.send("rr");
  throw newError("test");
});
app.use("/",(err,req,res,next)=> {
  if(err) {
    res.status(500).send("something went wrong");
  }
});

