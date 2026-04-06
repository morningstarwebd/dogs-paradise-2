import { createClient } from "@/lib/supabase/server";
import { Mail, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

// Using dynamic route edge case to avoid caching
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch quick stats
    const [
        { count: projectCount },
        { count: blogCount },
        { count: totalMsgCount },
        { data: recentMessages },
        sentryStats
    ] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(5),
        import("@/lib/sentry-api").then(m => m.getSentryStats()).catch(() => ({ errors24h: 0, errors7d: 0 }))
    ]);

    return (
        <div className="space-y-10 max-w-6xl">
            <div>
                <h1 className="text-4xl font-display font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back. Here is what is happening today.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Total Dogs & Breeds</p>
                    <p className="text-4xl font-display font-bold">{projectCount || 0}</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Blog Posts</p>
                    <p className="text-4xl font-display font-bold">{blogCount || 0}</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Total Messages</p>
                    <p className="text-4xl font-display font-bold">{totalMsgCount || 0}</p>
                </div>
                <Link href="/admin/errors" className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:border-accent hover:shadow-md transition-all group block">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse" /> Errors (24h)</span>
                    </p>
                    <p className="text-4xl font-display font-bold text-foreground group-hover:text-accent transition-colors">{sentryStats.errors24h}</p>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 group-hover:text-foreground transition-colors">
                        Click to view logs <span className="text-accent">&rarr;</span>
                    </p>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Recent Messages */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-display font-bold">Recent Messages</h2>

                    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                        {recentMessages && recentMessages.length > 0 ? (
                            <div className="divide-y divide-border">
                                {recentMessages.map((msg) => (
                                    <div key={msg.id} className={`p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center ${!msg.read ? 'bg-secondary/20' : ''}`}>
                                        <div className="flex gap-4 items-start">
                                            <div className={`mt-1 rounded-full p-2 shrink-0 ${!msg.read ? 'bg-accent/20 text-accent' : 'bg-secondary text-muted-foreground'}`}>
                                                {msg.read ? <CheckCircle size={20} /> : <Mail size={20} />}
                                            </div>
                                            <div>
                                                <h4 className={`font-semibold ${!msg.read ? 'text-foreground' : 'text-foreground/80'}`}>{msg.name} <span className="font-normal text-muted-foreground">— {msg.email}</span></h4>
                                                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{msg.message}</p>
                                                <div className="flex gap-3 mt-2 text-xs font-semibold text-muted-foreground flex-wrap">
                                                    <span className="bg-secondary px-2 py-1 rounded-md">{msg.service}</span>
                                                    <span className="bg-secondary px-2 py-1 rounded-md">{msg.budget}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-4 sm:mt-0 gap-4">
                                            <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1"><Clock size={12} /> {new Date(msg.created_at).toLocaleDateString()}</span>
                                            {!msg.read && (
                                                <form action={async () => {
                                                    "use server";
                                                    const supabase = await createClient();
                                                    await supabase.from("contact_messages").update({ read: true }).eq("id", msg.id);
                                                }}>
                                                    <button className="text-xs font-bold uppercase tracking-wider text-accent hover:underline">Mark Read</button>
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-muted-foreground">
                                No messages yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-display font-bold">Quick Actions</h2>
                    <div className="flex flex-col gap-4">
                        <Link href="/admin/projects" className="bg-foreground text-background font-bold py-4 px-6 rounded-xl hover:bg-accent hover:text-white transition-colors text-center w-full">
                            Manage Projects
                        </Link>
                        <Link href="/admin/blog" className="bg-card border border-border text-foreground font-bold py-4 px-6 rounded-xl hover:bg-secondary transition-colors text-center w-full">
                            Write New Post
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
