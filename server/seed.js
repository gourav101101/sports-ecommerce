const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Location = require('./models/Location');
const Category = require('./models/Category');

const Product = require('./models/Product'); // <-- IMPORT PRODUCT MODEL

dotenv.config();

// --- Location Data ---
const locationData = [
    { state: "Andhra Pradesh", cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"] },
    { state: "Arunachal Pradesh", cities: ["Itanagar", "Tawang", "Ziro", "Bomdila"] },
    { state: "Assam", cities: ["Guwahati", "Dispur", "Dibrugarh", "Silchar", "Jorhat"] },
    { state: "Bihar", cities: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia"] },
    { state: "Chhattisgarh", cities: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"] },
    { state: "Goa", cities: ["Panaji", "Margao", "Vasco da Gama", "Mapusa"] },
    { state: "Gujarat", cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"] },
    { state: "Haryana", cities: ["Faridabad", "Gurugram", "Panipat", "Ambala", "Karnal"] },
    { state: "Himachal Pradesh", cities: ["Shimla", "Manali", "Dharamshala", "Solan", "Kullu"] },
    { state: "Jharkhand", cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City"] },
    { state: "Karnataka", cities: ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi"] },
    { state: "Kerala", cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"] },
    { state: "Madhya Pradesh", cities: ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"] },
    { state: "Maharashtra", cities: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"] },
    { state: "Manipur", cities: ["Imphal", "Bishnupur", "Thoubal"] },
    { state: "Meghalaya", cities: ["Shillong", "Tura", "Jowai"] },
    { state: "Mizoram", cities: ["Aizawl", "Lunglei", "Champhai"] },
    { state: "Nagaland", cities: ["Kohima", "Dimapur", "Mokokchung"] },
    { state: "Odisha", cities: ["Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur"] },
    { state: "Punjab", cities: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Chandigarh"] },
    { state: "Rajasthan", cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"] },
    { state: "Sikkim", cities: ["Gangtok", "Namchi", "Gyalshing"] },
    { state: "Tamil Nadu", cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"] },
    { state: "Telangana", cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"] },
    { state: "Tripura", cities: ["Agartala", "Udaipur", "Dharmanagar"] },
    { state: "Uttar Pradesh", cities: ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut"] },
    { state: "Uttarakhand", cities: ["Dehradun", "Haridwar", "Rishikesh", "Nainital"] },
    { state: "West Bengal", cities: ["Kolkata", "Asansol", "Siliguri", "Durgapur", "Howrah"] },
    { state: "Andaman and Nicobar Islands", cities: ["Port Blair"] },
    { state: "Chandigarh", cities: ["Chandigarh"] },
    { state: "Dadra and Nagar Haveli and Daman and Diu", cities: ["Daman", "Silvassa"] },
    { state: "Delhi", cities: ["New Delhi", "Delhi"] },
    { state: "Jammu and Kashmir", cities: ["Srinagar", "Jammu", "Anantnag"] },
    { state: "Ladakh", cities: ["Leh", "Kargil"] },
    { state: "Lakshadweep", cities: ["Kavaratti"] },
    { state: "Puducherry", cities: ["Puducherry", "Karaikal"] },
];

const categoryData = [
    { name: 'Team Sports', slug: 'team-sports' },
    { name: 'Racquet Sports', slug: 'racquet-sports' },
    { name: 'Fitness & Training', slug: 'fitness-training' },
    { name: 'Athletics & Running', slug: 'athletics-running' },
    { name: 'Outdoor & Adventure', slug: 'outdoor-adventure' },
    { name: 'Combat Sports', slug: 'combat-sports' },
    { name: 'Water Sports', slug: 'water-sports' },
    { name: 'Indoor & Table Games', slug: 'indoor-games' },
];

const subCategoryData = (parents) => [
    // Team Sports
    { name: 'Cricket', slug: 'cricket', parent: parents['Team Sports'] },
    { name: 'Football', slug: 'football', parent: parents['Team Sports'] },
    { name: 'Basketball', slug: 'basketball', parent: parents['Team Sports'] },
    { name: 'Volleyball', slug: 'volleyball', parent: parents['Team Sports'] },
    { name: 'Hockey', slug: 'hockey', parent: parents['Team Sports'] },
// Racquet Sports
    { name: 'Badminton', slug: 'badminton', parent: parents['Racquet Sports'] },
    { name: 'Tennis', slug: 'tennis', parent: parents['Racquet Sports'] },
    { name: 'Table Tennis', slug: 'table-tennis', parent: parents['Racquet Sports'] },
    { name: 'Squash', slug: 'squash', parent: parents['Racquet Sports'] },

    // Fitness & Training
    { name: 'Gym Equipment', slug: 'gym-equipment', parent: parents['Fitness & Training'] },
    { name: 'Yoga & Pilates', slug: 'yoga-pilates', parent: parents['Fitness & Training'] },
    { name: 'Strength Training', slug: 'strength-training', parent: parents['Fitness & Training'] },
    { name: 'Cardio Equipment', slug: 'cardio-equipment', parent: parents['Fitness & Training'] },

    // Athletics & Running
    { name: 'Running Shoes', slug: 'running-shoes', parent: parents['Athletics & Running'] },
    { name: 'Track & Field', slug: 'track-field', parent: parents['Athletics & Running'] },
    { name: 'Apparel', slug: 'running-apparel', parent: parents['Athletics & Running'] },

    // Outdoor & Adventure
    { name: 'Cycling', slug: 'cycling', parent: parents['Outdoor & Adventure'] },
    { name: 'Skateboarding', slug: 'skateboarding', parent: parents['Outdoor & Adventure'] },
    { name: 'Hiking & Camping', slug: 'hiking-camping', parent: parents['Outdoor & Adventure'] },
// Combat Sports
    { name: 'Boxing', slug: 'boxing', parent: parents['Combat Sports'] },
    { name: 'Wrestling', slug: 'wrestling', parent: parents['Combat Sports'] },
    { name: 'Martial Arts', slug: 'martial-arts', parent: parents['Combat Sports'] },

    // Water Sports
    { name: 'Swimming', slug: 'swimming', parent: parents['Water Sports'] },
    { name: 'Surfing', slug: 'surfing', parent: parents['Water Sports'] },

    // Indoor & Table Games
    { name: 'Carrom', slug: 'carrom', parent: parents['Indoor & Table Games'] },
    { name: 'Chess', slug: 'chess', parent: parents['Indoor & Table Games'] },
    { name: 'Darts', slug: 'darts', parent: parents['Indoor & Table Games'] },
];

const sampleProducts = [
    { // Simple Product 1
        name: 'SG Cricket Bat - Kashmir Willow',
        description: 'A high-quality Kashmir Willow cricket bat for professional players.',
        imageUrl: 'uploads/products/placeholder.png', // Using a local placeholder
        productType: 'simple',
        categoryName: 'Cricket',
        price: 2499,
        stock: 50,
    },
    { // Simple Product 2 (UNCOMMENTED)
        name: 'Nivia Storm Football - Size 5',
        description: 'Durable, all-weather football suitable for training and matches.',
        imageUrl: 'uploads/products/placeholder.png', // Using a local placeholder
        productType: 'simple',
        categoryName: 'Football',
        price: 899,
        stock: 150,
    },

    { // Variant Product 1
        name: 'Pro-Fit Training T-Shirt',
        description: 'A breathable, sweat-wicking t-shirt perfect for any workout.',
        imageUrl: 'uploads/products/placeholder.png',
        productType: 'variant',
        categoryName: 'Gym Equipment',
        optionNames: ['Color', 'Size'],
        variants: [
            { sku: 'TS-BLK-M', options: [{ name: 'Color', value: 'Black' }, { name: 'Size', value: 'M' }], price: 799, stock: 100 },
            { sku: 'TS-BLK-L', options: [{ name: 'Color', value: 'Black' }, { name: 'Size', value: 'L' }], price: 799, stock: 120 },
            { sku: 'TS-BLU-M', options: [{ name: 'Color', value: 'Blue' }, { name: 'Size', value: 'M' }], price: 849, stock: 80 },
        ]
    },
    { // Variant Product 2
        name: 'Yonex Badminton Racquet',
        description: 'Lightweight and powerful racquet for intermediate players.',
        imageUrl: 'uploads/products/placeholder.png',
        productType: 'variant',
        categoryName: 'Badminton',
        optionNames: ['Grip Size'],
        variants: [
            { sku: 'YBR-G4', options: [{ name: 'Grip Size', value: 'G4' }], price: 1999, stock: 40 },
            { sku: 'YBR-G5', options: [{ name: 'Grip Size', value: 'G5' }], price: 1999, stock: 35 },
        ]
    },
];


// --- INTELLIGENT SEEDER FUNCTIONS ---

const seedLocations = async () => {
    if (locationData.length === 0) return console.log('No location data to seed.');
    console.log('Seeding locations...');
    // This is a setup task, so clearing old data is acceptable.
    await Location.deleteMany({});
    await Location.insertMany(locationData);
    console.log('Locations seeded successfully!');
};

const seedCategories = async () => {
    if (categoryData.length === 0) return console.log('No category data to seed.');
    console.log('Seeding categories...');
    // This is a setup task, so clearing old data is acceptable.
    await Category.deleteMany({});
    const createdParents = await Category.insertMany(categoryData);
    const parentMap = createdParents.reduce((acc, curr) => {
        acc[curr.name] = curr._id;
        return acc;
    }, {});
    await Category.insertMany(subCategoryData(parentMap));
    console.log('Categories seeded successfully!');
};

// --- CLEANED UP PRODUCT SEEDER ---
const seedProducts = async () => {
    if (sampleProducts.length === 0) return console.log('No sample products to seed.');

    console.log('Seeding sample products...');
    // 1. Clear all existing products for a fresh start.
    await Product.deleteMany({});
    console.log('Existing products cleared.');

    const categories = await Category.find();
    if (categories.length === 0) {
        return console.error('Cannot seed products because no categories exist. Please seed categories first.');
    }
    const categoryMap = categories.reduce((map, cat) => {
        map[cat.name] = cat._id;
        return map;
    }, {});

    // 2. Loop and create each product directly.
    for (const productData of sampleProducts) {
        const { categoryName, ...restOfProductData } = productData;
        const categoryId = categoryMap[categoryName];


        if (categoryId) {
            await Product.create({ ...restOfProductData, category: categoryId });
            console.log(`Created: ${productData.name}`);
        } else {
            console.warn(`Category "${categoryName}" not found for product "${productData.name}". Skipping.`);
        }
    }
    console.log('Product seeding complete!');
};

// --- MAIN RUNNER ---
const runSeed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');

        // --- NEW: AUTOMATICALLY DROP THE OLD, FAULTY INDEX ---
        // This block will run every time, ensuring the wrong index is gone.
        console.log('Checking for and removing old product indexes...');
        const productCollection = mongoose.connection.collection('products');
        try {
            // This is the name of the index from your error message
            await productCollection.dropIndex("variants.sku_1");
            console.log('Successfully dropped old, non-sparse index.');
        } catch (err) {
            // It's okay if this fails. It just means the index didn't exist.
            if (err.codeName === 'IndexNotFound') {
                console.log('Old index not found, which is good.');
            } else {
                // If it's another error, we should see it.
                throw err;
            }
        }
        const seedType = process.argv[2]?.split('=')[1] || 'all';

        if (seedType === 'all' || seedType === 'locations') await seedLocations();
        if (seedType === 'all' || seedType === 'categories') await seedCategories();
        if (seedType === 'all' || seedType === 'products') await seedProducts();

    } catch (err) {
        console.error('Seeding Error:', err.message);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
};

runSeed();

