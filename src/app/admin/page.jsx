// app/admin/articles/page.jsx
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, Users, Settings, Plus, BarChart3 } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getServerSession();
  
  // Redirect if not admin
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {session.user.name || session.user.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Articles Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Articles Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage news articles, create new content, and organize categories.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href="/admin/articles">
                  <FileText className="w-4 h-4 mr-2" />
                  View Articles
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/articles/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Article
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/articles/import">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Import Articles
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage users, assign roles, and control access permissions.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href="/admin/users">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/users">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New User
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Client Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Client Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage client accounts and their specific configurations.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href="/admin/clients">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Clients
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/clients">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Client
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Quick Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Articles in the system
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Registered users
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Client accounts
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Article categories
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}