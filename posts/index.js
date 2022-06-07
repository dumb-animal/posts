const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const PORT = 80;
const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST"] }))
app.use(express.json());

const posts = [];

app.get("/posts", (req, res) => {
  res.status(200).send(posts);
});

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  const post = { title, id };
  posts.push(post);

  await axios.post("http://event-broker-service/events", {
    type: "postCreated",
    data: post
  });

  res.status(200).send(post);
});

app.post("/events", (req, res) => {
  console.log("Event received: ", req.body.type);
  res.status(204).send()
});

app.listen(PORT, () => {
  console.log(`Server has been started on port: ${PORT}`)
});