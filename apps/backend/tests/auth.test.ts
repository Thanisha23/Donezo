import request from "supertest";
import app from "../src/app";
import { connectDB, closeDB } from "./setup";

process.env.NODE_ENV = "test";


beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await closeDB();
});

describe("Auth API", () => {
  it("should signup a new user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        name: "Test User",
        email: "test@test.com",
        password: "password123",
      });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("test@test.com");
    expect(res.body.token).toBeDefined();
  });

  it("should login user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "test@test.com",
        password: "password123",
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
