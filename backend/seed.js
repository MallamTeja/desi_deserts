require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const dns = require('node:dns');

// Fix for Node.js DNS resolution issues on some Windows environments
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
    console.warn('Could not set custom DNS servers:', e.message);
}

const Dessert = require('./models/Dessert');

const desserts = [
    {
        name: "Basundi",
        description: "Rich, creamy, sweetened milk simmered to perfection with nuts and saffron.",
        price: 39,
        image_url: "basundi"
    },
    {
        name: "Double ka Meetha",
        description: "A Hyderabadi classic made with fried bread slices soaked in saffron milk and cardamom syrup.",
        price: 59,
        image_url: "double-ka-meetha"
    },
    {
        name: "Kaddu ka Kheer",
        description: "A delightful pudding made with grated pumpkin, milk, and aromatic spices.",
        price: 69,
        image_url: "kaddu-ki-kheer"
    }
];

mongoose.connect(process.env.mongodbfromenv)
    .then(async () => {
        console.log('Connected to MongoDB');

        await Dessert.deleteMany({});
        console.log('Cleared existing desserts');

        await Dessert.insertMany(desserts);
        console.log('Inserted sample desserts');

        mongoose.connection.close();
        console.log('Done.');
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
