'use client'

type Props = {
  orderId: string | number
  onCloseAction: () => void
}

export default function ExchangeModal({ orderId, onCloseAction }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-6 max-w-sm w-full shadow-xl">
        <h2 className="text-lg font-semibold mb-2">Exchange Order</h2>
        <p className="text-sm text-gray-600 mb-4">
          You are requesting an exchange for order <strong>{orderId}</strong>.
        </p>

        <div className="flex justify-end gap-2">
          <button
            className="btn bg-gray-200 px-3 py-1 rounded"
            onClick={onCloseAction}
          >
            Cancel
          </button>
          <button
            className="btn bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => {
              // TODO: add logic here
              onCloseAction()
            }}
          >
            Confirm Exchange
          </button>
        </div>
      </div>
    </div>
  )
}
