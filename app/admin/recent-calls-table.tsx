"use client"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import type { Call } from "@/types"
import { useEffect, useState } from "react"

const RecentCallsTable = () => {
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCalls = async () => {
      const supabase = createSupabaseAdminClient()

      const { data, error } = await supabase
        .from("calls")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) {
        console.error("Error fetching calls:", error)
      } else {
        setCalls(data || [])
      }
      setLoading(false)
    }

    fetchCalls()
  }, [])

  if (loading) {
    return <div>Loading recent calls...</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Caller ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Callee ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {calls.map((call) => (
            <tr key={call.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{call.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{call.caller_id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{call.callee_id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{call.duration}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(call.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecentCallsTable
