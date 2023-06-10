const mongoose=require('mongoose')
const emiSchema=mongoose.Schema({
    emi: {type: Number, required: true},
    interestPayable: {type: Number, required: true},
    totalPayment:{type: Number, required: true},
    memberId:{type: String, required: true},
    member: {type: String, required: true},
},{
    versionKey:false
})
const EmiModel=mongoose.model("emis",emiSchema)
module.exports={EmiModel}