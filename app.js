const express = require("express");
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");

const app = express();

app.use(express.json());

const databasePath = path.join(__dirname, "todoApplication.db");

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();
const db = new sqlite3.Database("todoApplication.db");

db.run(`
    CREATE TABLE IF NOT EXISTS todo(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        todo VARCHAR,
        priority VARCHAR,
        status VARCHAR
    );
    `);

app.put("/todos", async (request, response) => {
  const createTableQuery = `
    INSERT INTO 
     todo (id, todo, priority, status)
     VALUES (1, "Learn HTML", "HIGH", "TO DO"),
            (2, "Learn JS", "MEDIUM", "IN PROGRESS"),
            (3, "Learn CSS", "LOW", "DONE");
    `;
  const tableArray = await database.run(createTableQuery);
  response.send(tableArray);
});

app.get("/todos/?status=TO%20DO", async (request, response) => {
  const getAllQuery = `
    SELECT * 
    FROM
    todo
    WHERE status = 'TO DO';
    `;
  const listArray = await database.all(getAllQuery);
  response.send(listArray);
});
module.exports = app;
