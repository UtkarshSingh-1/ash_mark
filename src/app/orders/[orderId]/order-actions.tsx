'use client'

import { useState } from 'react'
import {ReturnModal, ReturnItemData} from '@/components/orders/ReturnModal'
import {ExchangeModal, ExchangeItemData} from '@/components/orders/ExchangeModal'

type Order = {
  id: string | number
  status: string
  items: Array<{
    id: string
    quantity: number
    size?: string
    product: { name: string; sizes?: string[] }
  }>
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
              onClick={() => setReturnItem({
                id: item.id,
                orderId: String(order.id),
                productName: item.product.name,
              })}
            >
              Return
            </button>
            <button 
              className="btn" 
              onClick={() => setExchangeItem({
                id: item.id,
                orderId: String(order.id),
                productName: item.product.name,
                availableSizes: item.product.sizes ?? [],
              })}
            >
              Exchange
            </button>
          </div>
        ))}
      </div>

      <ReturnModal 
        open={!!returnItem} 
        item={returnItem} 
        onCloseAction={() => setReturnItem(null)} 
      />
      <ExchangeModal 
        open={!!exchangeItem} 
        item={exchangeItem} 
        onCloseAction={() => setExchangeItem(null)} 
      />
    </>
  )
}
