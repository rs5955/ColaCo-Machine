const mongoose = require('mongoose');

//using mongoose models
const SodaSchema = mongoose.Schema({
    name: String,
    desc: String,
    cost: Number,
    maxQty: Number,
});

mongoose.model('Soda', SodaSchema);

//check if in NODE_ENV is set to PRODUCTION
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
    const fs = require('fs');
    const path = require('path');
    const fn = path.join(__dirname, '../config.json');
    const data = fs.readFileSync(fn);

    const conf = JSON.parse(data);
    dbconf = conf.dbconf;
} else {
    dbconf = 'mongodb://localhost/CocaCo-Machine';
}

mongoose.connect(dbconf,{useNewUrlParser: true, useUnifiedTopology: true}, (err, database) => {
    if (err) {
        return console.log(err);
    } else {
        console.log('Connected to database'); 
    }
});

/*
- To setup mongoDB:

use CocaCo-Machine

- copy-paste below into mongo shell

db.sodas.insert({name: "Fizz",desc:"An effervescent fruity experience with hints of grape and coriander",cost:1,maxQty:100});
db.sodas.insert({name: "Pop",desc:"An explosion of flavor that will knock your socks off!",cost:1,maxQty:100});
db.sodas.insert({name: "Cola",desc:"A basic no nonsense cola that is the perfect pick me up for any occasion.",cost:1,maxQty:200});
db.sodas.insert({name: "Mega Pop",desc:"Not for the faint of heart.  So flavorful and so invigorating, it should probably be illegal.",cost:1,maxQty:50});

db.sodas.find();
*/