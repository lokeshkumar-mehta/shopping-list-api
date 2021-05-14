const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/shoppingList";

MongoClient.connect(url, {
  useUnifiedTopology: true
}, function(err, db) {
  if (err) throw err;

  var dbo = db.db("shoppingList");

    const listCollection = dbo.collection("list")
    
    app.use(
      cors({
        origin: 'http://localhost:3000'
      })
    );

    app.use(express.json())

    app.post('/list', (req, res) => {
      const { body } = req;
      const item = { name: body.name, list: body.list };

      listCollection.insertOne(item).then(() => {
        res.status(200).send(
          {
            message: "Record inserted successfully"
          }
        );
      }).catch((err) => {
        res.status(500).send(
          {
            message: "Error submitting lis",
            errorMessage: err
          }
        );
      });
    });
    
    app.get('/list', (req, res) => {
      listCollection.find().toArray().then(data => {
        res.status(200).send(data);
      }).catch(err => {
        res.status(500).send(
          {
            message: "Error getting data",
            errorMessage: err
          }
        );
      });
    });

    // listCollection.drop()
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
