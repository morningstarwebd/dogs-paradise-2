export function ChatMessageContent({ text }: { text: string }) {
    const lines = text.split('\n')

    return (
        <div className="space-y-1">
            {lines.map((line, index) => {
                if (!line.trim()) {
                    return <div key={index} className="h-1.5" />
                }

                const processed = line
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[inherit]">$1</strong>')
                    .replace(
                        /\[(.*?)\]\((.*?)\)/g,
                        '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline underline-offset-2">$1</a>',
                    )

                return <p key={index} dangerouslySetInnerHTML={{ __html: processed }} />
            })}
        </div>
    )
}
