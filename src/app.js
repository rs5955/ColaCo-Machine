const DEFAULT_PORT = 3000;

// database setup
require('./db');
const mongoose = require('mongoose');

// express
const express = require('express');
const app = express();

// static files
const path = require("path");
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

// body parser
app.use(express.urlencoded({ extended: false }));
//app.set('view engine', 'hbs');

const Soda = mongoose.model('Soda');

app.get('/api/sodas', function(req, res) {
    // retrieve all sodas or use filters coming in from req.query
    // send back as JSON list
    Soda.find().exec((err,output)=>{
        res.json(output);
    });
});

app.post('/api/soda/update', (req,res)=>{
    console.log("UPDATING SODA...");
    const reqBody = JSON.parse(JSON.stringify(req.body));
    console.log("reqBody: ",reqBody);
    const action = reqBody.action;
    
    //either adding or updating
    if(action==="ADD"){
        const toAdd = new Soda({
            name: reqBody.name,
            desc: reqBody.desc,
            cost: reqBody.cost,
            maxQty: reqBody.maxQty,
        });
        
        toAdd.save((err,output)=>{
            res.json("added new soda!\n"+soda);
        });
        
    }else{ //do something involving an already existing soda entry
        console.log("reqSoda",reqBody.id);

        Soda.findOne({_id: reqBody.id}, function(err, soda) {
            console.log("inside HERE");
            
            if(!err) {
                if(action==="DECREMENT"){
                    //decrement qty (the decrement req is only sent if the soda qty>1)
                    console.log("decrementing soda cnt of: ",soda.name);
                    soda.maxQty -= 1;
                }else{
                    console.log("idk what the action is");
                }
            }
            soda.save((err,output)=>{
                if(!err) {
                    console.log(soda);
                }
                else {
                    console.log("Error: could not save soda: "+soda);
                }
                res.json(output);
            });
        });
    }
});

app.listen(process.env.PORT || DEFAULT_PORT, (err) => {
    console.log('Server started (ctrl + c to shut down)');
});