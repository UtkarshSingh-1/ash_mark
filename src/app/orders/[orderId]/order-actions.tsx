'use client'

import { useState } from 'react'
import { ReturnModal } from '@/components/orders/ReturnModal'
import { ExchangeModal } from '@/components/orders/ExchangeModal'

type Order = {
  id: string | number
  status: string
  items: Array<{
    id: string
    quantity: number
    size?: string | null
    color?: string | null
    product: {
      name: string
      sizes?: string[]
      colors?: string[]
    }
  }>
}

type ReturnItemData = {
  id: string
  orderId: string
  productName: string
}

type ExchangeItemData = {
  id: string
  orderId: string
  productName: string
  sizes: string[]
  colors: string[]
}

export default function OrderActions({ order }: { order: Order }) {
  const [returnItem, setReturnItem] = useState<ReturnItemData | null>(null)
  const [exchangeItem, setExchangeItem] = useState<ExchangeItemData | null>(null)

  if (order.status !== 'DELIVERED') return null

  return (
    <>
      <div className="space-y-2 mt-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-2">
            <button
              className="btn"
              onClick={() =>
                setReturnItem({
                  id: item.id,
                  orderId: String(order.id),
                  productName: item.product.name,
                })
              }
            >
              Return
            </button>

            <button
              className="btn"
              onClick={() =>
                setExchangeItem({
                  id: item.id, // ✅ REQUIRED
                  orderId: String(order.id),
                  productName: item.product.name,
                  sizes: item.product.sizes ?? [], // ✅ REQUIRED
                  colors: item.product.colors ?? [], // ✅ REQUIRED
                })
              }
            >
              Exchange
            </button>
          </div>
        ))}
      </div>

      {returnItem && (
        <ReturnModal
          open
          item={returnItem}
          onCloseAction={() => setReturnItem(null)}
        />
      )}

      {exchangeItem && (
        <ExchangeModal
          open
          item={exchangeItem}
          onCloseAction={() => setExchangeItem(null)}
        />
      )}
    </>
  )
}
