require('dotenv').config()
const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const userRouter = require('./routers/usersRouter')
const {logRequest} = require('./generalHelpers')
const { v4: uuidv4 } = require("uuid");


app.use(bodyParser.json())

/*
https://www.youtube.com/playlist?list=PLdRrBA8IaU3Xp_qy8X-1u-iqeLlDCmR8a
Fork the project 
git clone {url}
npm i


Create server with the following end points 
POST /users with uuid, unique username  >>>
PATCH /users/id >>>
GET /users with age filter >>>
Create Error handler >>>
POST /users/login /sucess 200 , error:403 >>
GET /users/id   200,   eror:404 >>>
DELETE users/id  200,    error:404
complete middleware for validating user >>>
Create Route For users >>>

Bonus
Edit patch end point to handle the sent data only >>>
If age is not sent return all users >>>

Lab 5: 
user database instead of files >>>
user jwt to authenticate users after login  >>>
check if the user delete/patch/get his own document >>>
check if user who use GET /users is authenticated >>>

git add .
git commit -m "message"
git push
*/

app.use("/users", userRouter);

app.use(logRequest)


app.use((err,req,res,next)=>{
  res.status(err.status).send(err)
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})