export interface Message {
    id: string
    role: 'bot' | 'user'
    text: string
    time: string
}
