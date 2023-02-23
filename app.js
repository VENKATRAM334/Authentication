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

app.post("/%20", async (request, response) => {
  const createTableQuery = `
    INSERT INTO 
     todo (priority, status)
     VALUES ("HIGH", "TO DO"),
            ("MEDIUM", "IN PROGRESS"),
            ("LOW", "DONE");
    `;
  const tableArray = await database.run(createTableQuery);
  response.send(tableArray);
});

app.get("/todos/", async (request, response) => {
  const getAllQuery = `
    SELECT * 
    FROM
    todo
    WHERE status = 'TO DO';
    `;
  const listArray = await database.all(getAllQuery);
  response.send(listArray);
});
