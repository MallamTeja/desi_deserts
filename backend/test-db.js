require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const dns = require('node:dns');

console.log('--- MongoDB Connection Test (Standard String + IPv4First) ---');

if (dns.setDefaultResultOrder) {
    console.log('Setting DNS result order to ipv4first');
    dns.setDefaultResultOrder('ipv4first');
}

async function testConnection() {
    try {
        console.log('Attempting to connect to MongoDB...');
        const uri = process.env.mongodbfromenv;
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('SUCCESS: Connected to MongoDB');
    } catch (err) {
        console.error('FAILURE: MongoDB connection error');
        console.error('Error Message:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('Test complete.');
        process.exit(0);
    }
}

testConnection();
