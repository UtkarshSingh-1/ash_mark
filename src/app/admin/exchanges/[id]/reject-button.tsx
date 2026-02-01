"use client";

export default function RejectExchangeButton({ id }: { id: string }) {
  const reject = async () => {
    await fetch(`/api/admin/exchanges/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "REJECTED" }),
    });

    window.location.reload();
  };

  return (
    <button
      onClick={reject}
      className="px-3 py-1 bg-red-600 text-white rounded"
    >
      Reject
    </button>
  );
}
