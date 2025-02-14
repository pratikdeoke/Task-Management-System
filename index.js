import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  database: "permalist",
  host: "localhost",
  password: "pass123",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

async function displayItems() {
  try {
    const result = await db.query("Select * from items order by id asc");
  // console.log(result.rows[0]);
  return result;
  } catch (error) {
    console.log(error);
  }
}

app.get("/", async (req, res) => {
  const result = await displayItems();
  items = result.rows;
  console.log(items);
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  try {
    const item = req.body.newItem;
    // items.push({ title: item });
    const result = await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/edit", async (req, res) => {
  const updatedItemId = req.body.updatedItemId;
  const updatedItemtitle = req.body.updatedItemTitle;
  console.log(updatedItemId);
  console.log(updatedItemtitle);
  try {
    const result = await db.query(
    "Update items set title = ($1) WHERE id = ($2)", [updatedItemtitle, updatedItemId]
  )
  console.log(result);

  res.redirect("/");
  } catch (error) {
    console.log(error);
  }

});

app.post("/delete", async (req, res) => {
  const deleteItemId = req.body.deleteItemId;

  try {
    const result = await db.query(
      "Delete from items where id = ($1)", [deleteItemId]
    )
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
  
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
