const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const MongoClient = require("mongodb").MongoClient;

const app = express();

// Middleware to parse the incoming request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Connection URL
const url = "mongodb://127.0.0.1:27017";

// Database Name
const dbName = "surveyDB";

// Create a new MongoClient
const client = new MongoClient(url);

app.post("/submit-survey", async (req, res) => {
  // The form data is available in req.body
  const formData = req.body;


  // Now you can use this data to save to a database or perform any other actions

  try {
    await client.connect();
    console.log("Connected correctly to server");
    const db = client.db(dbName);

    // Insert the form data into the "surveys" collection
    const result = await db.collection("surveys").insertOne(formData);
    console.log("Inserted document into the collection", result);

    // Send a response back to the client
    res.json({ message: "Form submitted successfully" });
  } catch (err) {
    console.log(err.stack);
    res.json({ message: "Error saving form data" });
  }
});

app.get('/api/survey-results', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
  
      // Fetch all documents from the "surveys" collection
      const surveys = await db.collection('surveys').find({}).toArray();
  
      // Send the results back to the client
      res.json(surveys);
    } catch (err) {
      console.log(err.stack);
      res.status(500).json({ message: "Error fetching survey results" });
    }
  });



app.get('/survey-results', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/ResulT.html'));
  });

app.listen(3000, () => console.log("Server is running on port 3000"));
