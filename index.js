const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { router: itemRoutes, setCollections } = require('./routes/itemRoutes'); // Import routes and collection setup
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5000'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oldlbnp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect to MongoDB
async function run() {
  try {
    await client.connect();

    // Set collections to be used in the routes
    const productCollection = client.db('Ricoz').collection('product');
    setCollections({ productCollection }); // Set the collections for the routes

    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
run().catch(console.error);

// Use item routes for /api
app.use('/api', itemRoutes); // Register the routes with `/api` prefix

app.get('/', (req, res) => {
  res.send('Ricoz Server is Running');
});

app.listen(port, () => {
  console.log(`Ricoz Server is running on port ${port}`);
});
