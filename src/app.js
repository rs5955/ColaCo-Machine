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
        maxQty: req.body.qty
    })
});

app.listen(process.env.PORT || DEFAULT_PORT, (err) => {
    console.log('Server started (ctrl + c to shut down)');
});