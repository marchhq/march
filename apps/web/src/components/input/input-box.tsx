import { Input } from "../ui/input";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputBoxProps {
  className?: string;
}

export default function InputBox({ className }: InputBoxProps) {
  return (
    <div className="relative">
      <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Add new todo here"
        className={cn(
          "bg-gray-100 border-none pl-10",
          "focus-visible:ring-0 focus:outline-none focus:bg-gray-50 transition-colors",
          className
        )}
      />
    </div>
  );
}
