const express = require('express')
require('./db/db-address')
const request = require('request')
const axios = require('axios')
var querystring = require('querystring');
const mecha = require('./db/models/mecha')
const orgamecha = require('./db/models/orgamecha')
const cust = require('./db/models/cust')
const history = require('./db/models/history')
const admin = require('./db/models/admin')
const moment  = require('moment')
const txn = require('./db/models/txn')
const app = express()
app.use(express.json())



// some important constant
const map = new Map()
const price = []




// some ipmortant function
const intial = async() => {

    let list = await mecha.find({})
    list.forEach((res) => {map.set(JSON.stringify(res._id),[0])})

    list = await orgamecha.find({})
    list.forEach((res) => {map.set(JSON.stringify(res._id),[0])})
    console.log(map)
}

intial()


// common API



app.get('/',(req,res)=>{
    res.send("working")
})




app.post('/history',async(req,res)=>{
    try{const {type,_id} = req.body
    const History =await history.find({[type]:_id})
    res.send(History)}catch(e){res.status(500).send("invalid request")}
})




app.post('/login',async(req,res)=>{

    try{
     const {email,password,type} = req.body
    const Mecha = await mecha.find({email,password})
    const Cust = await cust.find({email,password})
    const Orgamecha = await orgamecha.find({email,password})
    var id1 = []
    
    if(Mecha.length === 0 && Cust.length===0 && Orgamecha.length===0)
       throw new Error()


    if(Mecha.length!==0 && type === 'mecha'){
        if(Mecha[0].token === 'login')
          throw new Error()
        const _id = await mecha.findByIdAndUpdate(Mecha[0]._id,{activation:true,token:"login"})  
        id1.push(_id)
    }

    if(Cust.length!==0 && type === 'cust'){
        if(Cust[0].token === 'login')
          throw new Error()
        const _id = await cust.findByIdAndUpdate(Cust[0]._id,{activation:true,token:"login"})  
        id1.push(_id)
    }

    if(Orgamecha.length!==0 && type === 'orgamecha'){
        if(Orgamecha[0].token === 'login')
          throw new Error()
        const _id = await orgamecha.findByIdAndUpdate(Orgamecha[0]._id,{activation:true,token:"login"})
        id1.push(_id)  
    }
     
     res.status(200).send(id1)

   }catch(e){ 
    res.status(500).send("invalid login")}
    

    
})




app.post('/logout',async(req,res)=>{
    try{await mecha.findByIdAndUpdate(req.body._id,{activation:false,token:"logout"})
    await cust.findByIdAndUpdate(req.body._id,{activation:false,token:"logout"})
    await orgamecha.findByIdAndUpdate(req.body._id,{activation:false,token:"logout"})
    res.send("logout")}catch(e){res.status(500).send("invalid request")}
})



// admin API



app.post('/admin/login',async(req,res)=>{
    try{var op = [1]
    var sta = 200
    const Admin = await admin.find(req.body)
    if(Admin.length ===0 )
      {op=[0]}  
     res.status(sta).send(op)}catch(e){res.status(500).send("error")}   
})



app.post('/admin/newuser',async(req,res) =>{
    try{const Admin = await new admin(req.body)
    await Admin.save()
    res.send("user create")}catch(e){res.status(500).send("error")}
})



app.post('/admin/payment',async(req,res)=>{
    try{const {historyid,amount,txnid,time} = req.body
    await history.findByIdAndUpdate(historyid,{paycomplete:true})
    
    const Txn = await new txn({amount,txnid,time})
    await Txn.save()
    res.send("ok")}catch(e){res.status(500).send("invalid request")}
})




app.post('/database/mecha',async(req,res) =>{
     try{await mecha.remove()
     res.send("Ok!")}catch(e){res.status(500).send("invalid request")}
})




app.post('/database/cust',async(req,res)=>{
    try{await cust.remove()
    res.send("Ok!")}catch(e){res.status(500).send("invalid request")}
})




