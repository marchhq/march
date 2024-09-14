"use client"

import React, { useState } from "react"
import { DialogHeader, DialogTitle } from "@/src/components/ui/dialog"

const FeedbackModal = () => {
  return (
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <p>This action cannot be undone.</p>
    </DialogHeader>
  )
}

export default FeedbackModal
