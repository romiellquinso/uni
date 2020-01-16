// Import required packages
const express = require("express");
const bodyParser = require("body-parser");

// create and configure the express app
//const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
const MongoClient = require("mongodb").MongoClient;

// Storing url taken from mongoDB
const url = "mongodb+srv://admin:admin@cluster0-azyez.mongodb.net/test?retryWrites=true&w=majority";
//let db;


//stuff
const db = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
    console.log("MongoDB is Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

// The index route
app.get("/", function (req, res) {
    res.send("Battleship Leaderboards API!");
});

// Connect to the database using url
(async () => {
    let client = await MongoClient.connect(
        url,
        { useNewUrlParser: true }
    );

    db = client.db("Players");

    app.listen(PORT, async function () {
        console.log(`Listening on Port ${PORT}`);
        if (db) {
            console.log("Database is Connected!");
        }
    });
})();

// create new player
app.post("/players", async function (req, res) {
    // get information of player from POST body data
    let { username, score } = req.body;

    // check if the username already exists
    const alreadyExisting = await db
        .collection("players")
        .findOne({ username: username });

    if (alreadyExisting) {
        res.send({ status: false, msg: "player username already exists" });
        console.log(`Failed to add ${username}. Username already exists`)
    } else {
        // create the new player
        await db.collection("players").insertOne({ username, score });
        console.log(`Created Player ${username}`);
        res.send({ status: true, msg: "player created" });
    }
});

// updating player scores
app.put("/players", async function (req, res) {
    let { username, score } = req.body;
    // check if the username already exists
    const alreadyExisting = await db
        .collection("players")
        .findOne({ username: username });
    if (alreadyExisting) {
        // Update player object with the username
        await db
            .collection("players")
            .updateOne({ username }, { $set: { username, score } });
        console.log(`Player ${username} score updated to ${score}`);
        res.send({ status: true, msg: "player score updated" });
    } else {
        res.send({ status: false, msg: "player username not found" });
    }
});

// deleting players
app.delete("/players", async function (req, res) {
    let { username, score } = req.body;
    // check if the username already exists
    const alreadyExisting = await db
        .collection("players")
        .findOne({ username: username });

    if (alreadyExisting) {
        await db.collection("players").deleteOne({ username });
        console.log(`Player ${username} deleted`);
        res.send({ status: true, msg: "player deleted successfully" });
    } else {
        res.send({ status: false, msg: "username not found" });
    }
});

// accessing and formatting leaderboard
app.get("/players", async function(req, res) {
    // retrieve ‘lim’ from the query string info
    let { lim } = req.query;
    db.collection("players")
        .find()
        // -1 is for descending and 1 is for ascending
        .sort({ score: -1 })
        // Show only [lim] players
        .limit(parseInt(lim))
        .toArray(function(err, result) {
            if (err)
                res.send({ status: false, msg: "failed to retrieve players" });
            console.log(Array.from(result));
            res.send({ status: true, msg: result });
        });
 });