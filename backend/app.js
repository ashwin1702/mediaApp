const express = require("express");

const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
if(process.env.NODE_ENV !=="production"){
    require("dotenv").config({path:"backend/config/config.env"})
}
// using middleware
app.use(express.json({limit:"50mb"})); 
app.use(express.urlencoded({limit:"50mb",extended:true}));//iski jagah bodyparsor bhi use krr skte hai
app.use(cookieParser());
//importing routes
const post = require("./routes/post");
const user = require("./routes/user")
//using routes
app.use("/api/v1",post);
app.use("/api/v1",user);


module.exports=app;