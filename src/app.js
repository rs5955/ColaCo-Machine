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

app.post('/api/soda/create', (req, res) => {
    // TODO: create new soda... if save succeeds, send back JSON
    // representation of saved object

//    name: String,
//    desc: String,
//    cost: Number,
//    maxQty: Number
    const soda = new Soda({
        name: req.body.name,
        desc: req.body.desc,
        cost: req.body.cost,
        maxQty: req.body.maxQty,
        currQty: req.body.currQty,
    });
    
    soda.save((err,output)=>{
        res.json(output);    
    });
});

app.post('api/soda/update', (req,res)=>{
    const reqSoda = req.body.soda;
    
    Soda.findOne({name: reqSoda.name}, function(err, soda) {
    if(!err) {
        if(!soda) {
            soda = new Soda();
            soda.name = req.body.name;
            soda.desc = req.body.desc;
            soda.cost = req.body.cost;
            soda.maxQty = req.body.maxQty;
            soda.currQty = req.body.currQty;
        }
        soda.status = req.status;
        soda.save(function(err) {
            if(!err) {
                console.log(soda);
            }
            else {
                console.log("Error: could not save soda: "+soda);
            }
        });
    }
});
});

app.listen(process.env.PORT || DEFAULT_PORT, (err) => {
    console.log('Server started (ctrl + c to shut down)');
});