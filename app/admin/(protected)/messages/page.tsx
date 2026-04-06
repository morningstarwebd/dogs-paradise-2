'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { AiProposalModal } from '@/components/admin/messages/AiProposalModal';
import { DeleteMessageDialog } from '@/components/admin/messages/DeleteMessageDialog';
import { MessageDetailsDrawer } from '@/components/admin/messages/MessageDetailsDrawer';
import { MessagesTable } from '@/components/admin/messages/MessagesTable';
import { useAdminDataStore, type ContactMessage } from '@/store/admin-data-store';

export default function AdminMessagesPage() {
  const { contactMessages: cachedMessages, setContactMessages: setCachedMessages } = useAdminDataStore();
  const [supabase] = useState(() => createClient());
  const [messages, setMessages] = useState<ContactMessage[]>(cachedMessages || []);
  const [loading, setLoading] = useState(!cachedMessages);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewingMsg, setViewingMsg] = useState<ContactMessage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiProposal, setAiProposal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    let isMounted = true;
    async function hydrateMessages() {
      const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (!isMounted) return;
      if (data) {
        setMessages(data);
        setCachedMessages(data);
      }
      setLoading(false);
    }
    void hydrateMessages();
    return () => { isMounted = false; };
  }, [setCachedMessages, supabase]);

  const persistMessages = (nextMessages: ContactMessage[]) => {
    setMessages(nextMessages);
    setCachedMessages(nextMessages);
  };

  const openViewDrawer = async (message: ContactMessage) => {
    setViewingMsg(message);
    setDrawerOpen(true);
    if (!message.read) {
      const { error } = await supabase.from('contact_messages').update({ read: true }).eq('id', message.id);
      if (!error) persistMessages(messages.map((item) => item.id === message.id ? { ...item, read: true } : item));
    }
  };

  const toggleReadStatus = async (message: ContactMessage, event: React.MouseEvent) => {
    event.stopPropagation();
    const nextReadStatus = !message.read;
    const { error } = await supabase.from('contact_messages').update({ read: nextReadStatus }).eq('id', message.id);
    if (!error) {
      persistMessages(messages.map((item) => item.id === message.id ? { ...item, read: nextReadStatus } : item));
      showToast(nextReadStatus ? 'Marked as read' : 'Marked as unread');
    } else {
      showToast('Failed to change status');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', deleteId);
    if (!error) {
      showToast('Message deleted successfully');
      persistMessages(messages.filter((message) => message.id !== deleteId));
    } else {
      showToast('Failed to delete message');
    }
    setDeleteId(null);
    setDrawerOpen(false);
  };

  const generateAiProposal = async (message: ContactMessage) => {
    setIsGenerating(true);
    setAiProposal('');
    setAiModalOpen(true);
    try {
      const response = await fetch('/api/ai/proposal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clientMessage: message.message, clientName: message.name, businessType: message.service }) });
      if (!response.ok) throw new Error('Failed to generate proposal');
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No streaming response');
      const decoder = new TextDecoder();
      let fullText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setAiProposal(fullText);
      }
    } catch (error: unknown) {
      showToast(error instanceof Error ? error.message : 'Error generating proposal');
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-muted-foreground" size={32} /></div>;
  }

  return (
    <div className="mx-auto max-w-5xl pb-20">
      {toast ? <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-accent/20 bg-accent px-4 py-3 text-accent-foreground shadow-xl animate-in slide-in-from-bottom"><CheckCircle2 size={18} /><span className="text-sm font-medium">{toast}</span></div> : null}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h1 className="mb-2 text-3xl font-display font-bold tracking-tight">Inquiries</h1><p className="text-sm text-muted-foreground">View and manage form submissions from visitors.</p></div></div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"><MessagesTable messages={messages} onOpenMessage={openViewDrawer} onToggleReadStatus={toggleReadStatus} /></div>
      <MessageDetailsDrawer open={drawerOpen} message={viewingMsg} onClose={() => { setDrawerOpen(false); setViewingMsg(null); }} onDelete={setDeleteId} onGenerateProposal={generateAiProposal} />
      <DeleteMessageDialog open={Boolean(deleteId)} onCancel={() => setDeleteId(null)} onConfirm={handleDelete} />
      <AiProposalModal open={aiModalOpen} message={viewingMsg} proposal={aiProposal} isGenerating={isGenerating} onClose={() => setAiModalOpen(false)} onCopy={() => { navigator.clipboard.writeText(aiProposal); showToast('Proposal copied to clipboard'); }} onWhatsApp={() => { if (viewingMsg) window.open(`https://wa.me/?text=${encodeURIComponent(aiProposal)}`, '_blank'); }} />
    </div>
  );
}
