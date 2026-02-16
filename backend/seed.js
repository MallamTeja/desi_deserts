require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Dessert = require('./models/Dessert');

const desserts = [
    {
        name: "Gulab Jamun",
        description: "Soft, spongy milk-solid balls soaked in rose-scented sugar syrup.",
        price: 60,
        image_url: "gulab_jamun.jpg"
    },
    {
        name: "Rasgulla",
        description: "Ball-shaped dumplings of chhena and semolina dough, cooked in light syrup made of sugar.",
        price: 50,
        image_url: "rasgulla.jpg"
    },
    {
        name: "Jalebi",
        description: "Crispy, orange, coil-shaped sweets made by deep-frying maida flour batter in pretzel or circular shapes, which are then soaked in sugar syrup.",
        price: 40,
        image_url: "jalebi.jpg"
    },
    {
        name: "Rasmalai",
        description: "Soft chhena balls soaked in thickened, sweetened milk flavored with cardamom and saffron.",
        price: 80,
        image_url: "rasmalai.jpg"
    },
    {
        name: "Kaju Katli",
        description: "Rich diamond-shaped sweet made with cashew nuts and sugar, garnished with edible silver foil.",
        price: 120,
        image_url: "kaju_katli.jpg"
    },
    {
        name: "Gajar Ka Halwa",
        description: "Classic Indian dessert made with grated carrots, whole milk, dried fruit, and nuts.",
        price: 90,
        image_url: "gajar_halwa.jpg"
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
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });
