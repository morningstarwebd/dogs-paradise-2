'use client';

import { useState, useTransition } from 'react';
import { resolveIssueAction } from '@/actions/sentry';

export function ResolveButton({ issueId }: { issueId: string }) {
    const [isPending, startTransition] = useTransition();
    const [resolved, setResolved] = useState(false);

    if (resolved) {
        return (
            <span className="text-xs font-bold text-green-500 uppercase tracking-wider">
                Resolved ✓
            </span>
        );
    }

    return (
        <button
            onClick={() => {
                startTransition(async () => {
                    const success = await resolveIssueAction(issueId);
                    if (success) {
                        setResolved(true);
                    } else {
                        alert('Failed to resolve issue. Please try again.');
                    }
                });
            }}
            disabled={isPending}
            className="text-xs font-bold uppercase tracking-wider text-accent hover:underline disabled:opacity-50 disabled:no-underline"
        >
            {isPending ? 'Resolving...' : 'Resolve ✓'}
        </button>
    );
}
