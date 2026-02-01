"use client"

import useSWR from "swr"
import { Card } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function UserExchangesPage() {
  const { data, error } = useSWR("/api/exchanges/user", fetcher)

  if (error) return <div>Error loading exchanges</div>
  if (!data) return <div>Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">My Exchange Requests</h1>
      {data.length === 0 && <p>No exchange requests yet</p>}
      
      {data.map((x: any) => (
        <Card key={x.id} className="p-4">
          <div className="flex justify-between">
            <div>
              <p><b>ID:</b> {x.id}</p>
              <p><b>Order:</b> {x.orderId}</p>
              <p><b>Reason:</b> {x.reason}</p>
            </div>
            <div className="text-right">
              <p><b>Status:</b> {x.status}</p>
              <p className="text-sm text-muted-foreground">{new Date(x.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
