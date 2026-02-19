import { Request, Response } from "express";
import Task from "../models/Task";
import redisClient from "../config/redis";

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

const invalidateUserTasksCache = async (userId: string) => {
  if (!redisClient) return;
  const keys = await redisClient.keys(`tasks:${userId}:*`);

  if (keys.length > 0) {
    await redisClient.del(keys);
    console.log("Cache invalidated");
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      owner: req.user!.userId,
    });

    await invalidateUserTasksCache(req.user!.userId);

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = "1", limit = "10" } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);

    const filter: any = { owner: req.user!.userId };

    if (status) {
      if (!["pending", "completed"].includes(status as string)) {
        return res.status(400).json({ message: "Invalid status filter" });
      }
      filter.status = status;
    }
    const cacheKey = `tasks:${req.user!.userId}:${pageNumber}:${limitNumber}:${status || "all"}`;
    let cachedData = null;

    if (redisClient) {
      cachedData = await redisClient.get(cacheKey);
    }

    if (cachedData) {
      console.log("Serving from Redis");
      return res.status(200).json(JSON.parse(cachedData));
    }

    console.log("Fetching from MongoDB");

    const totalTasks = await Task.countDocuments(filter);

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const response = {
      total: totalTasks,
      page: pageNumber,
      totalPages: Math.ceil(totalTasks / limitNumber),
      tasks,
    };

    if (redisClient) {
      await redisClient.setEx(cacheKey, 60, JSON.stringify(response));
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      _id: id,
      owner: req.user!.userId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    Object.assign(task, req.body);

    await task.save();
    await invalidateUserTasksCache(req.user!.userId);

    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      owner: req.user!.userId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await invalidateUserTasksCache(req.user!.userId);

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
