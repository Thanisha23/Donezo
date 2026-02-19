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

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify(form),
      });

      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${inter.className} bg-[#f8f7ff] flex flex-col items-center justify-center px-6`}
    >
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
            Create Account
          </CardTitle>
          <p className="text-neutral-500 text-sm">
            Start organizing your tasks today
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <Input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              required
            />

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

            {error && (
              <div className="bg-red-50 text-red-500 text-sm px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#9b87f5] hover:bg-[#8a76e8] text-white"
            >
              {loading ? "Creating..." : "Sign Up"}
            </Button>
          </form>

          <div className="text-center mt-6 text-sm text-neutral-500">
            Already have an account?{" "}
            <span
              className="text-[#9b87f5] cursor-pointer hover:underline"
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}