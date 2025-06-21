// app/login/page.jsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl: "/dashboard"
    });

    if (result?.error) {
      console.error("Login failed:", result.error);
    } else if (result?.url) {
      router.push(result.url);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-md w-full">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4">
            <div className="bg-muted border-2 border-dashed border-border rounded-xl w-16 h-16 p-4 mx-auto">
            <svg 
            xmlns="http://www.w3.org/2000/svg" 
            // className="h-6 w-6"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        >
            <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.3.3 0 1 0 .2.3" />
            <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
            <circle cx="20" cy="10" r="2" />
        </svg> 
              </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">MedNews</h1>
          <p className="text-muted-foreground mt-2">Pharmaceutical Insights Platform</p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Sign in to your account</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Authentication Error</AlertTitle>
                <AlertDescription>
                  Invalid email or password. Please try again.
                </AlertDescription>
              </Alert>
            )}
            
            <LoginForm onSubmit={onSubmit} isSubmitting={isSubmitting} error={error} />
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MedNews. All rights reserved.
        </div>
      </div>
    </div>
  );
}