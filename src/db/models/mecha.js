const mongoose = require('mongoose')

module.exports = mongoose.model('mecha',{
    name:{
        require:true,
        type: String
    },
    email:{
        type:String,
        require:true,
        unique: true
    },
    mobileno:{
        require:true,
        type: Number,
        unique:true,
        validate(value) {
              if(!(value>=1000000000 && value<=9999999999))
                throw new Error("mobile no should be in 10 digits")
               
        }

    },
    Address:{
        type:String
    },
    latitude:{
        require:true,
        type: Number
    },
    longitude:{
        require:true,
        type:Number
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    },
    Organization:{
        require:true,
        type:Boolean,
        default:false
    },
    mechano:{
        type:Number,
        require:true,
        default:1
    },
    rating:{
        require:true,
        type:Number,
        default:4
    },
    upiId:{
       require:true,
       type:String
    },
    chargingfee:{
        require:true,
        default:0,
        type:Number
    },
    activation:{
        require:true,
        type:Boolean,
        default:true
    },
    toe:{
        require:true,
        type:Number,
        default:0
    },
    bike:{
        type:Number,
        require:true,
        default:0
    },
    car:{
        type:Number,
        require:true,
        default:0
    },
    bus:{
        type:Number,
        require:true,
        default:0
    },
    truck:{
        type:Number,
        require:true,
        default:0
    },
    tacter:{
        type:Number,
        require:true,
        default:0
    },
    autoer:{
        type:Number,
        require:true,
        default:0
    },
    token:{
        type:String,
        require:true,
        default:"login"
    }
})