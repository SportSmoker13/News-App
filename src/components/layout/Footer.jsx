// components/layout/Footer.jsx
"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";

export default function Footer() {
  return (
<footer className="bg-gray-100 dark:bg-black text-card-foreground pt-16 pb-8">
  <div className="container mx-auto px-4 max-w-7xl">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
      {/* Brand Column */}
      <div>
        <div className="flex items-center mb-5">
          <div className="bg-muted p-2 rounded-lg mr-3">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6"
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
        </svg>          </div>
          <span className="text-xl font-bold text-foreground">MedNews Digest</span>
        </div>
        <p className="mb-6 text-muted-foreground leading-relaxed">
          Providing the latest research updates and clinical insights for medical professionals worldwide.
        </p>
        <div className="flex space-x-4">
          <a href="#" className="bg-muted p-2 rounded-full hover:bg-muted/80 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
          </a>
          <a href="#" className="bg-muted p-2 rounded-full hover:bg-muted/80 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>
          </a>
          <a href="#" className="bg-muted p-2 rounded-full hover:bg-muted/80 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </a>
        </div>
      </div>
      
      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-semibold mb-6 text-foreground">Quick Links</h3>
        <ul className="space-y-3">
          <li><a href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</a></li>
          <li><a href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">Admin Panel</a></li>
          <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Research Library</a></li>
          <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Clinical Trials</a></li>
          <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Industry News</a></li>
        </ul>
      </div>
      
      {/* Resources */}
      <div>
        <h3 className="text-lg font-semibold mb-6 text-foreground">Resources</h3>
        <ul className="space-y-3">
          <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Research Guidelines</a></li>
          <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Publication Standards</a></li>
          <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Data Analysis Tools</a></li>
          <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Clinical Protocols</a></li>
          <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Regulatory Updates</a></li>
        </ul>
      </div>
      
      {/* Support */}
      <div>
        <h3 className="text-lg font-semibold mb-6 text-foreground">Support</h3>
        <ul className="space-y-3">
          <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
          <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact Support</a></li>
          <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">API Documentation</a></li>
          <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Community Forum</a></li>
          <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Training Resources</a></li>
        </ul>
      </div>
    </div>
    
    {/* Bottom Section */}
    <div className="border-t border-border pt-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MedNews Digest. All rights reserved.
          </p>
        </div>
        
        <div className="flex items-center space-x-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a>
          <ThemeToggle />
        </div>
      </div>
    </div>
  </div>
</footer>
  );
}