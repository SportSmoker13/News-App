import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function HomePage() {
  const session = await getServerSession();
  
  // Redirect to dashboard if logged in
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-12 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Stay Ahead with <span className="text-primary">Medical News</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-lg">
            The premier platform for pharmaceutical professionals to access, share, 
            and manage the latest medical research and industry insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="text-lg">
              <a href="/login">Get Started</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg">
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-lg">
            <Image 
              src="/medical-news.svg" 
              alt="Medical News Dashboard" 
              width={600} 
              height={400}
              className="rounded-xl shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose MedNews?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and insights designed specifically for pharmaceutical professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">Latest Research</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access the most recent medical research and clinical trial results from leading institutions worldwide.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">Real-time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get instant notifications about breakthrough discoveries and regulatory changes in your field.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">Professional Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with peers, share insights, and collaborate on research projects within our secure platform.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of pharmaceutical professionals staying ahead with the latest 
            medical research and industry insights.
          </p>
          <Button asChild size="lg" className="bg-background text-foreground hover:bg-muted text-lg cursor-pointer">
            <a href="/login">Create Your Account</a>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card text-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <Image 
                  src="/logo-blue.jpeg" 
                  alt="MedNews Logo" 
                  width={40} 
                  height={40} 
                  className="mr-3"
                />
                <span className="text-xl font-bold">MedNews</span>
              </div>
              <p className="mt-2 text-muted-foreground">
                Pharmaceutical Insights Platform
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Platform</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="/dashboard" className="hover:text-foreground">Dashboard</a></li>
                  <li><a href="/login" className="hover:text-foreground">Login</a></li>
                  <li><a href="#features" className="hover:text-foreground">Features</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground">About Us</a></li>
                  <li><a href="#" className="hover:text-foreground">Contact</a></li>
                  <li><a href="#" className="hover:text-foreground">Careers</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-foreground">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-6 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} MedNews. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}