const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const fileUpload = require('express-fileupload');
require('dotenv').config();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tkr6o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db('Hero_Rider');
        const houseCollection = database.collection('house');
        const orderCarCollection = database.collection('orderCar');
        const UsersCollection = database.collection('users');
        const reviewCollection = database.collection('review');

        //GET API
        app.get('/products', async (req, res) => {
            const cursor = houseCollection.find({});
            const service = await cursor.toArray();
            res.send(service);
        })
        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find({});
            const review = await cursor.toArray();
            res.send(review);
        })
        app.get('/CustomerInfo', async (req, res) => {
            const cursor = orderCarCollection.find({});
            const orderProduct = await cursor.toArray();
            res.json(orderProduct);
        })
        app.get('/MyOrderInfo', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = orderCarCollection.find(query);
            const orderProduct = await cursor.toArray();
            res.json(orderProduct);
        })
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await houseCollection.findOne(query);
            console.log('Load services', id);
            res.send(result);
        })
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await UsersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })
        // POST API
        app.post('/products', async (req, res) => {
            const newServices = req.body;
            const result = await houseCollection.insertOne(newServices)
            console.log('New ', req.body);
            console.log('added ', result);
            res.json(result);
        })
        app.post('/CustomerInfo', async (req, res) => {
            const newServices = req.body;
            const result = await orderCarCollection.insertOne(newServices)
            console.log('New ', req.body);
            console.log('added ', result);
            res.json(result);
        })
        app.post('/users', async (req, res) => {
            const user = req.body;
            // const pic = req.files.image;
            // const picData = pic.data;
            // const encodePic = picData.toString('base64');
            // const img = Buffer.from(encodePic, 'base64')
            const result = await UsersCollection.insertOne(user)
            console.log('added ', result);
            res.json(result);
        })
        app.post('/review', async (req, res) => {
            const review = req.body;
            console.log(review)
            const result = await reviewCollection.insertOne(review)
            console.log('added ', result);
            res.json(result);
        })

        //PUT
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await UsersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })
        app.put('/products/61c0d707f2634684524bbfc3', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await houseCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log('put', user)
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await UsersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })
        app.put('/CustomerInfo/status', async (req, res) => {
            const id = req.body;
            const query = { _id: ObjectId(id) };
            const updateDoc = { $set: { "status": 'approved' } };
            const result = await orderCarCollection.updateOne(query, updateDoc);
            res.json(result);
            console.log('put', user)
        })
        //Delete API
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await houseCollection.deleteOne(query);
            console.log('deleting..', result);
            res.json(result);
        })
        app.delete('/CustomerInfo/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCarCollection.deleteOne(query);
            console.log('deleting..', result);
            res.json(result);
        })

    }
    finally {

    }
}
run().catch(console.dir)
console.log(uri)
app.get('/', (req, res) => {
    res.send('Hello World.....')
})
app.listen(port, () => {
    console.log(`listening at ${port}`)
})

