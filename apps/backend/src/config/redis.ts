import { createClient } from "redis";

let redisClient: any = null;

if (process.env.NODE_ENV !== "test") {
  redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
  });

  redisClient.on("error", (err: any) => {
    console.error("Redis error:", err);
  });

  (async () => {
    await redisClient.connect();
    console.log("Redis connected");
  })();
}

export default redisClient;
