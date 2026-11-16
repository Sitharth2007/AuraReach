import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Mail,
  Search,
  Filter,
  Eye,
  AtSign,
  Calendar,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Database,
  ExternalLink,
  Inbox,
  Hash,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Send,
  Loader2,
  X,
  Info
} from 'lucide-react';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { formatNumber } from '../utils/formatters';
import {
  fetchInfluencersFromN8N,
  getInfluencersEndpointUrl,
  getGenerateOutreachEndpointUrl,
  triggerGenerateOutreachEmail
} from '../services/influencerService';

/**
 * Categorizes an influencer record into one of the 5 required outreach filter buckets
 */
function getOutreachCategory(inf) {
  const s = String(inf.outreachStatus || inf.status || '').toLowerCase().trim();
  const r = String(inf.recommendation || '').toLowerCase().trim();

  if (s.includes('not interested') || s.includes('declined') || s.includes('rejected')) {
    return 'Not Interested';
  }
  if (s.includes('interested') || r.includes('interested') || s.includes('deal') || s.includes('closed')) {
    return 'Interested';
  }
  if (s.includes('pending') || s.includes('approval') || s.includes('review') || s.includes('draft')) {
    return 'Approval Pending';
  }
  if (
    s.includes('sent') ||
    s.includes('contacted') ||
    s.includes('pitched') ||
    s.includes('dispatched') ||
    (inf.lastContacted &&
      inf.lastContacted !== 'Not Contacted Yet' &&
      inf.lastContacted !== 'None' &&
      inf.lastContacted !== 'N/A')
  ) {
    return 'Email Sent';
  }
  return 'New';
}

/**
 * Checks eligibility for Workflow 3 (Generate Email action):
 * 1. Email is not empty.
 * 2. Recommendation is High Priority.
 * 3. Status is New.
 */
function checkGenerateEligibility(inf) {
  const hasEmail = Boolean(inf.email && inf.email.trim() !== '' && inf.email !== 'N/A');
  const isHighPriority =
    String(inf.recommendation || '').toLowerCase().includes('high') ||
    inf.priority === 'High';
  const category = getOutreachCategory(inf);
  const isNew = category === 'New';

  const isEligible = hasEmail && isHighPriority && isNew;

  let reason = '';
  if (!isNew) {
    reason = `Status is "${inf.outreachStatus || category}" (Requires "New")`;
  } else if (!isHighPriority) {
    reason = 'Recommendation must be High Priority';
  } else if (!hasEmail) {
    reason = 'Email address is missing';
  }

  return { isEligible, reason };
}

