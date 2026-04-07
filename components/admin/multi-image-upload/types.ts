export type MultiImageUploadProps = {
    value: string[]
    onChange: (urls: string[]) => void
    primaryIndex?: number
    onPrimaryChange?: (index: number) => void
    folder?: string
    maxImages?: number
    initialSearchQuery?: string
}
