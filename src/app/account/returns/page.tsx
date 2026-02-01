"use client"

import useSWR from "swr"
import { Card } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function UserReturnsPage() {
  const { data, error } = useSWR("/api/returns/user", fetcher)

  if (error) return <div>Error loading returns</div>
  if (!data) return <div>Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">My Return Requests</h1>
      {data.length === 0 && <p>No return requests yet</p>}
      
      {data.map((r: any) => (
        <Card key={r.id} className="p-4">
          <div className="flex justify-between">
            <div>
              <p><b>ID:</b> {r.id}</p>
              <p><b>Order:</b> {r.orderId}</p>
              <p><b>Reason:</b> {r.reason}</p>
            </div>
            <div className="text-right">
              <p><b>Status:</b> {r.status}</p>
              <p className="text-sm text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
