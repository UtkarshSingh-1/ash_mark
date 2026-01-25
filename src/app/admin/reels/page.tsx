import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import ReelsManager from "@/components/admin/reels/reels-manager";

export default async function AdminReelsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/20 py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Manage Reels</h1>
          <ReelsManager />
        </div>
      </main>
    </>
  );
}
