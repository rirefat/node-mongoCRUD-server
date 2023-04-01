const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database access information
// name: dbUser4 pass: 5ByqL9HCIovMbr6i
// name: dbUser1 pass: IYENMvUs3govSFFa


// ===========================================================================================================================

const uri = "mongodb+srv://dbUser1:IYENMvUs3govSFFa@cluster0.3sgpu1h.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const usersCollection = client.db("mongoCRUD").collection("users");

        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = usersCollection.find(query);
            const users = await cursor.toArray()
            res.send(users);
        });

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await usersCollection.findOne(query);
            res.send(result);
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateUser = {
                $set: {
                    name: user.name, email: user.email
                },
            };
            const result = await usersCollection.updateOne(query, updateUser, options);
            res.send(result);
            console.log("user info updated")
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(user);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            console.log("data inserted to db");
        });

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });

    } finally {

    }
}
run().catch(console.dir);

// ===========================================================================================================================


app.get('/', (req, res) => {
    res.send("Node server is running");
});

app.listen(port, () => {
    console.log(`Node JS server is running on ${port}`);
})
