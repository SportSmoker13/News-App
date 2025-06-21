import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import UserManagement from "@/components/admin/UserManagement";

export default async function AdminUsersPage() {
  const session = await getServerSession();
  
  // Redirect if not admin
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto p-4">
      <UserManagement />
    </div>
  );
} 