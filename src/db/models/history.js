const mongoose = require('mongoose')

module.exports = mongoose.model('history',{
    custid:{
        require:true,
        type:mongoose.ObjectId,
        default:null 
    },
    mechaid:{
        require:true,
        type:mongoose.ObjectId,
        default:null
    },
    requesttime:{
        require:true,
        type: Number,
        default:null
    },
    arrivaltime:{
        require:true,
        type: Number,
        default:null
    },
    destinationtime:{
        require:true,
        type:Number,
        default:null
    },
    donetime:{
        require:true,
        type:Number,
        default:null
    },
    orgamechaid: {
        require:true,
        type:mongoose.ObjectId,
        default:null
    },
    typeofvehicle:{
        require:true,
        type:String,
        default:null
    },
    originalamount:{
        require:true,
        type:Number,
        default:0
    },
    paycomplete:{
        require:true,
        type:Boolean,
        default:false
    },
    chargingfee:{
        require:true,
        default:0,
        type:Number
    },
    cencelbycustomer:{
        require:true,
        type:Boolean,
        default:false
    },
    cencelbyorgamecha:{
        require:true,
        type:Boolean,
        default:false
    },
    cencelbymecha:{
        require:true,
        type:Boolean,
        default:false
    },
    cenceltime:{
        require:true,
        type:Number,
        default:null
    },
    longitude:{
        require:true,
        type:Number
    },
    latitude:{
        require:true,
        type:Number
    },
    relese:{
        type: Boolean,
        default: false
    },
    feedback:{
        type:Number,
        default:0,
        require:true
    }

})