app.post('/database/orgamecha',async(req,res)=>{
    try{await orgamecha.remove()
    res.send("Ok!")}catch(e){res.status(500).send("invalid request")}
})





app.post('/database/txn',async(req,res)=>{
    try{await txn.remove()
    res.send("Ok!")}catch(e){res.status(500).send("invalid request")}
})




app.post('/database/history',async(req,res)=>{
    try{await history.remove()
    res.send("Ok!")}catch(e){res.status(500).send("invalid request")}
})






app.post('/changeprice',(req,res)=>{
    try{price[0] = req.body.single
    price[1] = req.body.many
    price[2] = req.body.minamount // for a admin that have to set
    price[3] = '1'
    res.send(price)}catch(e){res.status(500).send("invalid request")}
})


app.post('/showprice',(req,res)=>{
    try{res.send(price)}catch(e){res.status(500).send("invalid request")}
})



app.post('/logoutall',async(req,res)=>{
    try{const {email} = req.body
    const Mecha = await mecha.find({email})
    const Cust = await cust.find({email})
    const Orgamecha = await orgamecha.find({email})
    
    if(Mecha.length === 1)
      await mecha.findByIdAndUpdate(Mecha[0]._id,{activation:false,token:"logout"})
    if(Cust.length === 1 )
      await cust.findByIdAndUpdate(Cust[0]._id,{activation:false,token:"logout"})
    if(Orgamecha.length === 1)
      await orgamecha.findByIdAndUpdate(Orgamecha[0]._id,{activation:false,token:"logout"})

    res.send("Logout")}catch(e){res.status(500).send("invalid request")}
})





app.post('/mecha',async(req,res)=>{
    try{const Mechas = await mecha.find({})
    res.send(Mechas)}catch(e){res.status(500).send("invalid request")}
})




app.post('/customer',async(req,res)=>{
   try{ const Cust = await cust.find({})
    res.send(Cust)}catch(e){res.status(500).send("invalid request")}
})




app.post('/mecha/all',async(req,res)=>{
    try{const {_id} = req.body
    const Mecha = await mecha.findById(_id)
    if(Mecha.Organization){
       const Orgas = await orgamecha.find({ownerid:_id})
       res.send(Orgas)
    }else{res.send("NO!")}}catch(e){res.status(500).send("invalid request")}
})



app.post('/orgamecha',async(req,res)=>{
    try{const Orgamecha = await orgamecha.find({})
    res.send(Orgamecha)}catch(e){res.status(500).send("invalid request")}
})





app.post('/txn',async(req,res)=>{
    try{const {mechaid} = req.body
    const Txns = await txn.find({mechaid})
    res.send(Txns)}catch(e){res.status(500).send("invalid request")}
})







app.post('/admin/history',async(req,res)=>{
    try{const {minday,minmon,minyear,maxday,maxmon,maxyear} = req.body
    const low = moment({ 
        year :minyear, month :(minmon-1), day :minday
    }).valueOf()
    const high = moment({ 
        year :maxyear, month :(maxmon-1), day :maxday, 
        hour :23, minute :59
    }).valueOf()
    const History =await history.find({paycomplete:false})
    res.send(History)}catch(e){res.status(500).send("invalid request")}
})





// Mechanic API


app.post("/mecha/newuser", async(req,res)=>{
    try{
      const Mecha = await new mecha(req.body)
      await Mecha.save()
      map.set(JSON.stringify(Mecha._id),[0])
     
        res.status(200).send(Mecha)
    }catch(e){
        res.status(500).send(e)
    }
})






app.post("/mecha/deluser",async(req,res)=>{
    try{
        await mecha.deleteOne(req.body)
        map.delete(JSON.stringify(req.body._id))

       const alllist = await orgamecha.find({ownerid:req.body._id})
       alllist.forEach((res)=>{ map.delete(JSON.stringify(res._id))})
       await orgamecha.deleteMany({ownerid:req.body._id})
       
       res.status(200).send("OK!")
    }catch(e){ res.status(500).send(e)}
})





