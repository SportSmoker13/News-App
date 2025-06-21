// scripts/create-admin.js
import prisma from "../src/lib/db";
import bcrypt from "bcryptjs";

async function createAdmin() {
  const email = "admin@example.com";
  const password = "AdminPassword123!";
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: "Admin User",
        role: "ADMIN"
      }
    });
    
    console.log("✅ Admin user created successfully");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("Please change this password immediately after login!");
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    if (error.code === "P2002") {
      console.log("User with this email already exists");
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();