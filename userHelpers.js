const fs = require('fs')
// some
// find
const validateUserExists = async (req, res, next) =>{
    try {
        const {username , password} = req.body;
        const data = await fs.promises.readFile('./user.json',{encoding:'utf8'})
        const users = JSON.parse(data)
        const isUsernameExists = users.some(user=>user.username===username)
        if(isUsernameExists && req.method == "POST") return next({status:422, message:"username is used"})
        next()
    } catch (error) {
        next({status:500, message:error.message})
    }
}

const validateData = (req, res, next) =>{
    const {username , password, age} = req.body;
    if(!username) return next({status:400, message:"Username is required"})
    else if(!password) return res.send({status:400, message:"Password is required"})
    else if(!age) return next({status:400, message:"Age is required"})
    next()
}

const authenticateUser = (req, res, next) => {
    fs.readFile('./user.json',(err,data)=>{
        arr = JSON.parse(data)
        const flag = arr.find(user=> (user.username == req.body.username) && (user.password == req.body.password))
        if(!flag)
        {
            return next({status:403, message:"Username, Password or both are incorrect"})
        }
        return res.status(200).send({message:"Logged in Successfully"}) 
    })  
}


module.exports = {
    validateUserExists,
    validateData,
    authenticateUser
}