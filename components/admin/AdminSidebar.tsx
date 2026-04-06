'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, LogOut, MessageSquare, Image as ImageIcon, AlertTriangle, Dog } from "lucide-react";

export function AdminSidebar() {
    const pathname = usePathname();

    const handleSignOut = async () => {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = '/admin/login';
    };

    return (
        <aside className="w-64 bg-card border-r border-border shrink-0 flex flex-col hidden md:flex">
            <div className="h-16 flex items-center px-6 border-b border-border shrink-0">
                <Link href="/" className="font-display font-bold text-xl tracking-tight">
                    Dogs<span className="text-accent italic">Paradise</span> <span className="text-sm font-normal text-muted-foreground ml-1">Admin</span>
                </Link>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-sm font-medium">
                    <LayoutDashboard size={18} />
                    Dashboard
                </Link>
                <Link href="/admin/dogs" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-sm font-medium"> 
                    <Dog size={18} />
                    Dogs & Breeds
                </Link>
                <Link href="/admin/theme-editor" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#ea728c]/10 hover:text-[#ea728c] transition-colors text-sm font-medium border border-transparent hover:border-[#ea728c]/30 group"> 
                    <LayoutDashboard size={18} className="group-hover:animate-pulse" />
                    Theme Editor
                </Link>
                <Link href="/admin/blog" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-sm font-medium">     
                    <FileText size={18} />
                    Blog Posts
                </Link>
                <Link href="/admin/files" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-sm font-medium">    
                    <ImageIcon size={18} />
                    File Manager
                </Link>
                <Link href="/admin/messages" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-sm font-medium"> 
                    <MessageSquare size={18} />
                    Contact Messages
                </Link>
                <Link href="/admin/errors" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-sm font-medium">   
                    <AlertTriangle size={18} />
                    Error Logs
                </Link>
            </nav>

            <div className="p-4 border-t border-border">
                <button
                    onClick={handleSignOut}
                    className="flex flex-row items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-sm font-medium w-full text-left cursor-pointer"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
