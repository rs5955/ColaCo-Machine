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
    // TODO: retrieve all sodas or use filters coming in from req.query
    // send back as JSON list
    Soda.find().exec((err,output)=>{
        res.json(output);
    });
});

app.post('/api/soda/update', (req,res)=>{
    console.log("UPDATING SODA...");
    const reqSoda = JSON.parse(JSON.stringify(req.body));
    console.log("reqSoda",reqSoda);
    
    Soda.findOne({_id: reqSoda._id}, function(err, soda) {
        console.log("inside HERE");
        if(!err) {
            if(!soda) {
                console.log("ADDING SODA TO DB");
                soda = new Soda();
                soda.name = reqSoda.name;
                soda.desc = reqSoda.desc;
                soda.cost = reqSoda.cost;
                soda.maxQty = reqSoda.maxQty;
                soda.currQty = reqSoda.currQty;
            }else{
                //decrement currQty (the decrement req is only sent if the soda qty>1)
                soda.currQty -= 1;
            }
            soda.status = req.status;
            console.log("soda: ",soda);
            soda.save((err,output)=>{
                if(!err) {
                    console.log(soda);
                }
                else {
                    console.log("Error: could not save soda: "+soda);
                }
                res.json(output);
            });
        }
    });
});

app.listen(process.env.PORT || DEFAULT_PORT, (err) => {
    console.log('Server started (ctrl + c to shut down)');
});