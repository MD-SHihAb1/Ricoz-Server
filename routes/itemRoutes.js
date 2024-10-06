const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

let productCollection;

// Set collections function
const setCollections = (collections) => {
  productCollection = collections.productCollection;
};

// Product Post API
router.post('/product', async (req, res) => {
  try {
    const product = req.body;
    const result = await productCollection.insertOne(product);
    res.json(result); // Respond with JSON
  } catch (error) {
    console.error('Error inserting product:', error);
    res.status(500).json({ error: 'Failed to insert product' });
  }
});

// Product Get API
router.get('/product', async (req, res) => {
  try {
    const cursor = productCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/product/:id', async(req, res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id) };
  const product = await productCollection.findOne(query);
  res.send(product);
})




router.patch('/product/:id', async(req, res) => {
  const id = req.params.id;
  const filter ={ _id: new ObjectId(id)}
  const options = {upsert: true};
  const updatedProduct = req.body;
  const product ={
    $set: {
      img: updatedProduct.img,
      name: updatedProduct.name,
      title: updatedProduct.title,
      price: updatedProduct.price,
    }
  }


  const result = await productCollection.updateOne(filter, product, options)
  res.send(result);

})





// Export the router and setCollections function
module.exports = { router, setCollections };
