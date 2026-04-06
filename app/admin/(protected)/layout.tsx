import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileNav } from "@/components/admin/MobileNav";
import { AiSearchBar } from "@/components/admin/AiSearchBar";
import { createClient } from "@/lib/supabase/server";
import { isAdminAllowed } from "@/lib/admin-whitelist";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // TEMPORARILY DISABLED AUTHENTICATION AS REQUESTED BY USER
    // if (!user) {
    //     redirect("/admin/login");
    // }

    // if (!user.email || !(await isAdminAllowed(user.email))) {
    //     redirect("/admin/login?error=unauthorized");
    // }

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <MobileNav />

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:px-8 md:py-6">
                    <div className="mb-6">
                        <AiSearchBar />
                    </div>
                    {children}
                </div>
            </main>
        </div>
    );
}

