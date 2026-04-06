'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, FileText, Briefcase, LogOut, Globe, Search, MessageSquare, Image as ImageIcon, Shield, AlertTriangle, Bot } from "lucide-react";

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();



    // Close the sidebar when navigation happens
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent scrolling when the drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    const handleSignOut = async () => {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = '/admin/login';
    };

    const links = [
        { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/admin/website", icon: Globe, label: "Website Editor" },
        { href: "/admin/projects", icon: Briefcase, label: "Projects" },
        { href: "/admin/blog", icon: FileText, label: "Blog Posts" },
        { href: "/admin/files", icon: ImageIcon, label: "Files" },
        { href: "/admin/seo", icon: Search, label: "SEO Settings" },
        { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
        { href: "/admin/errors", icon: AlertTriangle, label: "Error Logs" },
        { href: "/admin/pages", icon: FileText, label: "Pages" },
        { href: "/admin/users", icon: Shield, label: "User Login Data" },
        { href: "/admin/ai-settings", icon: Bot, label: "AI Settings" },
    ];

    // Hide entirely if on website editor
    if (pathname === '/admin/website') return null;

    return (
        <>
            <header className="h-16 border-b border-border flex items-center justify-between px-4 md:hidden bg-card shrink-0">
                <Link href="/" className="font-display font-bold text-xl tracking-tight">
                    Morning Star <span className="text-accent italic">Web</span>
                </Link>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 -mr-2 text-foreground/80 hover:text-foreground transition-colors"
                >
                    <Menu size={24} />
                    <span className="sr-only">Open menu</span>
                </button>
            </header>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed inset-y-0 right-0 z-50 w-3/4 sm:w-80 bg-card border-l border-border shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
                    <span className="font-display font-bold text-xl tracking-tight">Menu</span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 -mr-2 text-foreground/80 hover:text-foreground transition-colors"
                    >
                        <X size={24} />
                        <span className="sr-only">Close menu</span>
                    </button>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${pathname === link.href ? 'bg-secondary text-foreground' : 'hover:bg-secondary/50 text-foreground/80'}`}
                        >
                            <link.icon size={18} />
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-border mt-auto">
                    <button
                        onClick={handleSignOut}
                        className="flex flex-row items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-sm font-medium w-full text-left"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </div>
        </>
    );
}
