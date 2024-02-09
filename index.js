import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "12345",
  port: 5432
})

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//FOR SOLUTION - 1 

// app.get("/", async (req, res) => {
//   //Write your code here.
//   const result = await db.query("SELECT country_code FROM visited_countries");
//   let countries = [];
//   result.rows.forEach((country) => {
//     countries.push(country.country_code);
//   })
//   //Foreach is done here to count the the total countries and send a readymade string in the form of array (but hte datatype after reaching will still be string but will in array form)
//   console.log(countries);
//   res.render("index.ejs", { countries: countries, total: countries.length });

// });

//FOR SOLUTION - 2

async function checkVisisted() {
  const result = await db.query("SELECT country_code FROM visited_countries");

  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

// GET home page
app.get("/", async (req, res) => {
  const countries = await checkVisisted();
  res.render("index.ejs", { countries: countries, total: countries.length });
});

//INSERT new country
app.post("/add", async (req, res) => {
  const input = req.body["country"];

  const result = await db.query(
    "SELECT country_code FROM countries WHERE country_name = $1",
    [input]
  );
  if (result.rows.length > 0) {
    const data = result.rows[0];
    console.log(data);
    const countryCode = data.country_code;

    await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [
      countryCode,
    ]);

    res.redirect("/");
  } else {
    console.log("No rows found in the result.");
    res.render("/");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
