require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const dns = require('node:dns');

console.log('--- MongoDB Connection Test ---');
console.log('Environment:', process.env.mongodbfromenv ? 'URI found' : 'URI MISSING');

if (dns.setDefaultResultOrder) {
    console.log('Setting DNS result order to ipv4first');
    dns.setDefaultResultOrder('ipv4first');
}

async function testConnection() {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(process.env.mongodbfromenv, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('SUCCESS: Connected to MongoDB');
    } catch (err) {
        console.error('FAILURE: MongoDB connection error');
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);
        if (err.reason) {
            console.error('Reason:', JSON.stringify(err.reason, null, 2));
        }
    } finally {
        await mongoose.disconnect();
        console.log('Test complete.');
        process.exit(0);
    }
}

testConnection();