export default function EmailOutreach() {
  // API State
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  // Workflow 3 Generation State
  const [generatingId, setGeneratingId] = useState(null);
  const [actionNotification, setActionNotification] = useState(null);

  // Filter & Search State
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');

  // Details View Modal State
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [copiedThreadId, setCopiedThreadId] = useState(false);

  const getEndpoint = getInfluencersEndpointUrl();
  const generateEndpoint = getGenerateOutreachEndpointUrl();

  // Fetch live CRM data from n8n (GET)
  const loadData = useCallback(async (isSilentRefresh = false) => {
    if (!isSilentRefresh) {
      setLoading(true);
      setError(null);
    }

    try {
      const res = await fetchInfluencersFromN8N();
      setInfluencers(res.data || []);
      setLastSyncedAt(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn('Email Outreach n8n API fetch error:', err);
      if (!isSilentRefresh) {
        setError({
          message: err.message || 'Failed to fetch outreach records from n8n Cloud API',
          hint: err.data?.hint || (err.message?.includes('not registered')
            ? "In n8n Cloud, webhook-test URLs only listen after you click 'Execute workflow' or 'Test step' on the canvas. Alternatively, activate the workflow for permanent access."
            : null),
          status: err.status || (err.isTimeout ? 408 : 500)
        });
      }
    } finally {
      if (!isSilentRefresh) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Counts for each filter tab
  const categoryCounts = useMemo(() => {
    const counts = {
      All: influencers.length,
      New: 0,
      'Approval Pending': 0,
      'Email Sent': 0,
      Interested: 0,
      'Not Interested': 0
    };

    influencers.forEach((inf) => {
      const cat = getOutreachCategory(inf);
      if (counts[cat] !== undefined) {
        counts[cat]++;
      }
    });

    return counts;
  }, [influencers]);

  // Filter & Search Logic
  const filteredInfluencers = useMemo(() => {
    return (influencers || []).filter((inf) => {
      const cat = getOutreachCategory(inf);
      const matchesTab = tab === 'All' || cat === tab;

      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (inf.name && inf.name.toLowerCase().includes(q)) ||
        (inf.username && inf.username.toLowerCase().includes(q)) ||
        (inf.email && inf.email.toLowerCase().includes(q)) ||
        (inf.niche && inf.niche.toLowerCase().includes(q)) ||
        (inf.recommendation && inf.recommendation.toLowerCase().includes(q)) ||
        (inf.gmailThreadId && inf.gmailThreadId.toLowerCase().includes(q)) ||
        (inf.outreachStatus && inf.outreachStatus.toLowerCase().includes(q));

      return matchesTab && matchesSearch;
    });
  }, [influencers, tab, search]);

  // -------------------------------------------------------------
  // WORKFLOW 3 POST: GENERATE OUTREACH EMAIL ACTION
  // -------------------------------------------------------------
  const handleGenerateEmail = async (inf) => {
    const { isEligible, reason } = checkGenerateEligibility(inf);
    if (!isEligible) {
      setActionNotification({
        type: 'error',
        title: 'Influencer Not Eligible',
        message: `${inf.name} is not eligible for email generation: ${reason}`
      });
      return;
    }

    setGeneratingId(inf.id);
    setActionNotification(null);

    const payload = {
      influencer_id: inf.influencer_id || inf.id,
      username: inf.username,
      email: inf.email
    };

    try {
      const response = await triggerGenerateOutreachEmail(payload);

      // Display success notification
      setActionNotification({
        type: 'success',
        title: 'Email Generated Successfully',
        message: `Workflow 3 completed for ${inf.name} (${inf.username}). Outreach draft created and Google Sheets CRM updated to "Approval Pending".`
      });

      // Refresh influencer data from CRM so "Approval Pending" appears immediately
      await loadData(true);

      // If details modal is open for this influencer, update selected influencer
      setSelectedInfluencer((prev) =>
        prev && prev.id === inf.id
          ? { ...prev, outreachStatus: 'Approval Pending', status: 'Approval Pending' }
          : prev
      );
    } catch (err) {
      console.error('Workflow 3 Generate Email error:', err);
      setActionNotification({
        type: 'error',
        title: 'Outreach Generation Failed',
        message:
          err.message ||
          'Failed to trigger Workflow 3 on n8n Cloud. Please verify the POST webhook is active.'
      });
    } finally {
      setGeneratingId(null);
    }
  };

  const openDetailModal = (inf) => {
    setSelectedInfluencer(inf);
    setDetailModalOpen(true);
    setCopiedThreadId(false);
  };

  const copyToClipboard = (text) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedThreadId(true);
      setTimeout(() => setCopiedThreadId(false), 2000);
    }
  };

  const tabs = [
    { key: 'All', label: 'All Records' },
    { key: 'New', label: 'New' },
    { key: 'Approval Pending', label: 'Approval Pending' },
    { key: 'Email Sent', label: 'Email Sent' },
    { key: 'Interested', label: 'Interested' },
    { key: 'Not Interested', label: 'Not Interested' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl lg:text-2xl font-bold font-sans text-[#1C1410] tracking-tight">
              Email Outreach Studio & Tracking
            </h1>
            {!loading && !error && (
              <span className="text-[10px] font-semibold text-[#2D6A4F] bg-[#2D6A4F]/10 border border-[#2D6A4F]/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F] animate-pulse" />
                Workflow 3 POST Ready
              </span>
            )}
          </div>
          <p className="text-xs text-[#7A6860]">
            {loading ? (
              'Fetching outreach status, thread IDs, and contact logs from Google Sheets CRM...'
            ) : error ? (
              <span className="text-[#9E2A2B]">API connection notice &bull; Review n8n status below</span>
            ) : (
              `Displaying ${filteredInfluencers.length} of ${influencers.length} creator outreach records from Google Sheets CRM`
            )}
            {lastSyncedAt && !loading && (
              <span className="ml-2 text-[#7A6860]/80">(&bull; Synced at {lastSyncedAt})</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            disabled={loading || Boolean(generatingId)}
            onClick={() => loadData(false)}
            className="border-[#E2D9D0]"
          >
            {loading ? 'Syncing...' : 'Sync with n8n'}
          </Button>
        </div>
      </div>

      {/* Endpoint Indicator Banner */}
      <div className="px-4 py-2.5 rounded-xl bg-white border border-[#E2D9D0] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 truncate">
          <Database className="w-4 h-4 text-[#C9A84C] shrink-0" />
          <span className="font-semibold text-[#1C1410] shrink-0">Workflow 3 Proxy API:</span>
          <code className="font-mono text-[11px] text-[#6B1A2A] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E2D9D0] truncate max-w-lg">
            {generateEndpoint}
          </code>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-semibold text-[#2D6A4F] bg-[#2D6A4F]/10 px-2 py-0.5 rounded-full">
            Vite Dev Proxy Active
          </span>
          <span className="text-[11px] text-[#7A6860]">
            Target: <code className="font-mono text-[10px] text-[#7A6860]">sitharth07.app.n8n.cloud</code>
          </span>
        </div>
      </div>

      {/* ACTION NOTIFICATION (SUCCESS / ERROR) */}
      {actionNotification && (
        <div
          className={`p-4 rounded-xl border flex items-start justify-between gap-3 animate-in fade-in duration-150 ${
            actionNotification.type === 'success'
              ? 'bg-[#2D6A4F]/10 border-[#2D6A4F]/30 text-[#2D6A4F]'
              : 'bg-[#9E2A2B]/10 border-[#9E2A2B]/30 text-[#9E2A2B]'
          }`}
        >
          <div className="flex items-start gap-3">
            {actionNotification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#2D6A4F]" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#9E2A2B]" />
            )}
            <div className="space-y-0.5">
              <p className="text-xs font-bold">{actionNotification.title}</p>
              <p className="text-xs text-[#1C1410] leading-relaxed">
                {actionNotification.message}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActionNotification(null)}
            className="p-1 rounded-md text-[#7A6860] hover:text-[#1C1410] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="bg-white rounded-2xl p-16 border border-[#E2D9D0] shadow-subtle text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-3 border-[#E2D9D0] border-t-[#6B1A2A] animate-spin mx-auto" />
          <div>
            <p className="text-sm font-bold text-[#1C1410]">
              Loading Outreach Records from n8n Cloud...
            </p>
            <p className="text-xs text-[#7A6860] mt-1 max-w-md mx-auto">
              Connecting to Google Sheets CRM to retrieve contact emails, outreach statuses, last contacted timestamps, and Gmail Thread IDs.
            </p>
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {error && !loading && (
        <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#B85C6E]/40 shadow-subtle space-y-4 animate-in fade-in">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#9E2A2B]/10 text-[#9E2A2B] flex items-center justify-center shrink-0 border border-[#9E2A2B]/20">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#1C1410]">
                  Failed to Load Outreach Records from n8n Cloud
                </h3>
                {error.status && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#9E2A2B]/10 text-[#9E2A2B] font-bold">
                    HTTP {error.status}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#1C1410] font-medium leading-relaxed">
                {error.message}
              </p>
              {error.hint && (
                <div className="mt-2 p-3 bg-white rounded-lg border border-[#E2D9D0] text-xs text-[#7A6860] leading-relaxed">
                  <strong className="text-[#6B1A2A]">n8n Guide:</strong> {error.hint}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-[#E2D9D0]/80">
            <Button variant="primary" size="sm" icon={RefreshCw} onClick={() => loadData(false)}>
              Retry n8n Connection
            </Button>
            <span className="text-xs text-[#7A6860]">
              Ensure your n8n workflow canvas is listening or the workflow is active.
            </span>
          </div>
        </div>
      )}

      {/* FILTER TABS & SEARCH BAR */}
      {!loading && (
        <div className="space-y-4">
          {/* Tabs for the 5 requested categories + All */}
          <div className="flex items-center gap-1.5 bg-white rounded-2xl p-1.5 border border-[#E2D9D0] shadow-subtle overflow-x-auto">
            {tabs.map((t) => {
              const active = tab === t.key;
              const count = categoryCounts[t.key] || 0;

              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                    active
                      ? 'bg-[#6B1A2A] text-[#FAF7F2] shadow-sm'
                      : 'text-[#7A6860] hover:bg-[#FAF7F2] hover:text-[#1C1410]'
                  }`}
                >
                  <span>{t.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      active ? 'bg-[#C9A84C] text-[#1C1410]' : 'bg-[#F2EDE6] text-[#7A6860]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-4 border border-[#E2D9D0] shadow-subtle flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6860]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by influencer name, username, email, niche, or Gmail Thread ID..."
                className="w-full bg-[#FAF7F2] border border-[#E2D9D0] rounded-lg pl-9 pr-3 py-2 text-xs text-[#1C1410] placeholder:text-[#7A6860]/70 focus:outline-none focus:ring-1 focus:ring-[#8B2535] focus:border-[#8B2535]"
              />
            </div>
            {search && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearch('')}
                className="text-xs text-[#7A6860]"
              >
                Clear Search
              </Button>
            )}
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && filteredInfluencers.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#E2D9D0] p-16 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#E2D9D0] flex items-center justify-center mx-auto text-[#7A6860]">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#1C1410]">No Outreach Records Found</h3>
          <p className="text-xs text-[#7A6860] max-w-sm mx-auto">
            {influencers.length === 0
              ? 'The CRM API returned zero records. Make sure your Google Sheet has populated outreach entries.'
              : `No influencers match the "${tab}" category with current search criteria.`}
          </p>
          {(tab !== 'All' || search) && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setTab('All');
                setSearch('');
              }}
            >
              Reset Filters
            </Button>
          )}
        </div>
      )}

      {/* OUTREACH RECORDS GRID */}
      {!loading && filteredInfluencers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredInfluencers.map((inf) => {
            const category = getOutreachCategory(inf);
            const { isEligible, reason } = checkGenerateEligibility(inf);
            const isThisGenerating = generatingId === inf.id;

            return (
              <div
                key={inf.id}
                className="bg-white rounded-2xl border border-[#E2D9D0] shadow-subtle hover:shadow-hover hover:border-[#B85C6E]/40 transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5 space-y-4">
                  {/* Top: Avatar, Name, Handle, AI Score */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={inf.avatar}
                        alt={inf.name}
                        className="w-11 h-11 rounded-full object-cover ring-1 ring-[#E2D9D0] shadow-sm shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#1C1410] truncate">
                          {inf.name}
                        </p>
                        <a
                          href={`https://instagram.com/${(inf.username || '').replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#7A6860] hover:text-[#8B2535] flex items-center gap-1 font-mono text-[11px]"
                        >
                          <AtSign className="w-3 h-3 text-[#B85C6E]" />
                          {inf.username}
                        </a>
                      </div>
                    </div>

                    {/* AI Score Badge */}
                    <div className="text-right shrink-0">
                      <div className="w-9 h-9 rounded-lg bg-[#6B1A2A]/10 text-[#6B1A2A] font-bold flex items-center justify-center font-sans text-xs border border-[#6B1A2A]/20">
                        {inf.aiScore}
                      </div>
                      <span className="text-[9px] text-[#7A6860]">/100</span>
                    </div>
                  </div>

                  {/* Niche & Category Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap text-xs">
                    <Badge size="sm" variant="muted">
                      {inf.niche}
                    </Badge>
                    <Badge size="sm">
                      {category}
                    </Badge>
                  </div>

                  {/* Email Address & Gmail Thread ID */}
                  <div className="space-y-2 pt-2 border-t border-[#E2D9D0]/60 text-xs">
                    {/* Email */}
                    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#FAF7F2] border border-[#E2D9D0]/60">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Mail className="w-3.5 h-3.5 text-[#6B1A2A] shrink-0" />
                        <span className="font-mono text-[11px] text-[#1C1410] truncate">
                          {inf.email}
                        </span>
                      </div>
                    </div>

                    {/* Gmail Thread ID */}
                    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#FAF7F2] border border-[#E2D9D0]/60">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Hash className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                        <span className="text-[10px] uppercase font-bold text-[#7A6860] shrink-0">
                          Thread ID:
                        </span>
                        <span className="font-mono text-[11px] text-[#1C1410] truncate">
                          {inf.gmailThreadId || 'None'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation & Last Contacted */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] uppercase font-bold text-[#7A6860] shrink-0">
                        Recommendation:
                      </span>
                      <span className="text-right font-semibold text-[#6B1A2A] text-[11px] truncate">
                        {inf.recommendation}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-[#7A6860]">
                      <span className="text-[10px] uppercase font-bold text-[#7A6860] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#7A6860]" />
                        Last Contacted:
                      </span>
                      <span className="font-medium text-[#1C1410] text-[11px]">
                        {inf.lastContacted}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Actions */}
                <div className="px-5 py-3.5 border-t border-[#E2D9D0] bg-[#FAF7F2]/50 flex items-center justify-between gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Eye}
                    onClick={() => openDetailModal(inf)}
                    className="text-xs border-[#E2D9D0] hover:bg-[#F2EDE6]"
                  >
                    View Details
                  </Button>

                  {/* Generate Email Action Button */}
                  <div className="relative group/btn">
                    <Button
                      variant={isEligible ? 'primary' : 'secondary'}
                      size="sm"
                      icon={isThisGenerating ? Loader2 : Sparkles}
                      disabled={!isEligible || Boolean(generatingId)}
                      onClick={() => handleGenerateEmail(inf)}
                      className={`text-xs ${
                        isEligible
                          ? 'bg-[#6B1A2A] hover:bg-[#8B2535] text-white shadow-sm'
                          : 'opacity-50 cursor-not-allowed bg-[#E2D9D0]/50 text-[#7A6860] border-transparent'
                      } ${isThisGenerating ? '[&>svg]:animate-spin' : ''}`}
                    >
                      {isThisGenerating ? 'Generating...' : 'Generate Email'}
                    </Button>

                    {/* Eligibility Tooltip on Hover for disabled state */}
                    {!isEligible && (
                      <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover/btn:block w-48 p-2 bg-[#1C1410] text-[#FAF7F2] text-[10px] rounded-lg shadow-modal z-20 pointer-events-none leading-tight">
                        <span className="font-semibold text-[#C9A84C] block mb-0.5">Not Eligible:</span>
                        {reason}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* INFLUENCER OUTREACH DETAILS MODAL */}
      {selectedInfluencer && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={selectedInfluencer.name}
          subtitle={`CRM Outreach Record &bull; Source: Google Sheets via n8n`}
          maxWidth="max-w-2xl"
          footer={
            <div className="flex items-center justify-between w-full text-xs">
              <span className="font-mono text-[#7A6860]">
                Record ID: {selectedInfluencer.id}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setDetailModalOpen(false)}
                >
                  Close Details
                </Button>

                {/* Modal Generate Email action */}
                {(() => {
                  const { isEligible, reason } = checkGenerateEligibility(selectedInfluencer);
                  const isThisGenerating = generatingId === selectedInfluencer.id;

                  return (
                    <Button
                      variant={isEligible ? 'primary' : 'secondary'}
                      size="sm"
                      icon={isThisGenerating ? Loader2 : Sparkles}
                      disabled={!isEligible || Boolean(generatingId)}
                      onClick={() => handleGenerateEmail(selectedInfluencer)}
                      className={`${isThisGenerating ? '[&>svg]:animate-spin' : ''}`}
                    >
                      {isThisGenerating ? 'Generating...' : 'Generate Email'}
                    </Button>
                  );
                })()}
              </div>
            </div>
          }
        >
          <div className="space-y-5">
            {/* Creator Identity Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#E2D9D0]">
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedInfluencer.avatar}
                  alt={selectedInfluencer.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-[#C9A84C]/50 shadow-sm shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-[#1C1410]">
                      {selectedInfluencer.name}
                    </h3>
                    <Badge>{getOutreachCategory(selectedInfluencer)}</Badge>
                  </div>
                  <p className="text-xs text-[#7A6860] font-mono mt-0.5">
                    {selectedInfluencer.username} &bull; {selectedInfluencer.niche}
                  </p>
                  {selectedInfluencer.bio && (
                    <p className="text-xs text-[#1C1410] mt-1.5 italic">
                      "{selectedInfluencer.bio}"
                    </p>
                  )}
                </div>
              </div>

              {/* AI Score pill */}
              <div className="text-right p-3 bg-[#FAF7F2] rounded-lg border border-[#E2D9D0] shrink-0">
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#7A6860]">
                  AI Score
                </p>
                <div className="flex items-baseline justify-end gap-1">
                  <span className="text-2xl font-extrabold text-[#6B1A2A]">
                    {selectedInfluencer.aiScore}
                  </span>
                  <span className="text-xs text-[#7A6860]">/100</span>
                </div>
              </div>
            </div>

            {/* Eligibility Status Banner inside Modal */}
            {(() => {
              const { isEligible, reason } = checkGenerateEligibility(selectedInfluencer);
              return (
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    isEligible
                      ? 'bg-[#2D6A4F]/10 border-[#2D6A4F]/25 text-[#2D6A4F]'
                      : 'bg-[#FAF7F2] border-[#E2D9D0] text-[#7A6860]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isEligible ? (
                      <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                    ) : (
                      <Info className="w-4 h-4 text-[#7A6860] shrink-0" />
                    )}
                    <span>
                      {isEligible
                        ? 'Eligible for automated outreach generation (Status: New, Recommendation: High Priority, Email verified).'
                        : `Generation restricted: ${reason}`}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Outreach Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Email Address */}
              <div className="p-3.5 bg-white rounded-xl border border-[#E2D9D0] space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A6860] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#6B1A2A]" />
                  Email Address
                </span>
                <p className="font-mono text-xs font-bold text-[#1C1410] break-all">
                  {selectedInfluencer.email}
                </p>
              </div>

              {/* Gmail Thread ID */}
              <div className="p-3.5 bg-white rounded-xl border border-[#E2D9D0] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A6860] flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-[#C9A84C]" />
                    Gmail Thread ID
                  </span>
                  {selectedInfluencer.gmailThreadId && selectedInfluencer.gmailThreadId !== 'None' && (
                    <button
                      onClick={() => copyToClipboard(selectedInfluencer.gmailThreadId)}
                      className="text-[11px] text-[#6B1A2A] hover:text-[#8B2535] flex items-center gap-1 cursor-pointer"
                    >
                      {copiedThreadId ? (
                        <>
                          <Check className="w-3 h-3 text-[#2D6A4F]" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
                <p className="font-mono text-xs font-bold text-[#1C1410] break-all">
                  {selectedInfluencer.gmailThreadId || 'None'}
                </p>
              </div>

              {/* Outreach Status */}
              <div className="p-3.5 bg-white rounded-xl border border-[#E2D9D0] space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A6860] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  Outreach Status
                </span>
                <p className="text-xs font-bold text-[#1C1410]">
                  {selectedInfluencer.outreachStatus}
                </p>
              </div>

              {/* Last Contacted */}
              <div className="p-3.5 bg-white rounded-xl border border-[#E2D9D0] space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A6860] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#7A6860]" />
                  Last Contacted
                </span>
                <p className="text-xs font-bold text-[#1C1410]">
                  {selectedInfluencer.lastContacted}
                </p>
              </div>
            </div>

            {/* Recommendation & Audience Metrics */}
            <div className="p-4 rounded-xl bg-white border border-[#E2D9D0] space-y-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A6860]">
                  AI Outreach Recommendation
                </span>
                <p className="text-sm font-bold text-[#6B1A2A] mt-0.5">
                  {selectedInfluencer.recommendation}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-[#E2D9D0]/60 text-xs">
                <div>
                  <span className="text-[#7A6860]">Follower Count:</span>
                  <p className="font-bold text-[#1C1410] mt-0.5">
                    {formatNumber(selectedInfluencer.followers)}
                  </p>
                </div>
                <div>
                  <span className="text-[#7A6860]">Niche:</span>
                  <p className="font-bold text-[#1C1410] mt-0.5">
                    {selectedInfluencer.niche}
                  </p>
                </div>
                <div>
                  <span className="text-[#7A6860]">Instagram Handle:</span>
                  <p className="font-mono text-[#6B1A2A] font-semibold mt-0.5">
                    {selectedInfluencer.username}
                  </p>
                </div>
              </div>
            </div>

            {/* Raw JSON Record for verification */}
            {selectedInfluencer.raw && (
              <details className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E2D9D0] text-xs">
                <summary className="font-semibold text-[#7A6860] cursor-pointer hover:text-[#1C1410]">
                  View Raw n8n / Google Sheets Outreach Data
                </summary>
                <pre className="mt-2 p-2 bg-white rounded border border-[#E2D9D0] text-[11px] font-mono text-[#1C1410] overflow-x-auto max-h-40">
                  {JSON.stringify(selectedInfluencer.raw, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