app.post('/mecha/checkpoint',async(req,res)=>{
    const med = []
    try
    {const use = map.get(JSON.stringify(req.body._id))
     med.push(use)   
    if(use[0] != 0)
    {const result = await cust.findById(use[3])
        const Mecha = await mecha.findById(req.body._id)
    if(Mecha.Organization){
        const mechalist = await orgamecha.find({ownerid :req.body._id,mechano:{$gte:1},[use[4]]: { $gte: 1 }})
        med.push(result.name,mechalist)
        }else{
        await mecha.findByIdAndUpdate(req.body._id,{mechano:0,activation:true})
        await history.findByIdAndUpdate(use[5],{arrivaltime:moment().valueOf()})
        med.push(result.name)
    }}
    res.send(med)
     
 }catch(e){
    res.send(e)}
 

})








app.post('/mecha/payment',async(req,res)=>{
    try{
        const {status,_id,txnid,mechaid} = req.body
		await txn.findByIdAndUpdate(_id,{status,txnid});	
        const update = await history.updateMany({mechaid},{$set:{ paycomplete: true } })
       res.send("Ok!")
    } catch(e){res.status(500).send("invalid request")} 
})





app.post('/mecha/reply',async(req,res)=>{
    try{const {_id,mechaid} = req.body
    const use = map.get(JSON.stringify(mechaid))
    map.set(JSON.stringify(_id),use)
    const orga = await orgamecha.findByIdAndUpdate(_id,{mechano:0})
    await mecha.findByIdAndUpdate(orga.ownerid,{activation:true})
    
    res.send("Ok!")}catch(e){res.status(500).send("invalid request")} 
})





app.post('/mecha/reach',async(req,res)=>{
    try{
        const use = map.get(JSON.stringify(req.body._id))
       await history.findByIdAndUpdate(use[5],{destinationtime:moment().valueOf()})
       res.status(200).send("ok!")
    }catch(e){res.status(500).send(e)}
})



