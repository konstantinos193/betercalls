"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function TestDBPage() {
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  async function testDB() {
    setLoading(true)
    try {
      const response = await fetch("/api/test-db")
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Test</h1>
      <Button onClick={testDB} disabled={loading}>
        {loading ? "Testing..." : "Test Database"}
      </Button>
      <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
        {result}
      </pre>
    </div>
  )
} 