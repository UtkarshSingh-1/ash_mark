"use client";

export default function ApproveReturnButton({ id }: { id: string }) {
  const approve = async () => {
    await fetch(`/api/admin/returns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "APPROVED" }),
    });

    window.location.reload();
  };

  return (
    <button
      onClick={approve}
      className="px-3 py-1 bg-green-600 text-white rounded"
    >
      Approve
    </button>
  );
}
