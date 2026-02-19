import request from "supertest";
import app from "../src/app";
import { connectDB, closeDB } from "./setup";

process.env.NODE_ENV = "test";

let token: string;
let taskId: string;

beforeAll(async () => {
  await connectDB();

  const res = await request(app)
    .post("/api/v1/auth/signup")
    .send({
      name: "Task Tester",
      email: "task@test.com",
      password: "password123",
    });

  token = res.body.token;
});

afterAll(async () => {
  await closeDB();
});

describe("Task API", () => {
  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/v1/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "Testing task creation",
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Test Task");

    taskId = res.body._id;
  });

  it("should get tasks", async () => {
    const res = await request(app)
      .get("/api/v1/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.tasks.length).toBeGreaterThan(0);
  });

  it("should update task", async () => {
    const res = await request(app)
      .put(`/api/v1/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "completed",
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("completed");
  });

  it("should delete task", async () => {
    const res = await request(app)
      .delete(`/api/v1/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Task deleted successfully");
  });
});
