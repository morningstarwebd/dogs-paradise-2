const SUPER_ADMIN_SEPARATOR = ",";

export function getProtectedSuperAdminEmails(): Set<string> {
    const raw = process.env.SUPER_ADMIN_EMAILS ?? "";

    return new Set(
        raw
            .split(SUPER_ADMIN_SEPARATOR)
            .map((email) => email.trim().toLowerCase())
            .filter(Boolean)
    );
}

export function isProtectedSuperAdminEmail(email: string): boolean {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return false;

    return getProtectedSuperAdminEmails().has(normalized);
}
