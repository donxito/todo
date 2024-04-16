
const express = require("express");
const bodyParser = require("body-parser")
const pg = require("pg");

const app = express();
const port = 3000;

// Create a new PostgreSQL client instance

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "miguel",
  port: 4000,
});

db.connect();  // Connect to the PostgreSQL database

// Middleware

app.use(bodyParser.urlencoded({ extended: true }));    // Parse URL-encoded bodies

app.use(express.static("public"));  // Serve static files from the 'public' directory


// Global variables

let items = [];  // Array to store items temporarily

// Routes

// GET items
app.get("/", async (req, res) => {
  // Retrieve items from the database and render them using an EJS template
  const result = await db.query("SELECT * FROM items ORDER BY id ASC");
  items = result.rows;
  res.render("index.ejs", {
    listTitle: "TO DO LIST",
    listItems: items,
  });
});

// POST ADD items
app.post("/add", async (req, res) => {
  // Extract the new item from the request body
  const item = req.body.newItem;
  try {
    // Insert the new item into the database
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    // Redirect to the home page after adding the item
    res.redirect("/");
  } catch (err) {
    // Log any errors that occur
    console.log(err);
  }
});

// POST UPDATE items
app.post("/edit", async (req, res) => {
  // Extract the updated item and its ID from the request body
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    // Update the item in the database
    await db.query("UPDATE items SET title = ($1) WHERE id = ($2)", [item, id]);
    // Redirect to the home page after updating the item
    res.redirect("/");
  } catch (err) {
    // Log any errors that occur
    console.log(err);
  }
});

// POST DELETE items
app.post("/delete", async (req, res) => {
  // Extract the ID of the item to be deleted from the request body
  const id = req.body.deleteItemId;

  try {
    // Delete the item from the database
    await db.query("DELETE FROM items WHERE id = ($1)", [id]);
    // Redirect to the home page after deleting the item
    res.redirect("/");
  } catch (err) {
    // Log any errors that occur
    console.log(err);
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