app.post("/mecha/updateuser/:id",async(req,res)=>{
    const updates = Object.keys(req.body)
    const isValidOperation = updates.includes('rating')
    if (isValidOperation) {
        return res.status(500).send({ error: 'Invalid updates!' })
    }
    
    try {
        await mecha.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        const user = await mecha.findById(req.params.id)
        if (!user) {
            return res.status(500).send("Invalid User")
        }
        
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})


app.post('/mecha/arrival',async(req,res)=>{
    try{await history.findByIdAndUpdate(req.body._id,{arrivaltime:moment().valueOf()})
    res.send("ok you reach")}catch(e){res.status(500).send("invalid request")}
})



app.post('/mecha/checkpoint/cencel',async(req,res)=>{
    try{const History = await history.findById(req.body._id)
    res.send(History.cencelbycustomer)}catch(e){res.status(500).send("invalid request")}
})


app.post('/mecha/checkpoint/done',async(req,res)=>{
    try{const {_id} = req.body
    const His = await history.findById(_id)
    if(His.donetime !== null)
       res.send([1])
    else
       res.send([0])}catch(e){res.status(500).send("invalid request")}   
})

app.post('/mecha/payment',async(req,res)=>{
    try{const {merchantid,historyids,amount,txnid,time} = req.body
    historyids.forEach((id)=>{
    
     history.findByIdAndUpdate(id,{paycomplete:true})
    })
    const Txn = await new txn({merchantid,amount,txnid,time})
    await Txn.save()
    res.send("ok")}catch(e){res.status(500).send("invalid request")}
})




// shop Mechanic API


app.post("/mecha/organization/deluser",async(req,res)=>{
    try{
        const orga = await orgamecha.findById(req.body)
        const base = await mecha.findById(orga.ownerid)
        const changebase = {
            mechano:base.mechano-1,
            rating: (orga.rating-base.rating)/(base.mechano-1),
            car:base.car-(orga.car===0)?0:1,
            bike:base.bike-(orga.bike===0)?0:1,
            truck:base.truck-(orga.truck===0)?0:1,
            bus:base.bus-(orga.bus)?0:1,
            tacter:base.tacter-(orga.tacter===0)?0:1,
            autoer:base.autoer-(orga.autoer===0)?0:1
        }
        
        await mecha.findByIdAndUpdate(orga.ownerid,changebase,{ new: true, runValidators: true })
        await orgamecha.findByIdAndRemove(req.body._id)
        map.delete(JSON.stringify(req.body._id))
        res.status(200).send("OK!")
    }catch(e){ res.status(500).send(e)}
})


app.post('/mecha/relese',async(req,res) => {
    try{const {historyid} = req.body;
    await history.findByIdAndUpdate(historyid,{relese:true});
    res.send('relese')}catch(e){res.status(500).send("invalid request")}
})




app.post("/mecha/organization/newuser",async(req,res)=>{
    try{
        const Orgamecha = await new orgamecha(req.body)
        await Orgamecha.save()
        const base = await mecha.findById(req.body.ownerid)
        
        const changebase = {
            $inc: {mechano:1},
            rating: (base.rating+4)/(base.mechano+1),
            car:base.car+Orgamecha.car,
            bike:base.bike+Orgamecha.bike,
            truck:base.truck+Orgamecha.truck,
            bus:base.bus+Orgamecha.bus,
            tacter:base.tacter+Orgamecha.tacter,
            autoer:base.autoer+Orgamecha.autoer
        }
        
        await mecha.findByIdAndUpdate(req.body.ownerid,changebase,{ new: true, runValidators: true })
   
        map.set(JSON.stringify(Orgamecha._id),[0])

        res.status(200).send(Orgamecha)
    }
    catch(e){
        res.status(500).send(e)
    }
})





app.post("/mecha/organization/updateuser/:id",async(req,res)=>{
    try{
        const orga = await orgamecha.findById(req.params.id)
        const base = await mecha.findById(orga.ownerid)
    
        const  {car=0,bike=0,truck=0,bus=0,tacter=0,autoer=0}=req.body
        const changebase = {
            car:base.car+ (orga.car===0 && car )?1:0,
            bike:base.bike+(orga.bike===0 && bike )?1:0,
            truck:base.truck+(orga.truck===0 && truck )?1:0,
            bus:base.bus+(orga.bus===0 && bus )?1:0,
            tacter:base.tacter+(orga.tacter===0 && tacter )?1:0,
            autoer:base.autoer+(orga.autoer===0 && autoer )?1:0
        }
        

        await mecha.findByIdAndUpdate(orga.ownerid, changebase, { new: true, runValidators: true })
        await orgamecha.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        const user = await orgamecha.findById(req.params.id)
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
})




app.post('/mecha/organization/checkpoint',async(req,res)=>{
    try{const use = map.get(JSON.stringify(req.body._id))
    const result = await cust.findById(use[3])
    if(use[0]!==0)
     {
        
        const orga = await orgamecha.findById(req.body)
        const base = await mecha.findById(orga.ownerid)
        

        const changebase = {
            mechano:base.mechano-1,
            car:base.car-orga.car,
            bike:base.bike-orga.bike,
            truck:base.truck-orga.truck,
            bus:base.bus-orga.bus,
            tacter:base.tacter-orga.tacter,
            autoer:base.autoer-orga.autoer
        }
        
        await mecha.findByIdAndUpdate(orga.ownerid,changebase,{ new: true, runValidators: true })
        await history.findByIdAndUpdate(use[5],{arrivaltime:moment().valueOf(),orgamechaid:req.body._id})
        use.push([result.name])
     }

    res.send(use)}catch(e){res.status(500).send("invalid request")}
})



app.post('/mecha/organization/checkpoint/cencel',async(req,res)=>{
    try{const History = await history.findById(req.body._id)
    res.send(History.cencelbycustomer)}catch(e){res.status(500).send("invalid request")}
})


// customer API



app.post('/cust/newuser', async(req,res)=>{
    try{
        const Cust = await new cust(req.body)
      await Cust.save()
        res.status(200).send(Cust)
    }catch(e){
        res.status(500).send(e)
    }
})







app.post("/cust/deluser",async(req,res)=>{
    try{
        await cust.deleteOne(req.body)
        res.status(200).send("OK!")
    }catch(e){ res.status(500).send(e)}
})







app.post("/cust/updateuser/:id",async(req,res)=>{
    try{
        await cust.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        const Cust = await cust.findById(req.params.id)
        res.send(Cust)
    }catch(e){
        res.status(500).send(e)
    }
})



app.post('/cust/mechalist',async(req,res)=>{
    const {toe=0,type="car",latitude=0,longitude=0} = req.body
    try{
        
        console.log(req.body)

         const list = await mecha.find({toe :{$gte:toe},mechano:{$gte:1}, activation:true,[type]: { $gte: 1 }})
        
          if(list.length ===0 || req.body.latitude === null || req.body.longitude === null)
            res.status(200).send([])
          else
          {const list2 = [
            {
              "point": {"latitude": latitude,"longitude": longitude}
            }
          ]
          
          const list3 =[]

          list.forEach((lis) =>{
              list3.push({
                "point": {"latitude": lis.latitude,"longitude": lis.longitude}
              })
          })


         const list1 = {
             "origins": list2,
             "destinations": list3
         }
         
         

         const url = 'https://api.tomtom.com/routing/1/matrix/sync/json?key=jU4h6prZhmfPawSj5A5qdfEQn1VH3kiQ'
        
        request({
            headers: {
              'Content-Type': 'application/json'
            },
            uri: url,
            body: JSON.stringify(list1) ,
            method: 'POST'
          }, function (err, re, body) {
            var sta = 200
            var op = []
            console.log(0)
            console.log(body)
            console.log(1)
            const final = JSON.parse(body)
            console.log(final)
            if(final.matrix[0][0].statusCode !== 400 )     
            {
                console.log(2)
               op = list.map((res,index)=>{
                 res._doc.time = final.matrix[0][index].response.routeSummary.travelTimeInSeconds
                 res._doc.distance = final.matrix[0][index].response.routeSummary.lengthInMeters
                 return res})
                 sta = 200
            }else{
                sta = 500
             }
             console.log(3)
             res.status(sta).send(op)
          })}
          
          
        
    }catch(e){
        res.status(500).send(e)
    }
})



app.post('/cust/selectmecha',async(req,res)=>{
         try{const {mechaid,longitude,latitude,custid,type,distance,time,address,toe} = req.body
         const Mecha = mecha.findById(mechaid)
         const define ={
             "custid":custid,
             "mechaid":mechaid,
             "requesttime":moment().valueOf(),
             "typeofvehicle":type,
             "longitude":longitude,
             "latitude":latitude,
             "originalamount": 1,
			 address,
			 toe,
         }
         await mecha.findByIdAndUpdate(mechaid,{activation:false})
		 const user = await cust.findById(custid)
         const History = await new history(define)
         await History.save()
         map.set(JSON.stringify(mechaid),[1,latitude,longitude,custid,type,History._id,distance,time,user.email,user.mobileno])
         console.log(map)
         res.send(History._id)}catch(e){
             res.status(500).send(e)}
})



app.post('/cust/done',async(req,res)=>{
    try{
        await mecha.findByIdAndUpdate(req.body._id,{mechano:1,activation:true})
        const orga = await orgamecha.findByIdAndUpdate(req.body._id,{mechano:1,activation:true})
        const ele = map.get(JSON.stringify(req.body._id))

        if(orga!==null){
            const base = await mecha.findById(orga.ownerid)
            const changebase = {
                mechano:base.mechano+1,
                car:base.car+orga.car,
                bike:base.bike+orga.bike,
                truck:base.truck+orga.truck,
                bus:base.bus+orga.bus,
                tacter:base.tacter+orga.tacter,
                autoer:base.autoer+orga.autoer
            }
            await mecha.findByIdAndUpdate(orga.ownerid,changebase,{ new: true, runValidators: true })
            
        }
        await history.findByIdAndUpdate(ele[5],{donetime:moment().valueOf()})
        map.set(JSON.stringify(req.body._id),[0])
        console.log(map)
        res.send("ok")
    }catch(e){res.status(500).send(e)}
})



app.post('/cust/feedback',async(req,res)=>{
    try{const Mecha =await mecha.findById(req.body._id)
    const orga =await orgamecha.findById(req.body._id)
    if(orga!==null){
        const base =await mecha.findById(orga.ownerid)
        await mecha.findByIdAndUpdate(orga.ownerid,{rating:((base.rating+req.body.rating)/base.mechano)})
        await orgamecha.findByIdAndUpdate(orga._id,{rating:((orga.rating+req.body.rating)/2)})
    }else{
        await mecha.findByIdAndUpdate( Mecha._id,{rating:((Mecha.rating+req.body.rating)/2)})
    }
    await history.findByIdAndUpdate(req.body.historyid,{feedback:req.body.rating})
    res.send('thanks')}catch(e){res.status(500).send("invalid request")}
})



app.post('/cust/checkpoint',async(req,res)=>{
    try{
        const {historyid} = req.body
        const History = await history.findById(historyid)
        if(History.destinationtime!==null)
           res.send([1])
        else 
           res.send([0])   
    }catch(e){res.status(500).send("Invalid request")}
})



app.post('/cust/payment',async(req,res)=>{
    try{const {id,amount} = req.body
    const Txn = await new txn({id,amount,time:moment().valueOf()})
    await Txn.save()
    res.send(Txn)}catch(e){res.status(500).send("Invalid request")}
})


app.post('/cust/paymentupdate',async(req,res)=>{
    try{const {_id,historyid = null,status,txnid = null,amount} = req.body
    if(status === 'SUCCESS'){
        await history.findByIdAndUpdate(historyid,{chargingfee:amount})
    }
	   await txn.findByIdAndUpdate(_id,{status,txnid,historyid});	
    res.send("Ok")}catch(e){res.status(500).send("Invalid request")}
})


app.post('/cust/relese',async(req,res) => {
    try{const {historyid} = req.body;
    var op = [0]
    const History = await history.findById(historyid);
    if(History.relese)
       op = [1]
    
    res.send(op)}catch(e){res.status(500).send("invalid request")}
})



app.post('/cust/cencel',async(req,res)=>{
    try{

        await mecha.findByIdAndUpdate(req.body._id,{mechano:1,activation:true})
        const orga = await orgamecha.findByIdAndUpdate(req.body._id,{mechano:1,activation:true})
        const ele = map.get(JSON.stringify(req.body._id))

        if(orga!==null){
            const base = await mecha.findById(orga.ownerid)
            const changebase = {
                mechano:base.mechano+1,
                car:base.car+orga.car,
                bike:base.bike+orga.bike,
                truck:base.truck+orga.truck,
                bus:base.bus+orga.bus,
                tacter:base.tacter+orga.tacter,
                autoer:base.autoer+orga.autoer
            }
            await mecha.findByIdAndUpdate(orga.ownerid,changebase,{ new: true, runValidators: true })
            
        }
        await history.findByIdAndUpdate(ele[5],{cencelbycustomer:true,cenceltime:moment().valueOf(),originalamount:0})
 
        map.set(JSON.stringify(req.body._id),[0])
    res.send("cencel")}catch(e){res.status(500).send("invalid request")}
})


app.listen(process.env.PORT ||3000,()=> console.log("running"))