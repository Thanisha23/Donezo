"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { inter } from "@/lib/fonts";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      localStorage.setItem("token", data.token);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#f8f7ff] ${inter.className} flex flex-col items-center justify-center px-6`}>
     
      <div className="mb-8">
        <img
          src="/logo.png"
          alt="Donezo"
          className="h-16 w-auto"
        />
      </div>

      <Card className="w-full max-w-md bg-white/70 backdrop-blur-sm border border-neutral-200 shadow-sm rounded-3xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-medium text-neutral-800">
            Welcome Back
          </CardTitle>
          <p className="text-neutral-500 text-sm">
            Login to continue managing your tasks
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <Input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              required
            />

            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              required
            />


            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#9b87f5] hover:bg-[#8a76e8] text-white"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="text-center mt-6 text-sm text-neutral-500">
            Don't have an account?{" "}
            <span
              className="text-[#9b87f5] cursor-pointer hover:underline"
              onClick={() => router.push("/signup")}
            >
              Sign up
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}