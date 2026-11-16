import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  Sparkles,
  Mail,
  AtSign,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  X,
  ChevronDown,
  Download,
  RefreshCw,
  AlertCircle,
  Database,
  Layers,
  Inbox
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { formatNumber, formatPercent } from '../utils/formatters';
import { fetchInfluencersFromN8N, getInfluencersEndpointUrl } from '../services/influencerService';

export default function Influencers() {
  const { globalSearch, setGlobalSearch } = useApp();

  // API State
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);
  const [dataSource, setDataSource] = useState('api'); // 'api' or 'fallback'

  // Filter & Sort State
  const [nicheFilter, setNicheFilter] = useState('All');
  const [recommendationFilter, setRecommendationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('aiScore');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const endpointUrl = getInfluencersEndpointUrl();

  // Fetch from n8n API
  const loadInfluencers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetchInfluencersFromN8N();
      setInfluencers(res.data);
      setDataSource('api');
      setLastFetchedAt(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn('n8n API fetch error:', err);
      setError({
        message: err.message || 'Failed to fetch from n8n API',
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
    loadInfluencers();
  }, [loadInfluencers]);

  // Extract unique niches from active data
  const niches = useMemo(() => {
    if (!influencers || influencers.length === 0) return ['All'];
    const list = Array.from(new Set(influencers.map((i) => i.niche).filter(Boolean)));
    return ['All', ...list];
  }, [influencers]);

  // Extract unique recommendations
  const recommendations = useMemo(() => {
    if (!influencers || influencers.length === 0) return ['All'];
    const list = Array.from(new Set(influencers.map((i) => i.recommendation).filter(Boolean)));
    return ['All', ...list];
  }, [influencers]);

  // Extract unique statuses
  const statuses = useMemo(() => {
    if (!influencers || influencers.length === 0) return ['All'];
    const list = Array.from(new Set(influencers.map((i) => i.status).filter(Boolean)));
    return ['All', ...list];
  }, [influencers]);

  // Filter & Sort Logic
  const filteredInfluencers = useMemo(() => {
    return (influencers || [])
      .filter((inf) => {
        const q = (globalSearch || '').toLowerCase().trim();
        const matchesSearch =
          !q ||
          (inf.name && inf.name.toLowerCase().includes(q)) ||
          (inf.username && inf.username.toLowerCase().includes(q)) ||
          (inf.niche && inf.niche.toLowerCase().includes(q)) ||
          (inf.email && inf.email.toLowerCase().includes(q)) ||
          (inf.recommendation && inf.recommendation.toLowerCase().includes(q)) ||
          (inf.status && inf.status.toLowerCase().includes(q));

        const matchesNiche = nicheFilter === 'All' || inf.niche === nicheFilter;
        const matchesRec =
          recommendationFilter === 'All' || inf.recommendation === recommendationFilter;
        const matchesStatus = statusFilter === 'All' || inf.status === statusFilter;

        return matchesSearch && matchesNiche && matchesRec && matchesStatus;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];

        if (typeof valA === 'string') {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortAsc ? (valA || 0) - (valB || 0) : (valB || 0) - (valA || 0);
      });
  }, [influencers, globalSearch, nicheFilter, recommendationFilter, statusFilter, sortField, sortAsc]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const openProfile = (inf) => {
    setSelectedInfluencer(inf);
    setProfileModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl lg:text-2xl font-bold font-sans text-[#1C1410] tracking-tight">
              Instagram Influencer Directory
            </h1>
            {!loading && !error && (
              <span className="text-[10px] font-semibold text-[#2D6A4F] bg-[#2D6A4F]/10 border border-[#2D6A4F]/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F] animate-pulse" />
                Live n8n API
              </span>
            )}
          </div>
          <p className="text-xs text-[#7A6860]">
            {loading ? (
              'Connecting to n8n Cloud and syncing Google Sheets CRM...'
            ) : error ? (
              <span className="text-[#9E2A2B]">API connection notice &bull; Check n8n status below</span>
            ) : (
              `Displaying ${filteredInfluencers.length} of ${influencers.length} creators retrieved from Google Sheets CRM`
            )}
            {lastFetchedAt && !loading && (
              <span className="ml-2 text-[#7A6860]/80">(&bull; Synced at {lastFetchedAt})</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            disabled={loading}
            onClick={loadInfluencers}
            className="border-[#E2D9D0]"
          >
            {loading ? 'Syncing...' : 'Sync with n8n'}
          </Button>

          {influencers.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={() => {
                const headers = ['Name', 'Username', 'Niche', 'Followers', 'AI Score', 'Recommendation', 'Status', 'Email'];
                const csvRows = [
                  headers.join(','),
                  ...filteredInfluencers.map((i) =>
                    [
                      `"${i.name || ''}"`,
                      `"${i.username || ''}"`,
                      `"${i.niche || ''}"`,
                      i.followers || 0,
                      i.aiScore || 0,
                      `"${i.recommendation || ''}"`,
                      `"${i.status || ''}"`,
                      `"${i.email || ''}"`
                    ].join(',')
                  )
                ];
                const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
                const link = document.createElement('a');
                link.setAttribute('href', encodeURI(csvContent));
                link.setAttribute('download', 'influencers_crm_n8n.csv');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {/* API Endpoint Banner */}
      <div className="px-4 py-2.5 rounded-xl bg-white border border-[#E2D9D0] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 truncate">
          <Database className="w-4 h-4 text-[#C9A84C] shrink-0" />
          <span className="font-semibold text-[#1C1410] shrink-0">CRM Endpoint:</span>
          <code className="font-mono text-[11px] text-[#6B1A2A] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E2D9D0] truncate max-w-xl">
            {endpointUrl}
          </code>
        </div>
        <span className="text-[11px] text-[#7A6860] shrink-0">
          Source: <strong className="text-[#1C1410]">Google Sheets &rarr; n8n Webhook (GET)</strong>
        </span>
      </div>

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
                  n8n Cloud Webhook Response Notice
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
            <Button
              variant="primary"
              size="sm"
              icon={RefreshCw}
              onClick={loadInfluencers}
            >
              Retry n8n Connection
            </Button>
            <span className="text-xs text-[#7A6860]">
              Make sure your n8n workflow canvas is listening or the workflow is active.
            </span>
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
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search name, handle, email, niche..."
                className="w-full bg-[#FAF7F2] border border-[#E2D9D0] rounded-lg pl-9 pr-3 py-2 text-xs text-[#1C1410] placeholder:text-[#7A6860]/70 focus:outline-none focus:ring-1 focus:ring-[#8B2535] focus:border-[#8B2535]"
              />
            </div>

            {/* Niche Filter */}
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

            {/* Recommendation Filter */}
            <div>
              <select
                value={recommendationFilter}
                onChange={(e) => setRecommendationFilter(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E2D9D0] rounded-lg px-3 py-2 text-xs text-[#1C1410] focus:outline-none focus:ring-1 focus:ring-[#8B2535] focus:border-[#8B2535] cursor-pointer"
              >
                {recommendations.map((r) => (
                  <option key={r} value={r}>
                    Recommendation: {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E2D9D0] rounded-lg px-3 py-2 text-xs text-[#1C1410] focus:outline-none focus:ring-1 focus:ring-[#8B2535] focus:border-[#8B2535] cursor-pointer"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    Status: {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(nicheFilter !== 'All' ||
            recommendationFilter !== 'All' ||
            statusFilter !== 'All' ||
            globalSearch) && (
            <div className="pt-2 border-t border-[#E2D9D0]/60 flex items-center gap-2 flex-wrap text-xs text-[#7A6860]">
              <span className="font-semibold text-[#1C1410]">Active Filters:</span>
              {globalSearch && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E2D9D0] text-[#6B1A2A]">
                  Search: "{globalSearch}"
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setGlobalSearch('')} />
                </span>
              )}
              {nicheFilter !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E2D9D0] text-[#6B1A2A]">
                  Niche: {nicheFilter}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setNicheFilter('All')} />
                </span>
              )}
              {recommendationFilter !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E2D9D0] text-[#6B1A2A]">
                  Recommendation: {recommendationFilter}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setRecommendationFilter('All')} />
                </span>
              )}
              {statusFilter !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E2D9D0] text-[#6B1A2A]">
                  Status: {statusFilter}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setStatusFilter('All')} />
                </span>
              )}
              <button
                onClick={() => {
                  setNicheFilter('All');
                  setRecommendationFilter('All');
                  setStatusFilter('All');
                  setGlobalSearch('');
                }}
                className="text-[#8B2535] hover:underline font-medium text-xs ml-auto cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* TABLE / LOADING / EMPTY STATES */}
      <div className="bg-white rounded-2xl border border-[#E2D9D0] shadow-subtle overflow-hidden">
        {/* LOADING STATE */}
        {loading && (
          <div className="py-20 px-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-3 border-[#E2D9D0] border-t-[#6B1A2A] animate-spin mx-auto" />
            <div>
              <p className="text-sm font-bold text-[#1C1410]">
                Fetching Influencers from n8n Cloud...
              </p>
              <p className="text-xs text-[#7A6860] mt-1 max-w-sm mx-auto">
                Retrieving live records from Google Sheets CRM via GET endpoint:
                <br />
                <span className="font-mono text-[11px] text-[#6B1A2A]">{endpointUrl}</span>
              </p>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && filteredInfluencers.length === 0 && (
          <div className="py-20 px-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#E2D9D0] flex items-center justify-center mx-auto text-[#7A6860]">
              <Inbox className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1C1410]">No Influencers Found</h3>
              <p className="text-xs text-[#7A6860] mt-1 max-w-md mx-auto">
                {influencers.length === 0
                  ? "The Google Sheets CRM via n8n returned zero records. Please check that your sheet has populated rows."
                  : "No influencers matched the selected filter criteria. Try resetting your search or filters."}
              </p>
            </div>
            {influencers.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setNicheFilter('All');
                  setRecommendationFilter('All');
                  setStatusFilter('All');
                  setGlobalSearch('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* INFLUENCERS DATA TABLE */}
        {!loading && filteredInfluencers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#E2D9D0] text-[#7A6860] uppercase tracking-wider font-semibold">
                  {/* 1. Name */}
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-[#1C1410]"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Name <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>

                  {/* 2. Username */}
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-[#1C1410]"
                    onClick={() => handleSort('username')}
                  >
                    <div className="flex items-center gap-1">
                      Username <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>

                  {/* 3. Niche */}
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-[#1C1410]"
                    onClick={() => handleSort('niche')}
                  >
                    <div className="flex items-center gap-1">
                      Niche <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>

                  {/* 4. Followers */}
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-[#1C1410]"
                    onClick={() => handleSort('followers')}
                  >
                    <div className="flex items-center gap-1">
                      Followers <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>

                  {/* 5. AI Score */}
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-[#1C1410]"
                    onClick={() => handleSort('aiScore')}
                  >
                    <div className="flex items-center gap-1">
                      AI Score <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>

                  {/* 6. Recommendation */}
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-[#1C1410]"
                    onClick={() => handleSort('recommendation')}
                  >
                    <div className="flex items-center gap-1">
                      Recommendation <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>

                  {/* 7. Status */}
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-[#1C1410]"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>

                  {/* 8. Email */}
                  <th className="py-3.5 px-4">Email</th>

                  {/* Actions */}
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D9D0]/60 text-[#1C1410]">
                {filteredInfluencers.map((inf) => (
                  <tr
                    key={inf.id}
                    className="hover:bg-[#FAF7F2]/80 transition-colors group"
                  >
                    {/* 1. Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={inf.avatar}
                          alt={inf.name}
                          className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-[#E2D9D0] shadow-sm"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-[#1C1410] truncate group-hover:text-[#6B1A2A] transition-colors">
                            {inf.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 2. Username */}
                    <td className="py-3 px-4">
                      <a
                        href={`https://instagram.com/${(inf.username || '').replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#7A6860] hover:text-[#8B2535] flex items-center gap-1 font-mono text-[11px]"
                      >
                        <AtSign className="w-3 h-3 text-[#B85C6E]" />
                        {inf.username}
                      </a>
                    </td>

                    {/* 3. Niche */}
                    <td className="py-3 px-4 font-medium text-[#1C1410]">
                      {inf.niche}
                    </td>

                    {/* 4. Followers */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-[#1C1410]">
                        {formatNumber(inf.followers)}
                      </p>
                    </td>

                    {/* 5. AI Score */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center font-sans text-xs ${
                            inf.aiScore >= 88
                              ? 'bg-[#6B1A2A]/10 text-[#6B1A2A] border border-[#6B1A2A]/25'
                              : inf.aiScore >= 75
                              ? 'bg-[#C9A84C]/15 text-[#8A6A1F] border border-[#C9A84C]/35'
                              : 'bg-[#7A6860]/10 text-[#7A6860] border border-[#7A6860]/20'
                          }`}
                        >
                          {inf.aiScore}
                        </div>
                        <span className="text-[10px] text-[#7A6860]">/100</span>
                      </div>
                    </td>

                    {/* 6. Recommendation */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          String(inf.recommendation).toLowerCase().includes('high') ||
                          String(inf.recommendation).toLowerCase().includes('exclusive')
                            ? 'bg-[#6B1A2A]/10 text-[#6B1A2A] border border-[#6B1A2A]/25'
                            : String(inf.recommendation).toLowerCase().includes('sponsor') ||
                              String(inf.recommendation).toLowerCase().includes('standard')
                            ? 'bg-[#C9A84C]/20 text-[#8A6A1F] border border-[#C9A84C]/40'
                            : 'bg-[#F2EDE6] text-[#7A6860] border border-[#E2D9D0]'
                        }`}
                      >
                        {inf.recommendation}
                      </span>
                    </td>

                    {/* 7. Status */}
                    <td className="py-3 px-4">
                      <Badge>{inf.status}</Badge>
                    </td>

                    {/* 8. Email */}
                    <td className="py-3 px-4 text-[#7A6860] font-mono text-[11px]">
                      {inf.email}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openProfile(inf)}
                        className="text-xs border-[#E2D9D0] hover:bg-[#F2EDE6]"
                      >
                        View Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* INFLUENCER PROFILE MODAL */}
      {selectedInfluencer && (
        <Modal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          title={selectedInfluencer.name}
          subtitle={`Profile Dossier &bull; Source: Google Sheets CRM via n8n`}
          maxWidth="max-w-2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] font-mono text-[#7A6860]">
                ID: {selectedInfluencer.id}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setProfileModalOpen(false)}
              >
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-5">
            {/* Header info */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#E2D9D0]">
              <div className="flex items-center gap-3">
                <img
                  src={selectedInfluencer.avatar}
                  alt={selectedInfluencer.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-[#C9A84C]/50 shadow-sm"
                />
                <div>
                  <h3 className="text-base font-bold text-[#1C1410]">
                    {selectedInfluencer.name}
                  </h3>
                  <p className="text-xs text-[#7A6860] font-mono">
                    {selectedInfluencer.username}
                  </p>
                  <p className="text-xs text-[#6B1A2A] font-medium mt-0.5">
                    {selectedInfluencer.niche}
                  </p>
                </div>
              </div>

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
            </div>

            {/* Quick Metrics */}
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
                  Status
                </span>
                <div className="mt-1">
                  <Badge size="sm">{selectedInfluencer.status}</Badge>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E2D9D0] sm:col-span-2">
                <span className="text-[10px] uppercase tracking-wider text-[#7A6860] font-semibold">
                  Recommendation
                </span>
                <p className="text-xs font-bold text-[#6B1A2A] mt-1">
                  {selectedInfluencer.recommendation}
                </p>
              </div>
            </div>

            {/* Contact details */}
            <div className="p-4 rounded-xl bg-white border border-[#E2D9D0] space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1410]">
                Contact & Profile Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#7A6860]">Email Address:</span>
                  <p className="font-mono text-[#1C1410] font-semibold mt-0.5">
                    {selectedInfluencer.email}
                  </p>
                </div>
                <div>
                  <span className="text-[#7A6860]">Instagram Profile:</span>
                  <p className="font-mono text-[#6B1A2A] font-semibold mt-0.5">
                    instagram.com/{selectedInfluencer.username.replace('@', '')}
                  </p>
                </div>
              </div>
            </div>

            {/* Raw JSON Data Drawer for transparency with Google Sheets schema */}
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
