const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@raufuprezensinc.hztjo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

app.get('/', (req, res) => {
      res.send('Welcome To Service Boy Server!');
})

client.connect(err => {
      const adminCollection = client.db("serviceboy").collection("admin");
      const reviewCollection = client.db("serviceboy").collection("review");
      const serviceCollection = client.db("serviceboy").collection("services");


      app.post("/addAdmin", (req, res) => {
            const admin = req.body;
            adminCollection.insertOne(admin)
                  .then(result => {
                        res.redirect('/')
                  })
      })

      app.post("/addReview", (req, res) => {
            const review = req.body;
            reviewCollection.insertOne(review)
                  .then(result => {
                        res.redirect('/')
                  })
      })

      app.get("/reviews", (req, res) => {
            reviewCollection.find({})
                  .toArray((err, documents) => {
                        res.send(documents);
                  })
      })

      app.post("/addService", (req, res) => {
            const service = req.body;
            serviceCollection.insertOne(service)
                  .then(result => {
                        res.redirect('/')
                  })
      })

      app.get("/services", (req, res) => {
            serviceCollection.find({})
                  .toArray((err, documents) => {
                        res.send(documents);
                  })
      })

      app.delete('/delete/:id', (req, res) => {
            serviceCollection.deleteOne({ _id: ObjectId(req.params.id) })
                  .then(result => {
                        res.send(result.deletedCount > 0);
                  })
      })

      app.get('/services/:id', (req, res) => {
            serviceCollection.find({ _id: ObjectId(req.params.id) })
                .toArray((err, documents) => {
                    res.send(documents[0]);
                })
        })

});


app.listen(process.env.PORT || port);