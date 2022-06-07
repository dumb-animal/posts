const express = require("express");
const cors = require("cors");
const axios = require("axios");

const PORT = 80;
const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST"] }))
app.use(express.json());

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;
  events.push(event);
  console.log("Event received:", event.type);
  axios.post("http://posts-service/events", event).catch(() => { });
  axios.post("http://comments-service/events", event).catch(() => { });
  axios.post("http://moderation-service/events", event).catch(() => { });
  axios.post("http://query-service/events", event).catch(() => { });;

  res.status(204).send();
});

app.get("/events", (req, res) => {
  res.status(200).send(events);
});

app.listen(PORT, () => {
  console.log(`Server has been started on port: ${PORT}`)
})