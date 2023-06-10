const express=require('express');
const { EmiModel } = require('../model/emi.model');
const emiRoute=express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
emiRoute.post('/calculate',async(req,res) => {
    const { loanAmount,annualInterestRate,tenureInMonths }=req.body;
    // console.log(req.body)
    const monthlyInterestRate=annualInterestRate/12/100;
    const up=loanAmount*monthlyInterestRate*Math.pow(1 + monthlyInterestRate,tenureInMonths);
    const down =Math.pow(1+monthlyInterestRate, tenureInMonths) - 1;
    const emi = up/down;
    const interestPayable = emi * tenureInMonths - loanAmount;
    const totalPayment=emi*tenureInMonths;
   const emiVal=new EmiModel({
    emi: emi.toFixed(2),
    interestPayable: interestPayable.toFixed(2),
    totalPayment: totalPayment.toFixed(2),
    "memberId":req.body.memberId,
    "member":req.body.member
  })
    await emiVal.save()
    res.send({
      emi: emi.toFixed(2),
      interestPayable: interestPayable.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
    });
  });
  emiRoute.get('/',async(req,res) => {
        try {
            const userEmi=await EmiModel.find({memberId:req.body.memberId})
        res.send(userEmi)
        } catch (error) {
            console.log(error)
        }
  })
//   emiRoute.post('/logout', (req, res) => {
//     const token = req.headers.authorization;
//     // console.log(token)
//     jwt.verify(token, 'pritam', (err, decoded) => {
//         if (err) {
//           return res.status(401).json({ message: 'Invalid token' });
//         }
//         delete req.headers.authorization;
    
//         res.json({ message: 'Logged out successfully' });
//       });

//   })
  module.exports={emiRoute}