// lib/db.js
import { PrismaClient } from '@prisma/client';

// Check if we're in production environment
const isProduction = process.env.NODE_ENV === 'production';

// Create a global Prisma Client instance to prevent hot-reloading issues
const globalForPrisma = global;

// Initialize Prisma Client
const prisma = globalForPrisma.prisma || new PrismaClient({
  log: isProduction ? ['error'] : ['query', 'info', 'warn', 'error'],
});

// If in development, attach Prisma to global object to prevent multiple instances
if (!isProduction) {
  globalForPrisma.prisma = prisma;
}

// Handle application shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Handle process termination signals
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Export the Prisma Client instance
export default prisma;