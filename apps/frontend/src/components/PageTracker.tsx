"use client"

import { useTrackUserInsights } from "../hooks/useTrackUserInsights"

export default function PageTracker() {
  useTrackUserInsights()
  return null
}
