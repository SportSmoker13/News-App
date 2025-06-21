// components/layout/Navbar.jsx
"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
import { ChevronDown, Settings, Users, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary">
      <div className="flex h-16 items-center px-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="font-bold text-xl">
          <img 
                  src="/logo-blue.jpeg" 
                  alt="MedNews Logo" 
                  className="mr-3 h-16 w-auto"
                />
          </Link>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          
          <ThemeToggle />
          {/* Add admin dropdown if user is admin */}
          {session?.user?.role === "ADMIN" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Admin
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/articles" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Articles
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/users" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Users
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {session ? (
            <Button variant="outline" onClick={() => signOut()}>
              Logout
            </Button>
          ) : (
            <Button variant="default" onClick={() => signIn()}>
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}