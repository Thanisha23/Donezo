"use client";

import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { inter } from "@/lib/fonts";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { GripVertical, LogOut, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "pending" | "completed";
}

function SortableTask({
  task,
  onDelete,
}: {
  task: Task;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="mb-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-neutral-200 hover:shadow-md transition-all"
    >
      <CardContent className="p-4 flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-muted-foreground truncate">
              {task.description}
            </p>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task._id);
          }}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function Column({
  id,
  title,
  tasks,
  onDelete,
  count,
  bgColor,
}: {
  id: "pending" | "completed";
  title: string;
  tasks: Task[];
  onDelete: (id: string) => void;
  count: number;
  bgColor: string;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-3xl p-6 shadow-sm border border-neutral-200 transition-all ${bgColor} ${
        isOver ? "ring-2 ring-[#9b87f5]" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-neutral-700">{title}</h2>
        <span className="text-sm text-neutral-500">{count}</span>
      </div>

      <SortableContext
        items={tasks.map((t) => t._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="min-h-[200px]">
          {tasks.map((task) => (
            <SortableTask key={task._id} task={task} onDelete={onDelete} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { logout } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 6 },
    }),
  );

  const fetchTasks = async () => {
    try {
      const data = await apiFetch("/tasks");
      setTasks(data.tasks || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetchTasks();
    }
  }, []);

  const createTask = async () => {
    if (!title.trim()) return;

    await apiFetch("/tasks", {
      method: "POST",
      body: JSON.stringify({ title: title.trim() }),
    });

    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await apiFetch(`/tasks/${id}`, {
      method: "DELETE",
    });

    fetchTasks();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;

    let newStatus: "pending" | "completed" = task.status;

    if (over.id === "pending" || over.id === "completed") {
      newStatus = over.id;
    } else {
      const targetTask = tasks.find((t) => t._id === over.id);
      if (targetTask) {
        newStatus = targetTask.status;
      }
    }

    if (task.status === newStatus) return;

    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)),
    );

    try {
      await apiFetch(`/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      fetchTasks();
    }
  };

  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#f8f7ff] ${inter.className}`}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Donezo" className="w-25 h-auto" />
          </div>

          <Button
            variant="ghost"
            onClick={logout}
            className="text-neutral-500 hover:text-neutral-800"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="mb-10">
          <div className="flex gap-3 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm p-4 border border-neutral-200">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createTask()}
              placeholder="What needs to be done?"
              className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
            />
            <Button
              onClick={createTask}
              className="rounded-xl bg-[#9b87f5] hover:bg-[#8a76e8] text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Column
              id="pending"
              title="To Do"
              tasks={pendingTasks}
              onDelete={deleteTask}
              count={pendingTasks.length}
              bgColor="bg-[#fff6e9]"
            />

            <Column
              id="completed"
              title="Completed"
              tasks={completedTasks}
              onDelete={deleteTask}
              count={completedTasks.length}
              bgColor="bg-[#eafaf1]"
            />
          </div>
        </DndContext>
      </div>
    </div>
  );
}
