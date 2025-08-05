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
];
const subCategoryData = (parents) => [
    { name: 'Cricket', slug: 'cricket', parent: parents['Team Sports'] },
    { name: 'Football', slug: 'football', parent: parents['Team Sports'] },
    { name: 'Badminton', slug: 'badminton', parent: parents['Racquet Sports'] },
    { name: 'Gym Equipment', slug: 'gym-equipment', parent: parents['Fitness & Training'] },
];
// ----------------------------------------------------------------------------------
// --- THE MAIN CHANGE YOU REQUESTED ---
// This array now holds all your sample product data.
// TO PREVENT SEEDING ANY PRODUCTS, SIMPLY MAKE THIS ARRAY EMPTY: const sampleProducts = [];
// ----------------------------------------------------------------------------------
const sampleProducts = [
    { // Simple Product
        name: 'SG Cricket Bat',
        description: 'A high-quality Kashmir Willow cricket bat for professional players.',
        imageUrl: 'https://via.placeholder.com/300x300.png?text=Cricket+Bat',
        productType: 'simple',
        categoryName: 'Cricket', // We will find the ID for this category name
        price: 2499,
        stock: 50,
    },
    { // Variant Product
        name: 'Pro-Fit Training T-Shirt',
        description: 'A breathable, sweat-wicking t-shirt perfect for any workout.',
        imageUrl: 'https://via.placeholder.com/300x300.png?text=Training+T-Shirt',
        productType: 'variant',
        categoryName: 'Gym Equipment', // We will find the ID for this
        optionNames: ['Color', 'Size'],
        variants: [
            { sku: 'TS-BLK-M', options: [{ name: 'Color', value: 'Black' }, { name: 'Size', value: 'M' }], price: 799, stock: 100 },
            { sku: 'TS-BLK-L', options: [{ name: 'Color', value: 'Black' }, { name: 'Size', value: 'L' }], price: 799, stock: 120 },
            { sku: 'TS-BLU-M', options: [{ name: 'Color', value: 'Blue' }, { name: 'Size', value: 'M' }], price: 849, stock: 80 },
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

const seedProducts = async () => {
    if (sampleProducts.length === 0) return console.log('No sample products to seed.');

    console.log('Checking for sample products to seed...');

    const categories = await Category.find();
    if (categories.length === 0) {
        return console.error('Cannot seed products because no categories exist. Please seed categories first.');
    }
    const categoryMap = categories.reduce((map, cat) => {
        map[cat.name] = cat._id;
        return map;
    }, {});

    for (const productData of sampleProducts) {
        // --- THIS IS THE NON-DESTRUCTIVE LOGIC ---
        const existingProduct = await Product.findOne({ name: productData.name });

        if (!existingProduct) {
            console.log(`Creating sample product: ${productData.name}`);
            // Replace categoryName with the actual category ID
            const { categoryName, ...restOfProductData } = productData;
            const categoryId = categoryMap[categoryName];

            if (categoryId) {
                await Product.create({ ...restOfProductData, category: categoryId });
            } else {
                console.warn(`Category "${categoryName}" not found for product "${productData.name}". Skipping.`);
            }
        } else {
            console.log(`Sample product "${productData.name}" already exists. Skipping.`);
        }
    }
    console.log('Product seeding check complete!');
};


// --- MAIN RUNNER ---
const runSeed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');

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

