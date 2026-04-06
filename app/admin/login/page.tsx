"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, AlertCircle } from "lucide-react";


function AdminLoginForm() {
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const isUnauthorized = searchParams.get('error') === 'unauthorized';

    // Instead of an effect, we calculate the error message locally if idle:
    const displayStatus = isUnauthorized && status === "idle" ? "error" : status;
    const displayErrorMessage = isUnauthorized && status === "idle" ? 'Access denied. This account is not authorized.' : errorMessage;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setStatus("error");
            setErrorMessage(error.message);
        } else {
            router.push("/admin");
            router.refresh(); // Refresh to catch new cookies in server layout
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md bg-card p-8 md:p-10 rounded-3xl border border-border shadow-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-display font-bold mb-2 tracking-tight">
                        Morning Star <span className="text-accent italic">Web</span>
                    </h1>
                    <p className="text-muted-foreground text-sm uppercase tracking-widest font-semibold">
                        Admin Portal
                    </p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    {displayStatus === "error" && (
                        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-xl p-4 flex items-center gap-3 text-sm font-medium">
                            <AlertCircle size={18} />
                            {displayErrorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={displayStatus === "loading"}
                        className="mt-4 bg-foreground text-background font-bold rounded-xl py-4 flex items-center justify-center gap-3 hover:bg-accent hover:text-white transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {displayStatus === "loading" ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                                </svg>
                                Sign In with Google
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function AdminLogin() {
    return (
        <Suspense fallback={<div className="min-h-screen flex flex-col items-center justify-center bg-background"><Loader2 className="w-10 h-10 animate-spin text-accent" /></div>}>
            <AdminLoginForm />
        </Suspense>
    );
}
