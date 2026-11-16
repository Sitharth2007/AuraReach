import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Target,
  Eye,
  Zap,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  BarChart3,
  MapPin,
  AtSign,
  AlertCircle,
  RefreshCw,
  Database,
  ExternalLink,
  CheckCircle2,
  Inbox,
  UserCheck
} from 'lucide-react';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { formatNumber, formatPercent } from '../utils/formatters';
import { fetchInfluencersFromN8N, getInfluencersEndpointUrl } from '../services/influencerService';

export default function AIAnalysis() {
  // API State
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  // Filter & Search State
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [nicheFilter, setNicheFilter] = useState('All');
  const [sortField, setSortField] = useState('aiScore');
  const [sortAsc, setSortAsc] = useState(false);

  // Expanded card & detail modal states
  const [expandedId, setExpandedId] = useState(null);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const endpointUrl = getInfluencersEndpointUrl();

  // Fetch from n8n Cloud Google Sheets CRM API
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetchInfluencersFromN8N();
      setInfluencers(res.data || []);
      setLastSyncedAt(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn('AI Analysis n8n API fetch error:', err);
      setError({
        message: err.message || 'Failed to fetch AI analysis records from n8n Cloud API',
        hint: err.data?.hint || (err.message?.includes('not registered')
          ? "In n8n Cloud, webhook-test URLs only listen after you click 'Execute workflow' or 'Test step' on the canvas. Alternatively, activate the workflow for permanent access."
          : null),
        status: err.status || (err.isTimeout ? 408 : 500)
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Extract unique niches from active API response
  const niches = useMemo(() => {
    if (!influencers || influencers.length === 0) return ['All'];
    const list = Array.from(new Set(influencers.map((i) => i.niche).filter(Boolean)));
    return ['All', ...list];
  }, [influencers]);

  // Filter & Sort actual CRM data
  const filteredInfluencers = useMemo(() => {
    return (influencers || [])
      .filter((inf) => {
        const q = search.toLowerCase().trim();
        const matchSearch =
          !q ||
          (inf.name && inf.name.toLowerCase().includes(q)) ||
          (inf.username && inf.username.toLowerCase().includes(q)) ||
          (inf.niche && inf.niche.toLowerCase().includes(q)) ||
          (inf.recommendation && inf.recommendation.toLowerCase().includes(q)) ||
          (inf.aiSummary && inf.aiSummary.toLowerCase().includes(q)) ||
          (inf.aiReason && inf.aiReason.toLowerCase().includes(q));

        const matchPriority = priorityFilter === 'All' || inf.priority === priorityFilter;
        const matchNiche = nicheFilter === 'All' || inf.niche === nicheFilter;

        return matchSearch && matchPriority && matchNiche;
      })
      .sort((a, b) => {
        let va = a[sortField];
        let vb = b[sortField];
        if (typeof va === 'string') {
          return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
        }
        return sortAsc ? (va || 0) - (vb || 0) : (vb || 0) - (va || 0);
      });
  }, [influencers, search, priorityFilter, nicheFilter, sortField, sortAsc]);

  // Score distribution dynamically calculated from API response
  const scoreDistribution = useMemo(() => {
    const total = influencers.length;
    const high = influencers.filter((i) => i.priority === 'High').length;
    const med = influencers.filter((i) => i.priority === 'Medium').length;
    const low = influencers.filter((i) => i.priority === 'Low').length;
    const avgScore = total > 0 ? Math.round(influencers.reduce((acc, i) => acc + (i.aiScore || 0), 0) / total) : 0;

    return { total, high, med, low, avgScore };
  }, [influencers]);

  const getScoreColor = (score) => {
    if (score >= 88) return 'text-[#6B1A2A]';
    if (score >= 75) return 'text-[#8A6A1F]';
    return 'text-[#7A6860]';
  };

  const getScoreBg = (score) => {
    if (score >= 88) return 'bg-[#6B1A2A]/10 border-[#6B1A2A]/25';
    if (score >= 75) return 'bg-[#C9A84C]/15 border-[#C9A84C]/35';
    return 'bg-[#7A6860]/10 border-[#7A6860]/20';
  };

  const openDetailModal = (inf, e) => {
    if (e) e.stopPropagation();
    setSelectedInfluencer(inf);
    setDetailModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl lg:text-2xl font-bold font-sans text-[#1C1410] tracking-tight">
              AI Scoring & Influencer Intelligence
            </h1>
            {!loading && !error && (
              <span className="text-[10px] font-semibold text-[#2D6A4F] bg-[#2D6A4F]/10 border border-[#2D6A4F]/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F] animate-pulse" />
                Live CRM Analysis
              </span>
            )}
          </div>
          <p className="text-xs text-[#7A6860]">
            {loading ? (
              'Fetching AI scoring and analysis data from Google Sheets CRM via n8n...'
            ) : error ? (
              <span className="text-[#9E2A2B]">API connection notice &bull; Review n8n status below</span>
            ) : (
              `Displaying ${filteredInfluencers.length} of ${influencers.length} analyzed creator profiles from Google Sheets CRM`
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
            disabled={loading}
            onClick={loadData}
            className="border-[#E2D9D0]"
          >
            {loading ? 'Syncing...' : 'Sync with n8n'}
          </Button>
        </div>
      </div>

      {/* Connected Endpoint Banner */}
      <div className="px-4 py-2.5 rounded-xl bg-white border border-[#E2D9D0] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 truncate">
          <Database className="w-4 h-4 text-[#C9A84C] shrink-0" />
          <span className="font-semibold text-[#1C1410] shrink-0">Analysis Source:</span>
          <code className="font-mono text-[11px] text-[#6B1A2A] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E2D9D0] truncate max-w-xl">
            {endpointUrl}
          </code>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-[#7A6860]">
            CRM Evaluated: <strong className="text-[#1C1410]">{influencers.length} Records</strong>
          </span>
        </div>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="bg-white rounded-2xl p-16 border border-[#E2D9D0] shadow-subtle text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-3 border-[#E2D9D0] border-t-[#6B1A2A] animate-spin mx-auto" />
          <div>
            <p className="text-sm font-bold text-[#1C1410]">
              Retrieving AI Analysis Records from n8n Cloud...
            </p>
            <p className="text-xs text-[#7A6860] mt-1 max-w-md mx-auto">
              Connecting to Google Sheets CRM to load AI scores, reasoning, discovery match scores, and recommendations.
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
                  Failed to Load AI Analysis Data from n8n Cloud
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
            <Button variant="primary" size="sm" icon={RefreshCw} onClick={loadData}>
              Retry n8n Connection
            </Button>
            <span className="text-xs text-[#7A6860]">
              Ensure your n8n workflow canvas is listening or the workflow is active.
            </span>
          </div>
        </div>
      )}

      {/* DYNAMIC METRIC SUMMARY CARDS */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white rounded-xl p-4 border border-[#E2D9D0] shadow-subtle text-center">
            <p className="text-[10px] uppercase tracking-wider font-bold text-[#7A6860]">Total Analyzed</p>
            <p className="text-2xl font-extrabold text-[#1C1410] mt-1">{scoreDistribution.total}</p>
            <p className="text-[10px] text-[#7A6860]">Google Sheets CRM</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#6B1A2A]/30 shadow-subtle text-center">
            <p className="text-[10px] uppercase tracking-wider font-bold text-[#6B1A2A]">High Priority</p>
            <p className="text-2xl font-extrabold text-[#6B1A2A] mt-1">{scoreDistribution.high}</p>
            <p className="text-[10px] text-[#7A6860]">
              {scoreDistribution.total > 0 ? ((scoreDistribution.high / scoreDistribution.total) * 100).toFixed(0) : 0}% of CRM
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#C9A84C]/30 shadow-subtle text-center">
            <p className="text-[10px] uppercase tracking-wider font-bold text-[#8A6A1F]">Medium Priority</p>
            <p className="text-2xl font-extrabold text-[#8A6A1F] mt-1">{scoreDistribution.med}</p>
            <p className="text-[10px] text-[#7A6860]">
              {scoreDistribution.total > 0 ? ((scoreDistribution.med / scoreDistribution.total) * 100).toFixed(0) : 0}% of CRM
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#E2D9D0] shadow-subtle text-center">
            <p className="text-[10px] uppercase tracking-wider font-bold text-[#7A6860]">Low Priority</p>
            <p className="text-2xl font-extrabold text-[#7A6860] mt-1">{scoreDistribution.low}</p>
            <p className="text-[10px] text-[#7A6860]">
              {scoreDistribution.total > 0 ? ((scoreDistribution.low / scoreDistribution.total) * 100).toFixed(0) : 0}% of CRM
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#E2D9D0] shadow-subtle text-center">
            <p className="text-[10px] uppercase tracking-wider font-bold text-[#7A6860]">Avg AI Score</p>
            <p className="text-2xl font-extrabold text-[#1C1410] mt-1">{scoreDistribution.avgScore}</p>
            <p className="text-[10px] text-[#7A6860]">Out of 100 points</p>
          </div>
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      {!loading && (
        <div className="bg-white rounded-2xl p-4 border border-[#E2D9D0] shadow-subtle space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6860]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, handle, summary, reason..."
                className="w-full bg-[#FAF7F2] border border-[#E2D9D0] rounded-lg pl-9 pr-3 py-2 text-xs text-[#1C1410] placeholder:text-[#7A6860]/70 focus:outline-none focus:ring-1 focus:ring-[#8B2535] focus:border-[#8B2535]"
              />
            </div>

            {/* Priority Filter: High, Medium, Low */}
            <div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E2D9D0] rounded-lg px-3 py-2 text-xs text-[#1C1410] focus:outline-none focus:ring-1 focus:ring-[#8B2535] focus:border-[#8B2535] cursor-pointer"
              >
                <option value="All">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            {/* Niche Filter: derived dynamically from CRM */}
            <div>
              <select
                value={nicheFilter}
                onChange={(e) => setNicheFilter(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E2D9D0] rounded-lg px-3 py-2 text-xs text-[#1C1410] focus:outline-none focus:ring-1 focus:ring-[#8B2535] focus:border-[#8B2535] cursor-pointer"
              >
                {niches.map((n) => (
                  <option key={n} value={n}>
                    Niche: {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Field */}
            <div>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E2D9D0] rounded-lg px-3 py-2 text-xs text-[#1C1410] focus:outline-none focus:ring-1 focus:ring-[#8B2535] focus:border-[#8B2535] cursor-pointer"
              >
                <option value="aiScore">Sort by AI Score</option>
                <option value="discoveryMatchScore">Sort by Discovery Match</option>
                <option value="followers">Sort by Followers</option>
                <option value="engagementRate">Sort by Engagement Rate</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(priorityFilter !== 'All' || nicheFilter !== 'All' || search) && (
            <div className="pt-2 border-t border-[#E2D9D0]/60 flex items-center gap-2 flex-wrap text-xs text-[#7A6860]">
              <span className="font-semibold text-[#1C1410]">Active Filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E2D9D0] text-[#6B1A2A]">
                  Search: "{search}"
                  <button onClick={() => setSearch('')} className="cursor-pointer">&times;</button>
                </span>
              )}
              {priorityFilter !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E2D9D0] text-[#6B1A2A]">
                  Priority: {priorityFilter}
                  <button onClick={() => setPriorityFilter('All')} className="cursor-pointer">&times;</button>
                </span>
              )}
              {nicheFilter !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E2D9D0] text-[#6B1A2A]">
                  Niche: {nicheFilter}
                  <button onClick={() => setNicheFilter('All')} className="cursor-pointer">&times;</button>
                </span>
              )}
              <button
                onClick={() => {
                  setPriorityFilter('All');
                  setNicheFilter('All');
                  setSearch('');
                }}
                className="text-[#8B2535] hover:underline font-medium text-xs ml-auto cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && filteredInfluencers.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#E2D9D0] p-16 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#E2D9D0] flex items-center justify-center mx-auto text-[#7A6860]">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#1C1410]">No Influencers Match Criteria</h3>
          <p className="text-xs text-[#7A6860] max-w-sm mx-auto">
            {influencers.length === 0
              ? 'The CRM API returned zero influencer analysis records. Verify that your Google Sheet has scored entries.'
              : 'Try clearing your search query or selecting a different priority / niche filter.'}
          </p>
          {influencers.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setPriorityFilter('All');
                setNicheFilter('All');
                setSearch('');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* INFLUENCER AI ANALYSIS CARDS */}
      {!loading && filteredInfluencers.length > 0 && (
        <div className="space-y-4">
          {filteredInfluencers.map((inf) => {
            const isExpanded = expandedId === inf.id;

            return (
              <div
                key={inf.id}
                className={`bg-white rounded-2xl border shadow-subtle overflow-hidden transition-all duration-200 ${
                  isExpanded ? 'border-[#8B2535]/40 shadow-hover' : 'border-[#E2D9D0] hover:border-[#B85C6E]/30'
                }`}
              >
                {/* Summary Row */}
                <div
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF7F2]/40 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : inf.id)}
                >
                  {/* Left: Avatar, Name, Handle, Niche, Location */}
                  <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                    <img
                      src={inf.avatar}
                      alt={inf.name}
                      className="w-12 h-12 rounded-full object-cover ring-1 ring-[#E2D9D0] shadow-sm shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-[#1C1410] truncate">
                          {inf.name}
                        </h3>
                        <Badge>{inf.priority}</Badge>
                        <Badge size="sm" variant="muted">{inf.niche}</Badge>
                        {inf.locationStatus && (
                          <span className="text-[10px] text-[#7A6860] bg-[#FAF7F2] border border-[#E2D9D0] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                            <MapPin className="w-3 h-3 text-[#B85C6E]" />
                            {inf.locationStatus}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#7A6860] mt-1 flex-wrap">
                        <a
                          href={`https://instagram.com/${(inf.username || '').replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#7A6860] hover:text-[#8B2535] flex items-center gap-1 font-mono text-[11px]"
                        >
                          <AtSign className="w-3 h-3 text-[#B85C6E]" />
                          {inf.username}
                        </a>
                        <span>&bull;</span>
                        <span>Followers: <strong className="text-[#1C1410]">{formatNumber(inf.followers)}</strong></span>
                        <span>&bull;</span>
                        <span>Eng. Rate: <strong className="text-[#2D6A4F]">{formatPercent(inf.engagementRate)}</strong></span>
                      </div>

                      {/* Bio snippet */}
                      {inf.bio && (
                        <p className="text-xs text-[#7A6860] mt-1.5 line-clamp-1 italic">
                          "{inf.bio}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Scores & Actions */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    {/* Discovery Match Score Badge */}
                    {inf.discoveryMatchScore !== null && (
                      <div className="text-center px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E2D9D0]">
                        <p className="text-[9px] uppercase tracking-wider font-bold text-[#7A6860]">
                          Match Score
                        </p>
                        <p className="text-base font-extrabold text-[#1C1410]">
                          {inf.discoveryMatchScore}%
                        </p>
                      </div>
                    )}

                    {/* AI Score Badge */}
                    <div className={`w-14 h-14 rounded-xl border flex flex-col items-center justify-center ${getScoreBg(inf.aiScore)}`}>
                      <span className={`text-xl font-extrabold ${getScoreColor(inf.aiScore)}`}>
                        {inf.aiScore}
                      </span>
                      <span className="text-[9px] text-[#7A6860] font-medium">/100</span>
                    </div>

                    {/* View Dossier Modal Trigger */}
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Eye}
                      onClick={(e) => openDetailModal(inf, e)}
                      className="text-xs border-[#E2D9D0] hidden sm:inline-flex"
                    >
                      Dossier
                    </Button>

                    {/* Expand Accordion toggle */}
                    <button
                      className="p-1.5 text-[#7A6860] hover:text-[#1C1410] rounded-lg hover:bg-[#FAF7F2] transition-colors"
                      aria-label="Expand analysis"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* EXPANDED ACCORDION VIEW */}
                {isExpanded && (
                  <div className="border-t border-[#E2D9D0] bg-[#FAF7F2]/40 p-6 space-y-5 animate-in fade-in duration-150">
                    {/* Top Row: AI Summary & Recommendation */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                      {/* Left: AI Summary & AI Reason (7 cols) */}
                      <div className="lg:col-span-7 space-y-4">
                        {/* AI Summary */}
                        <div className="p-4 bg-white rounded-xl border border-[#E2D9D0] space-y-1.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1410] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                            AI Qualitative Summary
                          </h4>
                          <p className="text-xs text-[#1C1410] leading-relaxed">
                            {inf.aiSummary}
                          </p>
                        </div>

                        {/* AI Reason */}
                        <div className="p-4 bg-white rounded-xl border border-[#E2D9D0] space-y-1.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1410] flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-[#8B2535]" />
                            Scoring Rationale & Methodology
                          </h4>
                          <p className="text-xs text-[#7A6860] leading-relaxed">
                            {inf.aiReason}
                          </p>
                        </div>

                        {/* Discovery Match Reasons */}
                        <div className="p-4 bg-white rounded-xl border border-[#E2D9D0] space-y-1.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1410] flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5 text-[#2D6A4F]" />
                            Discovery Match Reasons
                          </h4>
                          <p className="text-xs text-[#7A6860] leading-relaxed">
                            {inf.discoveryMatchReasons}
                          </p>
                        </div>
                      </div>

                      {/* Right: Recommendation, Metrics, and Location Breakdown (5 cols) */}
                      <div className="lg:col-span-5 space-y-4">
                        {/* Recommendation Card */}
                        <div className="p-4 bg-white rounded-xl border border-[#E2D9D0] space-y-2">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A6860]">
                            CRM Recommendation
                          </span>
                          <p className="text-sm font-bold text-[#6B1A2A]">
                            {inf.recommendation}
                          </p>
                          <p className="text-xs text-[#7A6860]">
                            Current Status: <strong className="text-[#1C1410]">{inf.status}</strong>
                          </p>
                        </div>

                        {/* Metric Grid */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="p-3 bg-white rounded-xl border border-[#E2D9D0]">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A6860]">
                              Follower Count
                            </span>
                            <p className="text-base font-bold text-[#1C1410] mt-0.5">
                              {formatNumber(inf.followers)}
                            </p>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-[#E2D9D0]">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A6860]">
                              Engagement Rate
                            </span>
                            <p className="text-base font-bold text-[#2D6A4F] mt-0.5">
                              {formatPercent(inf.engagementRate)}
                            </p>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-[#E2D9D0]">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A6860]">
                              Match Score
                            </span>
                            <p className="text-base font-bold text-[#C9A84C] mt-0.5">
                              {inf.discoveryMatchScore !== null ? `${inf.discoveryMatchScore}%` : 'N/A'}
                            </p>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-[#E2D9D0]">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A6860]">
                              Location Status
                            </span>
                            <p className="text-xs font-bold text-[#1C1410] mt-1 truncate">
                              {inf.locationStatus}
                            </p>
                          </div>
                        </div>

                        {/* Bio box */}
                        {inf.bio && (
                          <div className="p-3 bg-white rounded-xl border border-[#E2D9D0] text-xs">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A6860]">
                              Instagram Bio
                            </span>
                            <p className="text-xs text-[#1C1410] mt-1 italic">
                              "{inf.bio}"
                            </p>
                          </div>
                        )}

                        <div className="flex justify-end pt-1">
                          <Button
                            variant="primary"
                            size="sm"
                            icon={Eye}
                            onClick={(e) => openDetailModal(inf, e)}
                          >
                            Open Complete Dossier
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* DETAILED INFLUENCER ANALYSIS MODAL */}
      {selectedInfluencer && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={selectedInfluencer.name}
          subtitle={`AI Intelligence Dossier &bull; Source: Google Sheets CRM via n8n`}
          maxWidth="max-w-3xl"
          footer={
            <div className="flex items-center justify-between w-full text-xs">
              <span className="font-mono text-[#7A6860]">
                Record ID: {selectedInfluencer.id}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDetailModalOpen(false)}
              >
                Close Dossier
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Top Identity Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#E2D9D0]">
              <div className="flex items-center gap-4">
                <img
                  src={selectedInfluencer.avatar}
                  alt={selectedInfluencer.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-[#C9A84C]/50 shadow-sm shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-[#1C1410]">
                      {selectedInfluencer.name}
                    </h3>
                    <Badge>{selectedInfluencer.priority}</Badge>
                    <Badge size="sm" variant="muted">{selectedInfluencer.niche}</Badge>
                  </div>
                  <p className="text-xs text-[#7A6860] font-mono mt-0.5">
                    {selectedInfluencer.username} &bull; {selectedInfluencer.locationStatus}
                  </p>
                  {selectedInfluencer.bio && (
                    <p className="text-xs text-[#1C1410] mt-1.5 italic">
                      "{selectedInfluencer.bio}"
                    </p>
                  )}
                </div>
              </div>

              {/* Dual Score Pills */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right p-3 bg-[#FAF7F2] rounded-lg border border-[#E2D9D0]">
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

                {selectedInfluencer.discoveryMatchScore !== null && (
                  <div className="text-right p-3 bg-[#FAF7F2] rounded-lg border border-[#E2D9D0]">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[#7A6860]">
                      Match Score
                    </p>
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-2xl font-extrabold text-[#C9A84C]">
                        {selectedInfluencer.discoveryMatchScore}
                      </span>
                      <span className="text-xs text-[#7A6860]">%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-white rounded-xl border border-[#E2D9D0]">
                <span className="text-[10px] uppercase tracking-wider text-[#7A6860] font-semibold">
                  Followers
                </span>
                <p className="text-base font-bold text-[#1C1410] mt-0.5">
                  {formatNumber(selectedInfluencer.followers)}
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E2D9D0]">
                <span className="text-[10px] uppercase tracking-wider text-[#7A6860] font-semibold">
                  Engagement Rate
                </span>
                <p className="text-base font-bold text-[#2D6A4F] mt-0.5">
                  {formatPercent(selectedInfluencer.engagementRate)}
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E2D9D0]">
                <span className="text-[10px] uppercase tracking-wider text-[#7A6860] font-semibold">
                  CRM Status
                </span>
                <div className="mt-1">
                  <Badge size="sm">{selectedInfluencer.status}</Badge>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E2D9D0]">
                <span className="text-[10px] uppercase tracking-wider text-[#7A6860] font-semibold">
                  Location Status
                </span>
                <p className="text-xs font-bold text-[#1C1410] mt-1 truncate">
                  {selectedInfluencer.locationStatus}
                </p>
              </div>
            </div>

            {/* AI Qualitative Narrative */}
            <div className="space-y-3">
              {/* AI Summary */}
              <div className="p-4 rounded-xl bg-white border border-[#E2D9D0] space-y-1.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1410]">
                    AI Evaluation Summary
                  </h4>
                </div>
                <p className="text-xs text-[#1C1410] leading-relaxed">
                  {selectedInfluencer.aiSummary}
                </p>
              </div>

              {/* AI Reason */}
              <div className="p-4 rounded-xl bg-white border border-[#E2D9D0] space-y-1.5">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#8B2535]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1410]">
                    AI Scoring Reason & Logic
                  </h4>
                </div>
                <p className="text-xs text-[#7A6860] leading-relaxed">
                  {selectedInfluencer.aiReason}
                </p>
              </div>

              {/* Discovery Match Reasons */}
              <div className="p-4 rounded-xl bg-white border border-[#E2D9D0] space-y-1.5">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#2D6A4F]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1410]">
                    Discovery Match Reasons
                  </h4>
                </div>
                <p className="text-xs text-[#7A6860] leading-relaxed">
                  {selectedInfluencer.discoveryMatchReasons}
                </p>
              </div>
            </div>

            {/* Recommendation & Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-[#E2D9D0] space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A6860]">
                  Suggested Campaign Action
                </span>
                <p className="text-sm font-bold text-[#6B1A2A]">
                  {selectedInfluencer.recommendation}
                </p>
                <p className="text-xs text-[#7A6860]">
                  Contact Email: <strong className="font-mono text-[#1C1410]">{selectedInfluencer.email}</strong>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E2D9D0] space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A6860]">
                  Instagram Link
                </span>
                <p className="text-xs font-mono text-[#6B1A2A] font-semibold mt-1">
                  instagram.com/{selectedInfluencer.username.replace('@', '')}
                </p>
                <p className="text-xs text-[#7A6860]">
                  Niche Classification: <strong className="text-[#1C1410]">{selectedInfluencer.niche}</strong>
                </p>
              </div>
            </div>

            {/* Raw JSON Data Drawer for transparency with Google Sheets */}
            {selectedInfluencer.raw && (
              <details className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E2D9D0] text-xs">
                <summary className="font-semibold text-[#7A6860] cursor-pointer hover:text-[#1C1410]">
                  View Raw n8n / Google Sheets Record
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
