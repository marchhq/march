"use client";

import { Github, Linkedin, Twitter } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import IntegrationsList from "./integration-list";

const formSchema = z.object({
  email: z.string().email(),
  receiveFeedback: z.boolean().default(false),
});

export function IntegrationsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      receiveFeedback: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Integrations</DialogTitle>
          <DialogDescription>
            Complete verification to publish GPTs to everyone. Verify your
            identity by adding billing details or verifying ownership of a
            public domain name.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-8 py-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Links</h3>
            <div className="space-y-4">
              <IntegrationsList />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Email</h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="receiveFeedback"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Receive feedback emails</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
