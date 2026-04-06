import { Circle, Eye } from 'lucide-react';
import type { ContactMessage } from '@/store/admin-data-store';

type MessagesTableProps = {
  messages: ContactMessage[];
  onOpenMessage: (message: ContactMessage) => void;
  onToggleReadStatus: (message: ContactMessage, event: React.MouseEvent) => void;
};

export function MessagesTable({
  messages,
  onOpenMessage,
  onToggleReadStatus,
}: MessagesTableProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-12 text-center text-muted-foreground">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground/50">
          <Eye size={24} />
        </div>
        <p>No messages yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full whitespace-nowrap text-left text-sm">
        <thead className="bg-secondary/50 text-muted-foreground">
          <tr>
            <th className="w-12 px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium">Name</th>
            <th className="px-6 py-4 font-medium">Email</th>
            <th className="hidden px-6 py-4 font-medium md:table-cell">Service</th>
            <th className="hidden px-6 py-4 font-medium lg:table-cell">Lead</th>
            <th className="px-6 py-4 text-right font-medium">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {messages.map((item) => (
            <tr key={item.id} className={`group cursor-pointer transition-colors hover:bg-secondary/30 ${!item.read ? 'bg-accent/5' : ''}`} onClick={() => onOpenMessage(item)}>
              <td className="px-6 py-4">
                <button onClick={(event) => onToggleReadStatus(item, event)} className="text-muted-foreground transition-transform hover:scale-110" title={item.read ? 'Mark as unread' : 'Mark as read'}>
                  {item.read ? <Circle size={16} /> : <div className="h-4 w-4 rounded-full bg-accent" />}
                </button>
              </td>
              <td className={`px-6 py-4 ${!item.read ? 'font-bold' : 'font-medium'}`}>{item.name}</td>
              <td className="px-6 py-4 text-muted-foreground">{item.email}</td>
              <td className="hidden max-w-[200px] truncate px-6 py-4 text-muted-foreground md:table-cell" title={item.service || ''}>{item.service}</td>
              <td className="hidden px-6 py-4 lg:table-cell">
                {item.lead_score != null && item.lead_score > 0 ? (
                  <span className={`rounded-md px-2 py-1 text-xs font-bold ${item.lead_score >= 8 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : item.lead_score >= 5 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {item.lead_score >= 8 ? '🔥' : item.lead_score >= 5 ? '⭐' : '—'} {item.lead_score}/10
                  </span>
                ) : null}
              </td>
              <td className="px-6 py-4 text-right text-xs text-muted-foreground">{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
