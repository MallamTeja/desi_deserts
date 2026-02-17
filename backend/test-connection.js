const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const dns = require('node:dns');

console.log('Testing DNS resolution for SRV...');
dns.resolveSrv('_mongodb._tcp.dessertsdb.mhofyse.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('DNS SRV Resolution Error:', err);
  } else {
    console.log('DNS SRV Addresses:', addresses);
  }
});

console.log('Attempting to connect to MongoDB...');
console.log('URI:', process.env.mongodbfromenv);

mongoose.connect(process.env.mongodbfromenv)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection failed:', err);
    process.exit(1);
  });
