import express from "express";
import { pool } from "./db.js";

const app = express();
app.use(express.json());

app.get("/issues", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM issues ORDER BY id"
  );

  res
    .status(200)
    .type("json")
    .send(JSON.stringify(result.rows, null, 2) + "\n");
});

app.post("/issues", async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).send("title is required\n");
  }

  const result = await pool.query(
    "INSERT INTO issues (title) VALUES ($1) RETURNING *",
    [title]
  );

  res
    .status(201)
    .type("json")
    .send(JSON.stringify(result.rows[0], null, 2) + "\n");
});

app.patch("/issues/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await pool.query(
    "UPDATE issues SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).send("Issue not found\n");
  }

  res
    .status(200)
    .type("json")
    .send(JSON.stringify(result.rows[0], null, 2) + "\n");
});

app.delete("/issues/:id", async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "DELETE FROM issues WHERE id = $1 RETURNING *",
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).send("issue not found\n");
  }

  res
    .status(200)
    .type("json")
    .send(JSON.stringify(result.rows[0], null, 2) + "\n");
});

app.use((req, res) => {
  res.status(404).send("not found\n");
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});