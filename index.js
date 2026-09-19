import express from "express";

const app = express();
app.use(express.json());

app.get("/issues", (req, res) => {
  res.status(200).json([
    {
      id: 1,
      title: "Fix login bug",
      status: "open"
    }
  ]);
});

app.post("/issues", (req, res) => {
  console.log(req.body);

  res.status(201).json({
    message: "issue created",
    issue: req.body
  });
});

app.use((req, res) => {
  res.status(404).send("not found\n");
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});