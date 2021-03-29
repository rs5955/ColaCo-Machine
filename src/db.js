const mongoose = require('mongoose');

//using mongoose models
const SodaSchema = mongoose.Schema({
  
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