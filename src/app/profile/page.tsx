import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileTabs } from "@/components/profile/profile-tabs"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Suspense fallback={<ProfileSkeleton />}>
            <ProfileHeader user={session.user} />
            <ProfileTabs userId={session.user.id} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-background p-6 shadow-md">
        <div className="flex items-center gap-6">
          <Skeleton className="h-20 w-20" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
      <div className="bg-background p-6 shadow-md">
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}
