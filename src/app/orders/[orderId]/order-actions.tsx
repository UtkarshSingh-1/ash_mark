'use client'

import { useState } from 'react'
import ReturnModal from '@/components/orders/ReturnModal'
import ExchangeModal from '@/components/orders/ExchangeModal'

type Order = {
  id: string | number
  status: string
}

export default function OrderActions({ order }: { order: Order }) {
  const [showReturn, setShowReturn] = useState(false)
  const [showExchange, setShowExchange] = useState(false)

  if (order.status !== 'DELIVERED') return null

  return (
    <div className="flex gap-2 mt-4">
      <button className="btn" onClick={() => setShowReturn(true)}>Return</button>
      <button className="btn" onClick={() => setShowExchange(true)}>Exchange</button>

      {showReturn && (
        <ReturnModal
          orderId={order.id}
          onCloseAction={() => setShowReturn(false)}
        />
      )}

      {showExchange && (
        <ExchangeModal
          orderId={order.id}
          onCloseAction={() => setShowExchange(false)}
        />
      )}
    </div>
  )
}
