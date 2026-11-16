import React, { useState, useMemo } from 'react';
import { Clock, Send, Pause, Play, Calendar, CheckCircle2, AlertCircle, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { formatDate } from '../utils/formatters';

export default function Followups() {
  const { influencers, sendFollowupNow, pauseFollowup, metrics } = useApp();
  const [tab, setTab] = useState('upcoming');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const followupInfluencers = useMemo(() => {
    return influencers.filter(i => i.followup && (i.followup.sequenceStep > 0 || i.followup.status === 'Scheduled'));
  }, [influencers]);

  const upcoming = useMemo(() => followupInfluencers.filter(i => i.followup.status === 'Scheduled').filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.username.toLowerCase().includes(search.toLowerCase())), [followupInfluencers, search]);
  const paused = useMemo(() => followupInfluencers.filter(i => i.followup.status?.includes('Paused')).filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.username.toLowerCase().includes(search.toLowerCase())), [followupInfluencers, search]);
  const completed = useMemo(() => followupInfluencers.filter(i => i.followup.status === 'Completed').filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.username.toLowerCase().includes(search.toLowerCase())), [followupInfluencers, search]);

  const activeList = tab === 'upcoming' ? upcoming : tab === 'paused' ? paused : completed;

  const tabs = [
    { key: 'upcoming', label: 'Upcoming', count: upcoming.length, icon: Calendar },
    { key: 'paused', label: 'Paused (Replied)', count: paused.length, icon: Pause },
    { key: 'completed', label: 'Completed', count: completed.length, icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold font-sans text-[#1C1410] tracking-tight">Automated Follow-up Sequences</h1>
          <p className="text-xs text-[#7A6860]">n8n Workflow 5 manages cadence-based follow-ups every 48 hours via Gmail API</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-white border border-[#E2D9D0] rounded-lg px-3 py-2 shadow-subtle">
          <Clock className="w-3.5 h-3.5 text-[#C9A84C]" />
          <span className="text-[#7A6860]">Active Sequences:</span>
          <span className="font-bold text-[#1C1410]">{metrics.followupsSent}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tabs.map(t => (
          <div key={t.key} onClick={() => setTab(t.key)} className={`bg-white rounded-xl p-4 border shadow-subtle cursor-pointer transition-all ${tab === t.key ? 'border-[#8B2535]/40 shadow-hover ring-1 ring-[#8B2535]/10' : 'border-[#E2D9D0] hover:border-[#B85C6E]/30'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <t.icon className={`w-4 h-4 ${tab === t.key ? 'text-[#6B1A2A]' : 'text-[#7A6860]'}`} />
                <span className="text-xs font-bold text-[#1C1410]">{t.label}</span>
              </div>
              <span className={`text-2xl font-extrabold ${tab === t.key ? 'text-[#6B1A2A]' : 'text-[#1C1410]'}`}>{t.count}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6860]" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search follow-up sequences..." className="w-full bg-white border border-[#E2D9D0] rounded-lg pl-9 pr-3 py-2 text-xs text-[#1C1410] placeholder:text-[#7A6860]/70 focus:outline-none focus:ring-1 focus:ring-[#8B2535]" />
      </div>

      {/* Follow-up List */}
      {activeList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2D9D0] p-12 text-center">
          <Clock className="w-10 h-10 text-[#E2D9D0] mx-auto mb-3" />
          <p className="text-sm font-bold text-[#1C1410]">No follow-ups in this category</p>
          <p className="text-xs text-[#7A6860] mt-1">Switch tabs to view other follow-up statuses.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeList.map(inf => {
            const isExpanded = expandedId === inf.id;
            return (
              <div key={inf.id} className={`bg-white rounded-2xl border overflow-hidden transition-all ${isExpanded ? 'border-[#8B2535]/30 shadow-hover' : 'border-[#E2D9D0] shadow-subtle'}`}>
                {/* Summary Row */}
                <div className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF7F2]/50 transition-colors" onClick={() => setExpandedId(isExpanded ? null : inf.id)}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img src={inf.avatar} alt={inf.name} className="w-10 h-10 rounded-full object-cover ring-1 ring-[#E2D9D0] shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-[#1C1410] truncate">{inf.name}</p>
                        <span className="text-[11px] text-[#7A6860] font-mono">{inf.username}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-[#7A6860] mt-0.5">
                        <span>Niche: <strong className="text-[#1C1410]">{inf.niche}</strong></span>
                        <span>Touch #{inf.followup.sequenceStep}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      {inf.followup.lastContactDate && <p className="text-[11px] text-[#7A6860]">Last: <strong className="text-[#1C1410]">{inf.followup.lastContactDate}</strong></p>}
                      {inf.followup.nextFollowupDate && <p className="text-[11px] text-[#C9A84C] font-semibold flex items-center gap-1 justify-end"><Calendar className="w-3 h-3" />Next: {inf.followup.nextFollowupDate}</p>}
                    </div>
                    <Badge>{inf.followup.status}</Badge>
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-[#7A6860]" /> : <ChevronRight className="w-4 h-4 text-[#7A6860]" />}
                  </div>
                </div>

                {/* Expanded History */}
                {isExpanded && (
                  <div className="border-t border-[#E2D9D0] bg-[#FAF7F2]/40 p-5 space-y-4">
                    {/* Timeline */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1410] mb-3">Follow-up History Timeline</h4>
                      {inf.followup.history && inf.followup.history.length > 0 ? (
                        <div className="space-y-3 relative pl-5 border-l-2 border-[#E2D9D0]">
                          {inf.followup.history.map((h, idx) => (
                            <div key={idx} className="relative">
                              <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-[#6B1A2A] border-2 border-white" />
                              <div className="bg-white rounded-lg p-3 border border-[#E2D9D0]">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-[#1C1410]">{h.type}</span>
                                  <span className="text-[11px] text-[#7A6860]">{h.date}</span>
                                </div>
                                <p className="text-xs text-[#7A6860] mt-1">{h.note}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[#7A6860]">No follow-up steps recorded yet.</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2D9D0]/60">
                      {inf.followup.status === 'Scheduled' && (
                        <>
                          <Button variant="ghost" size="sm" icon={Pause} onClick={() => pauseFollowup(inf.id)}>Pause Sequence</Button>
                          <Button variant="primary" size="sm" icon={Send} onClick={() => sendFollowupNow(inf.id)}>Send Now</Button>
                        </>
                      )}
                      {inf.followup.status?.includes('Paused') && (
                        <Button variant="outline" size="sm" icon={Play} onClick={() => sendFollowupNow(inf.id)}>Resume & Send Next</Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
