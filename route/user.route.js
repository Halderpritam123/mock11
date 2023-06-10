const express=require('express')
const { UserModel } = require('../model/user.model')
const router=express.Router()
var jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth.middleware');
const bcrypt = require('bcrypt');
router.get('/',(req,res)=>{
    res.status(200).send({"msg":"welcome to user page"})
})
router.post('/register',async(req,res)=>{
    const {name,email,password}=req.body
    try {
        bcrypt.hash (password, 5, async(err, hash)=>{
            if(err){
                 res.status(500).send({"msg":"register failed"})
            }
            const user=new UserModel({name,email,password:hash})
            await user.save()
        });
        res.status(200).send({"msg":"New User Added"})       
    } catch (error) {
        res.status(400).send({"msg":error.msg})
    }
})
router.post('/login',async(req,res)=>{
    const {email,password}=req.body
    try {
        const user= await UserModel.findOne({email})
        // console.log(user)
        if(user){
            bcrypt.compare(password, user.password, (err, result)=>{
                if(result){
                    const token = jwt.sign({memberId:user._id,member:user.email}, 'pritam');
                    res.status(200).send({"msg":"Login Successfull","token":token})
                }else{
                    res.status(200).send({"msg":"Wrong Credential"})
                }
            });
        }else{
            res.status(200).send({"msg":"Wrong Credential"})
        }
    } catch (error) {
        res.status(400).send({"msg":error.msg})
    }
})

router.get('/profile',async(req,res)=>{
    try {
        const user=await UserModel.find({email:req.body.email})
    res.send(user)
    } catch (error) {
        console.log(error)
    }
})
router.post('/logout', (req, res) => {
    const token = req.headers.authorization;
    // console.log(token)
    jwt.verify(token, 'pritam', (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: 'Invalid token' });
        }
        delete req.headers.authorization;
    
        res.json({ message: 'Logged out successfully' });
      });

  })

module.exports={router}
