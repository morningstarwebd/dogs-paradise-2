'use client'

import { useEffect } from 'react'

export default function TemplatePreviewReloader({ pageType }: { pageType: string }) {
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return
            if (event.data?.type !== 'TEMPLATE_SETTINGS_UPDATE') return
            if (event.data?.pageType !== pageType) return
            window.location.reload()
        }

        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [pageType])

    return null
}
