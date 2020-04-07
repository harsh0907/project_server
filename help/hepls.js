/cust/newuser

req
{
    "name":"harsh",         // string
    "email":"9h@gail.com",  // string
    "mobileno":1571121111, //Number always equal to 10
    "password":"12345656"  // String password length grater then 6
 }


res
{
    "token": "login",
    "_id": "5e8c6978e7832136147a0c8b",
    "name": "harsh",
    "email": "9h@ail.com",
    "mobileno": 1571121151,
    "password": "12345656",
    "__v": 0
}



/cust/deluser

req
{
    "_id":"5e78afa7c8006420b4982a80"  //cust id
}

res
  OK!  








/cust/updateuser/id

localhost:3000/cust/updateuser/5e8756661248a33cc073bf38

req
{
    "password":"123456789"
}

res
{
    "token": "my",
    "_id": "5e8756661248a33cc073bf38",
    "name": "harsh",
    "email": "hash@gail.com",
    "mobileno": 1111101111,
    "password": "123456789",
    "__v": 0
}



/cust/mechalist

req
{
	"longitude":11.499931,
    "latitude":48.149853,
    "type":"car",
    "toe":0   //Number, 0 for no, 1 for yes
}

res
[
    {
        "Organization": true,
        "mechano": 1,
        "rating": 4,
        "accountno": 0,
        "chargingfee": 30,
        "activation": true,
        "toe": 0,
        "bike": 1,
        "car": 1,
        "bus": 0,
        "truck": 0,
        "tacter": 0,
        "autoer": 0,
        "token": "login",
        "_id": "5e8c751ffdac3d2f4c24c922",
        "name": "papa",
        "email": "77@gmail.com",
        "mobileno": 8238264891,
        "Address": "hahahahahahaha",
        "latitude": 48.149853,
        "longitude": 11.499931,
        "password": "1234567",
        "__v": 0,
        "time": 0,
        "distance": 0
    }
]

/cust/selectmecha

req
{
	"mechaid":"5e87533b0e5c160b48427c42",
	"longitude":11.499931,
	"latitude":48.149853,
	"custid":"5e78afa7c8006420b4982a80",
	"type":"car",
	"time":0,
	"distance":1
}
res
"5e8c765afdac3d2f4c24c923"  //it will be history _id

/cust/done
req
{
	"_id":"5e7cab4fe6d33806f0b70cda" //orgamecha id 
}

res
ok


/cust/feedback

req
{
	"_id":"5e7cab4fe6d33806f0b70cda",  //orgamecha _id
	"historyid":"5e8361f9dec30e109898b081",
	"rating":5
}
res
thanks

/cust/checkpoint
req
{
    "historyid":"5e8360496a8fe23f64878930"
}
res
[0]  //wait again
[1]  //not wait 

/cust/payment
req {
    "merchantid":"5e87533b0e5c160b48427c42", //customer id
    "historyid":"5e8360496a8fe23f64878930",
    "amount":100,
    "txnid":"123",
    "time":"454545545454"
}
res
ok


/cust/cencel
req
{
	"_id":"5e8368cab49e582d24c11e51"
}
res
cencel


/login
req
{
	"email":"hash@gail.com",
	"password":"123456789"
}
res
login


/logout
req
{
	"_id":"5e8756661248a33cc073bf38" // customer id
}

res
logout 

/history

req
{  
    "_id":"5e87533b0e5c160b48427c42",  //coustomer id
    "type":"custid", 
    "typetime":"destinationtime",
    "minday":28,
    "minmon":3,
    "minyear":2020,
    "maxday":7,
    "maxmon":4,
    "maxyear":2020
 }
 res
 [
    {
        "custid": "5e78afa7c8006420b4982a80",
        "mechaid": "5e87533b0e5c160b48427c42",
        "requesttime": 1586259604926,
        "arrivaltime": null,
        "destinationtime": null,
        "donetime": null,
        "orgamechaid": null,
        "typeofvehicle": null,
        "originalamount": 0,
        "paycomplete": false,
        "chargingfee": 0,
        "cencelbycustomer": false,
        "cencelbyorgamecha": false,
        "cencelbymecha": false,
        "cenceltime": null,
        "feedback": null,
        "_id": "5e8c669488ca210d0458a778",
        "longitude": 11.499931,
        "latitude": 48.149853,
        "__v": 0
    }
]