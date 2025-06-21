"use server";

import { getServerSession } from "@/lib/auth";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

// Get all users with pagination and search
export async function getUsers(searchParams = {}) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" };
    }

    const page = parseInt(searchParams.page) || 1;
    const pageSize = parseInt(searchParams.pageSize) || 10;
    const search = searchParams.search || "";
    const role = searchParams.role || "";

    const skip = (page - 1) * pageSize;

    const whereClause = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } }
          ]
        } : {},
        role ? { role } : {}
      ]
    };

    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              articles: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.user.count({ where: whereClause })
    ]);

    return {
      success: true,
      data: {
        users,
        totalUsers,
        totalPages: Math.ceil(totalUsers / pageSize),
        currentPage: page
      }
    };
  } catch (error) {
    console.error("Failed to get users:", error);
    return { success: false, message: "Failed to fetch users" };
  }
}

// Get a single user by ID
export async function getUserById(id) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            articles: true
          }
        }
      }
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    return { success: true, data: user };
  } catch (error) {
    console.error("Failed to get user:", error);
    return { success: false, message: "Failed to fetch user" };
  }
}

// Create a new user
export async function createUser(userData) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      return { success: false, message: "User with this email already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        role: userData.role || "USER"
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    revalidatePath("/admin/users");
    return { success: true, data: user, message: "User created successfully" };
  } catch (error) {
    console.error("Failed to create user:", error);
    return { success: false, message: "Failed to create user" };
  }
}

// Update a user
export async function updateUser(id, userData) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" };
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return { success: false, message: "User not found" };
    }

    // Check if email is being changed and if it already exists
    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (emailExists) {
        return { success: false, message: "Email already in use" };
      }
    }

    const updateData = {
      email: userData.email,
      name: userData.name,
      role: userData.role
    };

    // Only hash password if it's being updated
    if (userData.password) {
      updateData.password = await bcrypt.hash(userData.password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true
      }
    });

    revalidatePath("/admin/users");
    return { success: true, data: user, message: "User updated successfully" };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { success: false, message: "Failed to update user" };
  }
}

// Delete a user
export async function deleteUser(id) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" };
    }

    // Prevent admin from deleting themselves
    if (session.user.id === id) {
      return { success: false, message: "Cannot delete your own account" };
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            articles: true
          }
        }
      }
    });

    if (!existingUser) {
      return { success: false, message: "User not found" };
    }

    // Check if user has articles
    if (existingUser._count.articles > 0) {
      return { 
        success: false, 
        message: `Cannot delete user with ${existingUser._count.articles} articles. Please reassign or delete the articles first.` 
      };
    }

    await prisma.user.delete({
      where: { id }
    });

    revalidatePath("/admin/users");
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, message: "Failed to delete user" };
  }
}

// Update user role
export async function updateUserRole(id, role) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" };
    }

    // Prevent admin from changing their own role
    if (session.user.id === id) {
      return { success: false, message: "Cannot change your own role" };
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true
      }
    });

    revalidatePath("/admin/users");
    return { success: true, data: user, message: "User role updated successfully" };
  } catch (error) {
    console.error("Failed to update user role:", error);
    return { success: false, message: "Failed to update user role" };
  }
}

// Get user statistics
export async function getUserStats() {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" };
    }

    const [totalUsers, usersByRole, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.groupBy({
        by: ['role'],
        _count: {
          role: true
        }
      }),
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        },
        orderBy: { createdAt: "desc" },
        take: 5
      })
    ]);

    return {
      success: true,
      data: {
        totalUsers,
        usersByRole,
        recentUsers
      }
    };
  } catch (error) {
    console.error("Failed to get user stats:", error);
    return { success: false, message: "Failed to fetch user statistics" };
  }
}
