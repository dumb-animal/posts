const expres = require("express");
const cors = require("cors");
const axios = require("axios");

const PORT = 80;
const app = expres();

app.use(cors({ origin: "*", methods: ["GET", "POST"] }))
app.use(expres.json());

const posts = [];

const handleEvent = ({ type, data }) => {
  switch (type) {
    case "postCreated": {
      data.comments = [];
      posts.push(data);
      break;
    };
    case "commentCreated": {
      const { postId, ...comment } = data;
      const idx = posts.findIndex((post) => post.id === postId);
      if (idx !== -1) posts[idx].comments.push({ ...comment });
      break;
    };
    case "commentUpdated": {
      const { postId, id: commentId } = data;

      const postIdx = posts.findIndex((post) => post.id === postId);
      if (postIdx === -1) break;

      const commentIdx = posts[postIdx].comments.findIndex((comment) => comment.id === commentId);
      if (commentIdx === -1) break;

      posts[postIdx].comments[commentIdx] = data;
      break;
    };
  };
}

app.get("/posts", (req, res) => {
  res.status(200).json(posts);
});

app.post("/events", (req, res) => {
  console.log("Event received: ", req.body.type);
  handleEvent(req.body);
  res.status(204).send();
});

app.listen(PORT, async () => {
  console.log(`Server has been started on port: ${PORT}`);

  const res = await axios.get("http://event-broker-service/events").catch(() => { return { data: [] } });
  console.log("Preloaded events: ", res.data);
  res.data.forEach((event) => {
    console.log(`Proceccing event: ${event.type}`);
    handleEvent(event);
  });
});