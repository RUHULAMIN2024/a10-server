const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin:"*",
}));
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER}@cluster0.rth5hqd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const touristsSpot = client.db("touristsDB").collection("tourists");
        const countryName = client.db("touristsDB").collection("countryName");

        app.get('/tourist-spots', async (req, res) => {
            const cursor = touristsSpot.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/country-name', async (req, res) => {
            const cursor = countryName.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/tourist-spots/:email', async (req, res) => {
            const result = await touristsSpot.find({ userEmail: req.params.email }).toArray();
            res.send(result)
        })
        app.get('/countryBasespots/:country', async (req, res) => {
            const result = await touristsSpot.find({ country_Name: req.params.country }).toArray();
            res.send(result)
        })

        app.get('/single-spot/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await touristsSpot.findOne(query);
            res.send(result)
        })

        app.post('/tourist-spots', async (req, res) => {
            const newSpot = req.body;
            const result = await touristsSpot.insertOne(newSpot);
            res.send(result)
        })

        app.put('/tourist-spots/:id', async (req, res) => {
            const id = req.params.id;
            const spot = req.body;
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const updatedSpot = {
                $set: {
                    tourists_spot_name:spot.tourists_spot_name,
                    country_Name:spot.country_Name,
                    location:spot.location,
                    image:spot.image,
                    short_description:spot.short_description,
                    average_cost:spot.average_cost,
                    seasonality:spot.seasonality,
                    travel_time:spot.travel_time,
                    total_visitors_per_year:spot.total_visitors_per_year,
                }
            }
            const result = await touristsSpot.updateOne(filter, updatedSpot, option);
            res.send(result)
        })


        app.delete('/tourist-spots/:id', async (req, res) => {
            id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await touristsSpot.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {res.send('Server is runing')})

app.listen(port);



