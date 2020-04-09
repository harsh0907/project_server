const mongoose = require('mongoose')

module.exports = mongoose.model('txn',{
    amount:{
        require:true,
        type: Number
    },
    txnid:{
        type:String,
        require:true
    },
    time:{
        require:true,
        type: String
    },
    merchantid:{
        require:true,
        type:mongoose.ObjectId ,
        default:null
    }
})