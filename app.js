let express = require('express');
let app = express();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const dotenv = require('dotenv');
dotenv.config()
let port = process.env.PORT || 7000;
const MongoLiveUrl = "mongodb+srv://zomato:test12345@zomato.glr5m.mongodb.net/zomatodata?retryWrites=true&w=majority";
const bodyParser = require('body-parser');
const cors = require('cors');
const token = "8fbf8tyyt87378";

// middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use(cors())


app.get('/',(req,res) => {
    res.send("Welcome to My Zomato App")
})

app.get('/location',(req,res) => {
    db.collection('location').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

app.get('/restaurantmenu',(req,res) => {
    db.collection('restaurantmenu').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

app.get('/restaurantdata',(req,res) => {
    db.collection('restaurantdata').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

app.get('/restaurantdata/:id',(req,res) => {
    let id = req.params.id; 
    console.log('>>>id',id) 
    let query = {};
    let stateId = (req.query.state_id);
    let mealId = (req.query.meal_id);
    if(stateId){
        query = {state_id:stateId}
    }else if(mealId){
        query={'mealTypes.mealType_id':mealId}
    }

    db.collection('restaurantmenu').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

app.get('/mealtype',(req,res) => {
    db.collection('mealtype').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// menu on basis of id
app.post('/menuItem',(req,res) => {
    console.log(req.body);
    if(Array.isArray(req.body)){
        db.collection('menu').find({menu_id:{$in:req.body}}).toArray((err,result) => {
            if(err) throw err;
            res.send(result)
        })
    }else{
        res.send('Invalid Input')
    }
})

// place Order
app.post('/placeOrder',(req,res) => {
    db.collection('orders').insert(req.body,(err,result) => {
        if(err) throw err;
        res.send('Order Placed')
    })
})

// View Order
app.get('/viewOrder',(req,res) => {
    let email = req.query.email;
    let query = {};
    if(email){
        query = {"email":email}
    }
    db.collection('orders').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// delete order
app.delete('/deleteOrders',(req,res)=>{
    db.collection('orders').remove({},(err,result) => {
        res.send('order deleted')
    })
})

//update orders
app.put('/updateOrder/:id',(req,res) => {
    let oId = mongo.ObjectId(req.params.id);
    db.collection('orders').updateOne(
        {_id:oId},
        {$set:{
            "status":req.body.status,
            "bank_name":req.body.bankName
        }},(err,result) => {
            if(err) throw err
            res.send(`Status Updated to ${req.body.status}`)
        }
    )
})

// Connection with db
MongoClient.connect(MongoLiveUrl, (err,client) => {
    if(err) console.log(`Error while connecting`);
    db = client.db('zomatodata');
    app.listen(port,() => {
        console.log(`Server is running on port ${port}`)
    })
})