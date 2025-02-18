"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { mockListItems } from "@/lib/mock-data";
import React from "react";

export function ListItems() {
  const items = mockListItems;

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <React.Fragment key={item.id}>
          <div className="flex items-center space-x-2 w-full">
            <Checkbox />
            <p className="pb-0.5">{item.text}</p>
          </div>
          <Separator />
        </React.Fragment>
      ))}
    </div>
  );
}
