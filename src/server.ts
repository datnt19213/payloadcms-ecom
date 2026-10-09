import express from "express";
import payload from "payload";
import path from "path";

const Redis = require("ioredis");
require("dotenv").config();

const redisURI = process.env.REDIS_URL;
const redis = new Redis(redisURI);

redis.on("connect", () => {
  console.log("Connected to Redis!");
});

redis.on("error", (err) => {
  console.error("Redis error", err);
});

const app = express();
app.use(express.json());

// Redirect root to Admin panel
app.get("/", (_, res) => {
  res.redirect("/admin");
});

app.post("/save-token", async (req, res) => {
  const { userId, token } = req.body;
  if (!userId || !token) {
    return res.status(400).send("User ID and token are required.");
  }

  try {
    await redis.set(`userToken:${userId}`, token, "EX", 86400);
    res.send("Token saved successfully.");
  } catch (error) {
    console.error("Failed to save token:", error);
    res.status(500).send("Failed to save token.");
  }
});

app.get("/get-token/:userId", async (req, res) => {
  const userId = req.params.userId; // Lấy userId từ URL parameter

  if (!userId) {
      return res.status(400).send("User ID is required.");
  }

  try {
      const token = await redis.get(`userToken:${userId}`);
      if (token) {
          res.json({ userId, token }); // Gửi token trở lại cho client
      } else {
          res.status(404).send("Token not found for the provided user ID.");
      }
  } catch (error) {
      console.error("Failed to retrieve token:", error);
      res.status(500).send("Server error while retrieving token.");
  }
});

const start = async () => {
  // Initialize Payload
  app.use(
    "/media/images",
    express.static(path.resolve(__dirname, "./media/images"))
  );
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  // Add your own express routes here

  app.listen(3000);
};

start();
