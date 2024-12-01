const express = require('express');

const app = express();

/*app.use((req, res) => {
  res.send("Hello from server");
});*/
app.use("/test",(req, res) => {
    res.send("Hello from server1");
  });

  app.use("/hello",(req, res) => {
    res.send("Hello");
  });
app.listen(7777, () =>{
    console.log("server is successfully listening on port 3000");
});