"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUsers, createUser, updateUser, deleteUser, updateUserRole } from "@/lib/actions/user";
import { Plus, Search, Edit, Trash2, Shield, User, Users, Eye, UserPlus, Mail, Briefcase, Lock } from "lucide-react";
import { toast } from "sonner";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER"
  });

  // Load users
  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await getUsers({
        page: currentPage,
        search,
        role: roleFilter
      });

      if (result.success) {
        setUsers(result.data.users);
        setTotalPages(result.data.totalPages);
        setTotalUsers(result.data.totalUsers);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage, search, roleFilter]);

  // Handle form submission for creating user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.name) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const result = await createUser(formData);
      if (result.success) {
        toast.success("User created successfully");
        setIsCreateDialogOpen(false);
        setFormData({ name: "", email: "", password: "", role: "USER" });
        loadUsers();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to create user");
    }
  };

  // Handle form submission for updating user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.name) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const result = await updateUser(selectedUser.id, formData);
      if (result.success) {
        toast.success("User updated successfully");
        setIsEditDialogOpen(false);
        setSelectedUser(null);
        setFormData({ name: "", email: "", password: "", role: "USER" });
        loadUsers();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const result = await deleteUser(userId);
      if (result.success) {
        toast.success("User deleted successfully");
        loadUsers();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  // Handle role update
  const handleRoleUpdate = async (userId, newRole) => {
    try {
      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        toast.success("User role updated successfully");
        loadUsers();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  // Open edit dialog
  const openEditDialog = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      email: user.email,
      password: "",
      role: user.role
    });
    setIsEditDialogOpen(true);
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "CLIENT":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "USER":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="w-4 h-4" />;
      case "CLIENT":
        return <Users className="w-4 h-4" />;
      case "USER":
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage users and their roles</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
  <DialogTrigger asChild>
    <Button className="px-4 py-2 rounded-md shadow-md transition-all duration-300 hover:shadow-lg flex items-center">
      <Plus className="w-4 h-4 mr-2" />
      Add User
    </Button>
  </DialogTrigger>
  <DialogContent className="max-w-md rounded-xl border-0 shadow-xl overflow-hidden">
    <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground rounded mx-4">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Create New User
        </DialogTitle>
        <DialogDescription className="text-primary-foreground/80 mt-1">
          Add a new user to the system
        </DialogDescription>
      </DialogHeader>
    </div>
    
    <form onSubmit={handleCreateUser} className="p-6 space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-foreground font-medium flex items-center gap-1.5">
          <User className="h-4 w-4 text-muted-foreground" />
          Full Name
        </Label>
        <div className="relative">
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="pl-10 py-2.5 focus:ring-2 focus:ring-ring border-border"
          />
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-foreground font-medium flex items-center gap-1.5">
          <Mail className="h-4 w-4 text-muted-foreground" />
          Email Address
        </Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="pl-10 py-2.5 focus:ring-2 focus:ring-ring border-border"
          />
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-foreground font-medium flex items-center gap-1.5">
          <Lock className="h-4 w-4 text-muted-foreground" />
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            className="pl-10 py-2.5 focus:ring-2 focus:ring-ring border-border"
          />
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Minimum 8 characters with letters and numbers
        </p>
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="role" className="text-foreground font-medium flex items-center gap-1.5">
          <Shield className="h-4 w-4 text-muted-foreground" />
          User Role
        </Label>
        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
          <SelectTrigger className="pl-10 py-2.5 focus:ring-2 focus:ring-ring border-border">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USER" className="flex items-center gap-2">
            <div className="flex items-center gap-4">
            <div>
              <User className="h-4 w-4" /> </div> <div>User</div>
              </div>
            </SelectItem>
            <SelectItem value="CLIENT" className="flex items-center gap-2">
            <div className="flex items-center gap-4">
            <div>
              <Briefcase className="h-4 w-4" /> </div> <div>Client</div>
              </div>
            </SelectItem>
            <SelectItem value="ADMIN" className="flex items-center gap-2">
              <div className="flex items-center gap-4">
              <div>
              <Shield className="h-4 w-4" /></div> <div>Admin</div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-border">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setIsCreateDialogOpen(false)}
          className="px-5 py-2.5"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          className="px-5 py-2.5 shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
        >
          <>
              <Plus className="h-4 w-4 mr-2" />
              Create User
            </>
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.role === "USER").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.role === "ADMIN").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-2">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col flex-1 gap-2">
              <Label htmlFor="search">Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-48">
              <Label htmlFor="role-filter">Filter by Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="CLIENT">Client</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading users...</div>
          ) : (
            <div className="space-y-4">
              {users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No users found</div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-2">Name</th>
                          <th className="text-left p-2">Email</th>
                          <th className="text-left p-2">Role</th>
                          <th className="text-left p-2">Articles</th>
                          <th className="text-left p-2">Created</th>
                          <th className="text-left p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                            <td className="p-2">
                              <div className="font-medium">{user.name || "N/A"}</div>
                            </td>
                            <td className="p-2">{user.email}</td>
                            <td className="p-2">
                              <div className="flex items-center space-x-2">
                                {getRoleIcon(user.role)}
                                <Select
                                  value={user.role}
                                  onValueChange={(newRole) => handleRoleUpdate(user.id, newRole)}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="USER">User</SelectItem>
                                    <SelectItem value="CLIENT">Client</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </td>
                            <td className="p-2">
                              <Badge variant="secondary">{user._count.articles}</Badge>
                            </td>
                            <td className="p-2 text-sm text-muted-foreground">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-2">
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openEditDialog(user)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteUser(user.id)}
                                  disabled={user._count.articles > 0}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center pt-4">
                      <p className="text-sm text-muted-foreground">
                        Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalUsers)} of {totalUsers} users
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage <= 1}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage >= totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-password">Password (leave blank to keep current)</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="CLIENT">Client</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update User</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
