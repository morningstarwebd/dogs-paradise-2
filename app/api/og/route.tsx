import { ImageResponse } from 'next/og'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)

        let title = searchParams.get('title') || 'Morning Star Web'
        let category = searchParams.get('category') || 'Creative Studio'

        // defensive limiting to prevent layout exploits
        title = title.substring(0, 100).replace(/<[^>]*>?/gm, '');
        category = category.substring(0, 100).replace(/<[^>]*>?/gm, '');

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-end',
                        backgroundColor: '#000000',
                        padding: '80px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '24px',
                            maxWidth: '900px',
                        }}
                    >
                        <div
                            style={{
                                color: '#ffffff',
                                fontSize: '32px',
                                fontWeight: 600,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                padding: '8px 24px',
                                border: '2px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '9999px',
                                display: 'flex',
                            }}
                        >
                            {category}
                        </div>
                        <div
                            style={{
                                fontSize: '84px',
                                fontWeight: 800,
                                color: 'white',
                                lineHeight: 1.1,
                                letterSpacing: '-0.02em',
                                fontFamily: 'system-ui, sans-serif',
                                display: 'flex',
                            }}
                        >
                            {title}
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            position: 'absolute',
                            top: '80px',
                            right: '80px',
                            color: 'white',
                            fontSize: '32px',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                        }}
                    >
                        MORNING STAR WEB
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        )
    } catch {
        return new Response(`Failed to generate the image`, {
            status: 500,
        })
    }
}
