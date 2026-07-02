import WelcomeCard from "@/components/dashboard/WelcomeCard";
import StatsGrid from "@/components/dashboard/StatsGrid";
import ContinueCard from "@/components/dashboard/ContinueCard";
import RecentSubmissions from "@/components/dashboard/RecentSubmissions";
import UpcomingContests from "@/components/dashboard/UpcomingContests";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  const user = session.user?.name;
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <WelcomeCard name={user ?? "Guest"} />

        <StatsGrid />

        <ContinueCard />

        <div className="grid gap-6 lg:grid-cols-2">
          <RecentSubmissions />
          <UpcomingContests />
        </div>
      </div>
    </main>
  );
}
