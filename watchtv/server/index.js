require('dotenv').config();
const express = require('express');
const app = express();
const cors =require('cors')

app.use(cors())

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use((req,res,next)=>{
  console.log("Hello from the middleware");
  next();
});

app.get("/",(req,res)=>{
  res.send("Hello");

});

app.get("/profile",(req,res)=>{
  res.send("Hello from profile");

});
app.get("/profile/:username",(req,res)=>{
  res.send(`My name is ${req.params.username}`);
})

