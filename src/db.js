const mongoose = require('mongoose');

//using mongoose models
const SodaSchema = mongoose.Schema({
/*
    starting sodas:
    Product Name: Fizz
    Description: An effervescent fruity experience with hints of grape and coriander.
    Cost: 1 dollar US
    Maximum Quantity available to vend: 100

    Product Name: Pop
    Description: An explosion of flavor that will knock your socks off!
    Cost: 1 dollar US
    Maximum Quantity available to Vend: 100

    Product Name: Cola
    Description: A basic no nonsense cola that is the perfect pick me up for any occasion.
    Cost: 1 dollar US
    Maximum Quantity available to vend: 200

    Product Name: Mega Pop
    Description: Not for the faint of heart.  So flavorful and so invigorating, it should probably be illegal.
    Cost: 1 dollar US
    Maximum Quantity available to vend: 50
*/
    name: String,
    desc: String,
    cost: Number,
    maxQty: Number,
    currQty: Number,
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
To setup mongoDB:

use CocaCo-Machine

db.sodas.insert({name: "Fizz",desc:"descFizz",cost:1,maxQty:100,currQty:100});
db.sodas.insert({name: "Pop",desc:"descPop",cost:1,maxQty:100,currQty:100});
db.sodas.insert({name: "Cola",desc:"descCola",cost:1,maxQty:200,currQty:200});
db.sodas.insert({name: "Mega Pop",desc:"descMega",cost:1,maxQty:50,currQty:50});

db.sodas.find();
*/