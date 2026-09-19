import express from "express";

const app = express();

app.get("/issues", (req, res) => {
  res.status(200).send("list issues\n");
});

app.post("/issues", (req, res) => {
  res.status(201).send("create issue\n");
});

app.use((req, res) => {
  res.status(404).send("not found\n");
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});