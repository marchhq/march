"use client";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import IntegrationsList from "./integration-list";

export function IntegrationsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Integrations</DialogTitle>
          <DialogDescription>Connect your favorite apps.</DialogDescription>
        </DialogHeader>
        <div className="space-y-8 py-4">
          <div className="space-y-4">
            <div className="space-y-4">
              <IntegrationsList />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
