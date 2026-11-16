import React, { useState, useMemo } from 'react';
import { MessageSquare, Send, Eye, Search, Sparkles, ThumbsUp, ThumbsDown, HelpCircle, Handshake, ChevronDown, ChevronRight, Edit3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

export default function ReplyManagement() {
  const { influencers, sendReplyResponse } = useApp();
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [previewId, setPreviewId] = useState(null);
  const [customResponse, setCustomResponse] = useState('');
  const [editingResponse, setEditingResponse] = useState(false);

  const repliedInfluencers = useMemo(() => influencers.filter(i => i.reply), [influencers]);

  const classificationCounts = useMemo(() => {
    const counts = { all: repliedInfluencers.length, Interested: 0, Negotiation: 0, 'Needs More Information': 0, 'Not Interested': 0 };
    repliedInfluencers.forEach(i => { if (counts[i.reply.classification] !== undefined) counts[i.reply.classification]++; });
    return counts;
  }, [repliedInfluencers]);

  const filtered = useMemo(() => {
    return repliedInfluencers.filter(i => {
      const matchTab = tab === 'all' || i.reply.classification === tab;
      const q = search.toLowerCase();
      const matchSearch = !q || i.name.toLowerCase().includes(q) || i.username.toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  }, [repliedInfluencers, tab, search]);

  const previewInf = useMemo(() => influencers.find(i => i.id === previewId), [influencers, previewId]);

  const classificationTabs = [
    { key: 'all', label: 'All Replies', icon: MessageSquare, color: 'text-[#1C1410]' },
    { key: 'Interested', label: 'Interested', icon: ThumbsUp, color: 'text-[#2D6A4F]' },
    { key: 'Negotiation', label: 'Negotiation', icon: Handshake, color: 'text-[#B45309]' },
    { key: 'Needs More Information', label: 'Needs Info', icon: HelpCircle, color: 'text-[#8B2535]' },
    { key: 'Not Interested', label: 'Not Interested', icon: ThumbsDown, color: 'text-[#7A6860]' },
  ];

  const classificationColors = {
    Interested: 'border-l-[#2D6A4F]',
    Negotiation: 'border-l-[#B45309]',
    'Needs More Information': 'border-l-[#8B2535]',
    'Not Interested': 'border-l-[#7A6860]',
  };

  const openPreview = (inf) => {
    setPreviewId(inf.id);
    setCustomResponse(inf.reply.aiDraftResponse);
    setEditingResponse(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold font-sans text-[#1C1410] tracking-tight">AI Reply Classification & Management</h1>
          <p className="text-xs text-[#7A6860]">n8n Workflow 6 detects incoming Gmail replies, classifies via Gemini, and drafts intelligent responses</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-[#C9A84C]/10 border border-[#C9A84C]/25 rounded-lg px-3 py-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
          <span className="text-[#7A6860]">Total Replies:</span>
          <span className="font-bold text-[#1C1410]">{classificationCounts.all}</span>
          <span className="text-[#7A6860]">•</span>
          <span className="font-bold text-[#2D6A4F]">{classificationCounts.Interested} Interested</span>
        </div>
      </div>

      {/* Classification Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {classificationTabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${tab === t.key ? 'bg-[#6B1A2A] text-[#FAF7F2] border-[#6B1A2A] shadow-sm' : 'bg-white text-[#7A6860] border-[#E2D9D0] hover:bg-[#FAF7F2]'}`}>
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${tab === t.key ? 'bg-[#C9A84C] text-[#1C1410]' : 'bg-[#F2EDE6]'}`}>
              {classificationCounts[t.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6860]" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search replies..." className="w-full bg-white border border-[#E2D9D0] rounded-lg pl-9 pr-3 py-2 text-xs text-[#1C1410] placeholder:text-[#7A6860]/70 focus:outline-none focus:ring-1 focus:ring-[#8B2535]" />
      </div>

      {/* Reply Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2D9D0] p-12 text-center">
          <MessageSquare className="w-10 h-10 text-[#E2D9D0] mx-auto mb-3" />
          <p className="text-sm font-bold text-[#1C1410]">No replies in this category</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(inf => (
            <div key={inf.id} className={`bg-white rounded-2xl border-l-4 border border-[#E2D9D0] shadow-subtle hover:shadow-hover transition-all ${classificationColors[inf.reply.classification] || ''}`}>
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img src={inf.avatar} alt={inf.name} className="w-10 h-10 rounded-full object-cover ring-1 ring-[#E2D9D0] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-[#1C1410]">{inf.name}</p>
                      <Badge>{inf.reply.classification}</Badge>
                      <Badge size="sm" variant="muted">{inf.reply.status}</Badge>
                    </div>
                    <p className="text-[11px] text-[#7A6860] font-mono mt-0.5">{inf.username} • {inf.reply.incomingDate}</p>
                    {/* Incoming message preview */}
                    <div className="mt-2 p-2.5 bg-[#FAF7F2] rounded-lg border border-[#E2D9D0]/60">
                      <p className="text-xs text-[#1C1410] line-clamp-2 leading-relaxed italic">"{inf.reply.incomingText.substring(0, 160)}{inf.reply.incomingText.length > 160 ? '...' : ''}"</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Button variant="secondary" size="sm" icon={Eye} onClick={() => openPreview(inf)}>View Full</Button>
                  {inf.reply.status !== 'Handled' && (
                    <Button variant="primary" size="sm" icon={Send} onClick={() => sendReplyResponse(inf.id)}>Send Response</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Preview Modal */}
      {previewInf && previewInf.reply && (
        <Modal
          isOpen={!!previewId}
          onClose={() => setPreviewId(null)}
          title={`Reply from ${previewInf.name}`}
          subtitle={`Classification: ${previewInf.reply.classification} • Sentiment: ${previewInf.reply.sentiment}`}
          maxWidth="max-w-2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button variant="ghost" size="sm" icon={Edit3} onClick={() => setEditingResponse(!editingResponse)}>
                {editingResponse ? 'Cancel Edit' : 'Edit Response'}
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setPreviewId(null)}>Close</Button>
                {previewInf.reply.status !== 'Handled' && (
                  <Button variant="primary" size="sm" icon={Send} onClick={() => { sendReplyResponse(previewInf.id, customResponse); setPreviewId(null); }}>
                    Approve & Send Response
                  </Button>
                )}
              </div>
            </div>
          }
        >
          <div className="space-y-5">
            {/* Classification & Sentiment bar */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-lg border border-[#E2D9D0]">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A6860]">Classification</span>
                <div className="mt-1"><Badge>{previewInf.reply.classification}</Badge></div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-[#E2D9D0]">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A6860]">Sentiment</span>
                <p className="text-xs font-bold text-[#1C1410] mt-1">{previewInf.reply.sentiment}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-[#E2D9D0]">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A6860]">Reply Status</span>
                <div className="mt-1"><Badge>{previewInf.reply.status}</Badge></div>
              </div>
            </div>

            {/* Incoming Message */}
            <div className="p-4 bg-white rounded-xl border border-[#E2D9D0]">
              <div className="flex items-center gap-2 mb-2">
                <img src={previewInf.avatar} alt="" className="w-6 h-6 rounded-full" />
                <span className="text-xs font-bold text-[#1C1410]">{previewInf.name}</span>
                <span className="text-[11px] text-[#7A6860]">{previewInf.reply.incomingDate}</span>
              </div>
              <div className="text-xs text-[#1C1410] whitespace-pre-wrap leading-relaxed p-3 bg-[#FAF7F2] rounded-lg border border-[#E2D9D0]/60">
                {previewInf.reply.incomingText}
              </div>
            </div>

            {/* AI Draft Response */}
            <div className="p-4 bg-white rounded-xl border border-[#E2D9D0]">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span className="text-xs font-bold text-[#1C1410]">Gemini AI Draft Response</span>
              </div>
              {editingResponse ? (
                <textarea value={customResponse} onChange={(e) => setCustomResponse(e.target.value)} rows={8} className="w-full bg-[#FAF7F2] border border-[#E2D9D0] rounded-lg px-3 py-2 text-xs text-[#1C1410] focus:outline-none focus:ring-1 focus:ring-[#8B2535] resize-y leading-relaxed" />
              ) : (
                <div className="text-xs text-[#1C1410] whitespace-pre-wrap leading-relaxed p-3 bg-[#FAF7F2] rounded-lg border border-[#E2D9D0]/60">
                  {previewInf.reply.aiDraftResponse}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
