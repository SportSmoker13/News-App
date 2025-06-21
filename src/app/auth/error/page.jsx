// app/auth/error/page.jsx
"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The token has expired or has already been used.",
    Default: "An error occurred while trying to authenticate.",
  };

  useEffect(() => {
    console.error("Authentication error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Authentication Error
          </h2>
        </div>

        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {errorMessages[error] || errorMessages.Default}
          </AlertDescription>
        </Alert>

        <div className="text-center mt-6">
          <Button asChild variant="default">
            <Link href="/login">Try Again</Link>
          </Button>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Need help? <a href="#" className="text-[#0d2b69] hover:underline">Contact support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthError />
    </Suspense>
  )
}
