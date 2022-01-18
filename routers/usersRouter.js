const fs = require("fs");
const { validateUserExists, validateData, authenticateUser } = require("../userHelpers");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

router.get('/', (req, res, next) => {
    try {
        fs.readFile('./user.json',(err,data)=>{
            let allUsers = [];
            arr = JSON.parse(data);
            const age = req.query.age
            if(age){
                arr.filter(user=> {
                    if(user.age == req.query.age) allUsers.push({username: user.username})
                })
            }
            else
            {
                arr.forEach(user => {
                    allUsers.push({username: user.username})
                });
            }
            if(allUsers.length) return res.send(allUsers);
            next({ status: 404, message: `No users found with age = ${age}` });
        })
    } catch (error)
    {
        next({ status: 500, message: error.message });
    }
})

router.get('/:id', (req, res, next) => {
    try {
        fs.readFile('./user.json',(err,data)=>{
            arr = JSON.parse(data);
            arr.map(user=>{
                if(user.id == req.params.id) return res.send({username: user.username})
            })
            return next({ status: 404, message: "User not found" });
        })
    } catch (error)
    {
        next({ status: 500, message: error.message });
    }
})

router.patch('/:id', (req, res, next) => {
    try {
            fs.readFile('./user.json',(err,data)=>{
            arr = JSON.parse(data);
            const {username, password, age} = req.body
            let flag = 0
            const newUsers = arr.map(user=>{
                if(user.id == req.params.id)
                {
                    if(username) user.username = username
                    if(password) user.password = password
                    if(age) user.age = age
                    flag = 1
                }
                return user
            })
            fs.writeFile('./user.json', JSON.stringify(newUsers), err=>{
                return next(err);
            })
            if(flag) return res.send("Edited Successfully");
            return next({ status: 404, message: "User not found" });
        })
    } catch (error)
    {
        next({ status: 500, message: error.message });
    }
})

router.delete('/:id', (req, res, next) => {
    try{
        fs.readFile('./user.json',(err,data)=>{
            arr = JSON.parse(data);

            const newUsers = arr.filter(user=>user.id != req.params.id)
            fs.writeFile('./user.json', JSON.stringify(newUsers), err=>{
                return next(err);
            })
            if(newUsers.length == arr.length -1) return res.send("Deleted Successfully");
            return next({ status: 404, message: "User not found" });
        })
    } catch (error)
    {
        next({ status: 500, message: error.message });
    }
})

router.post("/", validateData, validateUserExists, async (req, res, next) => {
    try {
        const { username, password, age } = req.body;
        const data = await fs.promises
            .readFile("./user.json", { encoding: "utf8" })
            .then((data) => JSON.parse(data));
        const id = uuidv4();
        data.push({ id, username, password, age });
        await fs.promises.writeFile("./user.json", JSON.stringify(data), {
            encoding: "utf8",
        });
        res.send({ id, message: "sucess" });
    } catch (error) {
        next({ status: 500, message: error.message });
    }
});

router.post('/login', authenticateUser)
  

module.exports = router;
