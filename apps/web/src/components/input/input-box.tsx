"use client";

import { Input } from "../ui/input";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateObject } from "@/types/objects";
import React from "react";

interface InputBoxProps {
  className?: string;
  onSubmit: (data: CreateObject) => void;
  arrayType: "inbox" | "today";
}

export default function InputBox({
  className,
  onSubmit,
  arrayType,
}: InputBoxProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem("todo") as HTMLInputElement;

    if (!input.value.trim()) return;

    if (arrayType === "today") {
      const today = new Date().toISOString();
      onSubmit({ title: input.value.trim(), dueDate: today });
    } else {
      onSubmit({ title: input.value.trim() });
    }

    form.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        name="todo"
        placeholder="Add new todo here"
        className={cn(
          "bg-gray-100 border-none pl-10",
          "focus-visible:ring-0 focus:outline-none focus:bg-gray-50 transition-colors",
          className
        )}
      />
    </form>
  );
}
