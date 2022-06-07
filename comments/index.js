const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const PORT = 80;
const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST"] }))
app.use(express.json());

const comments = [];

app.get("/posts/:id/comments", (req, res) => {
  const postComments = comments.filter(({ postId }) => postId === req.params.id);
  res.status(200).send(postComments);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comment = {
    id: commentId,
    postId: req.params.id,
    content,
    status: "pending"
  };

  comments.push(comment);

  await axios.post("http://event-broker-service/events", {
    type: "commentCreated",
    data: comment
  });

  res.status(201).send(comment);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  console.log("Event received: ", type);

  switch (type) {
    case "commentModerated": {
      const { id, status } = data;
      const idx = comments.findIndex((comment) => comment.id === id);
      comments[idx].status = status;

      await axios.post("http://event-broker-service/events", {
        type: "commentUpdated",
        data: { ...comments[idx] }
      })
    };
  };

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server has been started on port: ${PORT}`)
})