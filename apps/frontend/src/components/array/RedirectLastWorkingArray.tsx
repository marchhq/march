"use client"

import React, { useEffect } from "react"

import { useRouter } from "next/navigation"

import useArrayStore from "@/src/lib/store/array.store"

interface TokenProps {
  token: string
}

const RedirectLastWorkingArray: React.FC<TokenProps> = ({ token }) => {
  const router = useRouter()
  const { fetchArrays, arrays } = useArrayStore()

  useEffect(() => {
    if (token) {
      fetchArrays(token).catch((error) =>
        console.error("Error fetching arrays:", error)
      )
    }
  }, [token, fetchArrays])

  useEffect(() => {
    if (arrays.length > 0) {
      const targetPath = `/${arrays[0]._id}`
      router.replace(targetPath)
    }
  }, [arrays, router])

  return null
}

export default RedirectLastWorkingArray
