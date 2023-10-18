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

        // --------------product collection end-----------





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