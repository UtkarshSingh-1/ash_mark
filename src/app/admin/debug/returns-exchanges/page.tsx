import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import ReturnsExchangesDebugClient from "./debug-client"

export default async function ReturnsExchangesDebugPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/20">
        <ReturnsExchangesDebugClient />
      </main>
    </>
  )
}
