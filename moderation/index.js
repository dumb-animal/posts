const express = require("express");
const cors = require("cors");
const axios = require("axios");

const PORT = 80;
const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST"] }))
app.use(express.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  console.log("Event received: ", type);

  switch (type) {
    case "commentCreated": {
      const status = data.content.includes("orange") ? "rejected" : "approved";

      await axios.post("http://event-broker-service/events", {
        type: "commentModerated",
        data: { ...data, status }
      });
    };
  };

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server has been started on port: ${PORT}`)
})