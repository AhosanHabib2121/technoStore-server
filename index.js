const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
const {MongoClient,ServerApiVersion, ObjectId} = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eyrntjs.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {    
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const productCollection = client.db("technoStoreDB").collection("products");
        const brandsCollection = client.db("technoStoreDB").collection("brands");
        const userCollection = client.db("technoStoreDB").collection("user");
        const addToCartCollection = client.db("technoStoreDB").collection("addToCart");

        // --------------user collection start-----------
        app.post('/user', async (req, res) => {
            const userData = req.body;
             const result = await userCollection.insertOne(userData);
             res.send(result);
        })

        app.patch('/user', async (req, res) => {
            const userData = req.body;
            const filter = { email: userData.email };
            const updateUser = {
                $set: {
                    lastLoginAt: userData.lastLoginAt
                },
            }
            const result = await userCollection.updateOne(filter, updateUser);
            res.send(result);
        })
        // --------------user collection end-----------


        // --------------brand collection start-----------
        // get brand
        app.get('/brand', async (req, res) => {
            const cursor = brandsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // add brand (post)
        app.post('/brand', async (req, res) => {
            const brandData = req.body;
            const result = await brandsCollection.insertOne(brandData);
            res.send(result);
        })
        // --------------brand collection end-----------

        // --------------product collection start-----------
         // all data get
        app.get('/product', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // get single data depend brand name
        app.get('/product/:brandName', async (req, res) => {
            const brandName = req.params.brandName;
            const query = {brand_name: brandName};
            const result = await productCollection.find(query).toArray()
            res.send(result)
        })


        // add product data(post)
        app.post('/product', async (req, res) => {
            const productData = req.body;
            const result = await productCollection.insertOne(productData);
            res.send(result);
        })

        // product update (put)
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const productData = req.body;
            const filter = { _id: new ObjectId(id)};
            const options = { upsert: true };
            const updateProduct = {
                $set: {
                    product_name:productData.product_name,
                    product_image:productData.product_image,
                    brand_name:productData.brand_name,
                    category:productData.category,
                    price:productData.price,
                    rating:productData.rating,
                },
            };
            const result = await productCollection.updateOne(filter, updateProduct, options)    
            res.send(result);
        })

        // --------------product collection end-----------
        
        // --------------cart collection start-----------
        // get
        app.get('/cart', async (req, res) => {
             const cursor = addToCartCollection.find();
             const result = await cursor.toArray();
             res.send(result);
        })

        // post
        app.post('/cart', async (req, res) => {
            const cartData = req.body;
            const result = await addToCartCollection.insertOne(cartData);
            res.send(result);
        })

        // delete
        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id)};
            const result = await addToCartCollection.deleteOne(query);
            res.send(result);
        })
        // --------------cart collection end-----------





        // Send a ping to confirm a successful connection
        await client.db("admin").command({
            ping: 1
        });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('TechnoStore server coming...')
})

app.listen(port, () => {
    console.log(`TechnoStore server on port ${port}`)
})