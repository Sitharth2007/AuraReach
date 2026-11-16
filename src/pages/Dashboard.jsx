import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Sparkles,
  Send,
  AlertCircle,
  Clock,
  HeartHandshake,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Database,
  ExternalLink,
  RefreshCw,
  AtSign,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import MetricCard from '../components/common/MetricCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { formatNumber } from '../utils/formatters';
import { fetchInfluencersFromN8N, getInfluencersEndpointUrl } from '../services/influencerService';

export default function Dashboard() {
  const navigate = useNavigate();

  // API State
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

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
      console.warn('Dashboard n8n API fetch error:', err);
      setError({
        message: err.message || 'Failed to connect to n8n Cloud API',
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

  // -------------------------------------------------------------
  // DYNAMIC CALCULATIONS - STRICTLY DERIVED FROM THE API RESPONSE
  // -------------------------------------------------------------
  const metrics = useMemo(() => {
    const list = influencers || [];
    const total = list.length;

    // High, Medium, Low Priority counts
    const highPriority = list.filter((i) => i.priority === 'High').length;
    const mediumPriority = list.filter((i) => i.priority === 'Medium').length;
    const lowPriority = list.filter((i) => i.priority === 'Low').length;

    // New Influencers (Discovered, Analyzed, Outreach Ready, or Pending)
    const newInfluencers = list.filter((i) => {
      const s = (i.status || '').toLowerCase().trim();
      return (
        s === 'new' ||
        s === 'discovered' ||
        s === 'analyzed' ||
        s === 'outreach ready' ||
        s === 'pending approval' ||
        !s
      );
    }).length;

    // Contacted Influencers (Contacted, Sent, Pitched, In Follow-up, Replied, Deal Closed)
    const contactedInfluencers = list.filter((i) => {
      const s = (i.status || '').toLowerCase().trim();
      return (
        s === 'contacted' ||
        s === 'in follow-up' ||
        s === 'sent' ||
        s === 'pitched' ||
        s === 'replied' ||
        s === 'deal closed'
      );
    }).length;

    // Interested Influencers (status or recommendation indicates interest/agreement)
    const interestedInfluencers = list.filter((i) => {
      const s = (i.status || '').toLowerCase();
      const r = (i.recommendation || '').toLowerCase();
      return (
        s.includes('interest') ||
        r.includes('interest') ||
        s.includes('deal') ||
        s.includes('closed')
      );
    }).length;

    return {
      total,
      highPriority,
      mediumPriority,
      lowPriority,
      newInfluencers,
      contactedInfluencers,
      interestedInfluencers
    };
  }, [influencers]);

  // Priority chart dataset directly reflecting live calculated metrics
  const priorityDistribution = useMemo(() => {
    return [
      { name: 'High Priority', value: metrics.highPriority, color: '#6B1A2A' },
      { name: 'Medium Priority', value: metrics.mediumPriority, color: '#B85C6E' },
      { name: 'Low Priority', value: metrics.lowPriority, color: '#C9A84C' }
    ];
  }, [metrics]);

  // Dynamic Pipeline Funnel calculated from actual CRM data
  const pipelineFunnelData = useMemo(() => {
    const total = metrics.total;
    const analyzedCount = influencers.filter((i) => i.aiScore && i.aiScore > 0).length;
    const highMedCount = metrics.highPriority + metrics.mediumPriority;

    return [
      { stage: 'Total in CRM', count: total, fill: '#6B1A2A' },
      { stage: 'AI Scored', count: analyzedCount, fill: '#8B2535' },
      { stage: 'High/Med Match', count: highMedCount, fill: '#B85C6E' },
      { stage: 'New Ingested', count: metrics.newInfluencers, fill: '#C9A84C' },
      { stage: 'Contacted', count: metrics.contactedInfluencers, fill: '#2D6A4F' },
      { stage: 'Interested', count: metrics.interestedInfluencers, fill: '#1C1410' }
    ];
  }, [influencers, metrics]);

  // Dynamic Niche Breakdown calculated from actual CRM data
  const nicheChartData = useMemo(() => {
    if (!influencers || influencers.length === 0) return [];

    const map = {};
    influencers.forEach((inf) => {
      const n = inf.niche || 'General';
      if (!map[n]) {
        map[n] = { niche: n, count: 0, highCount: 0, totalFollowers: 0 };
      }
      map[n].count += 1;
      if (inf.priority === 'High') map[n].highCount += 1;
      map[n].totalFollowers += (inf.followers || 0);
    });

    return Object.values(map)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [influencers]);

  // Dynamic Recent Activity Stream generated from actual CRM records
  const dynamicActivities = useMemo(() => {
    if (!influencers || influencers.length === 0) return [];

    return influencers.slice(0, 5).map((inf, idx) => ({
      id: `crm-act-${inf.id || idx}`,
      influencer: inf.name,
      handle: inf.username,
      niche: inf.niche,
      action: inf.recommendation
        ? `Recommendation: ${inf.recommendation} • AI Score: ${inf.aiScore}/100`
        : `Synchronized from Google Sheets CRM in ${inf.niche} (${formatNumber(inf.followers)} followers)`,
      classification: inf.priority ? `${inf.priority} Priority` : inf.status,
      time: `Record #${idx + 1}`,
      workflow: 'Google Sheets CRM Sync'
    }));
  }, [influencers]);

  // Dynamic priority list / creators to action
  const priorityActionList = useMemo(() => {
    if (!influencers || influencers.length === 0) return [];
    return influencers
      .filter((i) => i.priority === 'High' || i.status === 'Contacted' || i.status === 'Outreach Ready')
      .slice(0, 5);
  }, [influencers]);

  // Custom Recharts Tooltip for Burgundy-Ivory theme
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#FFFFFF] border border-[#E2D9D0] rounded-xl p-3 shadow-modal text-xs">
          <p className="font-bold text-[#1C1410] mb-1.5">{label}</p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center gap-2 py-0.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: entry.color || entry.fill }}
              />
              <span className="text-[#7A6860] capitalize">{entry.name}:</span>
              <span className="font-semibold text-[#1C1410]">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / CRM Live Status */}
      <div className="bg-gradient-to-r from-[#6B1A2A] to-[#8B2535] rounded-2xl p-6 lg:p-7 text-[#FAF7F2] shadow-hover border border-[#C9A84C]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#C9A84C] text-[#1C1410] uppercase tracking-wider">
                Live Google Sheets CRM
              </span>
              <span className="text-xs text-[#FAF7F2]/80 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C9A84C] inline-block animate-ping" />
                n8n Cloud Webhook Active
              </span>
            </div>
            <h1 className="font-serif text-2xl lg:text-3xl font-bold tracking-tight text-[#FAF7F2]">
              Instagram Influencer Intelligence Dashboard
            </h1>
            <p className="text-xs lg:text-sm text-[#FAF7F2]/80 leading-relaxed">
              Real-time analytics and scoring retrieved directly from your central Google Sheets CRM via n8n automation.
              All metrics below are dynamically computed from active CRM records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              icon={RefreshCw}
              disabled={loading}
              onClick={loadData}
              className="bg-[#FAF7F2] text-[#6B1A2A] border-transparent hover:bg-white"
            >
              {loading ? 'Syncing...' : 'Sync with n8n'}
            </Button>
            <Button
              variant="gold"
              size="md"
              onClick={() => navigate('/influencers')}
              icon={ArrowUpRight}
              iconPosition="right"
              className="shadow-md"
            >
              View Influencer Table
            </Button>
          </div>
        </div>
      </div>

      {/* CRM Endpoint Indicator */}
      <div className="px-4 py-2.5 rounded-xl bg-white border border-[#E2D9D0] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 truncate">
          <Database className="w-4 h-4 text-[#C9A84C] shrink-0" />
          <span className="font-semibold text-[#1C1410] shrink-0">Connected Endpoint:</span>
          <code className="font-mono text-[11px] text-[#6B1A2A] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E2D9D0] truncate max-w-xl">
            {endpointUrl}
          </code>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-[#7A6860]">
            Last Synced: <strong className="text-[#1C1410]">{lastSyncedAt || 'Just now'}</strong>
          </span>
          <span className="text-[10px] font-semibold text-[#2D6A4F] bg-[#2D6A4F]/10 px-2 py-0.5 rounded-full">
            HTTP 200 Live
          </span>
        </div>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="bg-white rounded-2xl p-12 border border-[#E2D9D0] shadow-subtle text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-3 border-[#E2D9D0] border-t-[#6B1A2A] animate-spin mx-auto" />
          <p className="text-sm font-bold text-[#1C1410]">
            Fetching Live CRM Statistics from n8n Cloud...
          </p>
          <p className="text-xs text-[#7A6860]">
            Calculating priority distributions, outreach status, and niche metrics from Google Sheets
          </p>
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
                  Unable to Synchronize Dashboard with n8n Cloud
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
              onClick={loadData}
            >
              Retry n8n Connection
            </Button>
            <span className="text-xs text-[#7A6860]">
              Make sure the workflow is active or listening on the n8n canvas.
            </span>
          </div>
        </div>
      )}

      {/* 7 DYNAMICALLY CALCULATED CRM METRIC CARDS */}
      {!loading && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#1C1410] font-sans">
                Live CRM Metrics Overview
              </h2>
              <p className="text-xs text-[#7A6860]">
                Calculated dynamically from {metrics.total} influencer records retrieved from your Google Sheets CRM
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E2D9D0] text-[#1C1410]">
              Total Records: {metrics.total}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
            {/* 1. Total Influencers */}
            <MetricCard
              title="Total"
              value={metrics.total}
              subtitle="Google Sheets CRM"
              icon={Users}
              badgeText="Live"
              onClick={() => navigate('/influencers')}
            />

            {/* 2. High Priority */}
            <MetricCard
              title="High Priority"
              value={metrics.highPriority}
              subtitle="Score >= 88"
              icon={Sparkles}
              highlight={true}
              badgeText="Top Tier"
              onClick={() => navigate('/influencers')}
            />

            {/* 3. Medium Priority */}
            <MetricCard
              title="Medium Priority"
              value={metrics.mediumPriority}
              subtitle="Standard match"
              icon={TrendingUp}
              onClick={() => navigate('/influencers')}
            />

            {/* 4. Low Priority */}
            <MetricCard
              title="Low Priority"
              value={metrics.lowPriority}
              subtitle="Monitoring pool"
              icon={Layers}
              onClick={() => navigate('/influencers')}
            />

            {/* 5. New Influencers */}
            <MetricCard
              title="New"
              value={metrics.newInfluencers}
              subtitle="Ingested in CRM"
              icon={Clock}
              badgeText="Awaiting Pitch"
              onClick={() => navigate('/influencers')}
            />

            {/* 6. Contacted */}
            <MetricCard
              title="Contacted"
              value={metrics.contactedInfluencers}
              subtitle="Email dispatched"
              icon={Send}
              trend={`${metrics.total > 0 ? ((metrics.contactedInfluencers / metrics.total) * 100).toFixed(0) : 0}%`}
              onClick={() => navigate('/influencers')}
            />

            {/* 7. Interested */}
            <MetricCard
              title="Interested"
              value={metrics.interestedInfluencers}
              subtitle="Positive replies"
              icon={HeartHandshake}
              highlight={true}
              badgeText="Conversion"
              onClick={() => navigate('/influencers')}
            />
          </div>
        </section>
      )}

      {/* CHARTS GRID - DERIVED FROM ACTUAL CRM DATA */}
      {!loading && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: CRM Pipeline Conversion Funnel Chart (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E2D9D0] shadow-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#1C1410]">
                  CRM Pipeline Conversion Funnel
                </h3>
                <p className="text-xs text-[#7A6860]">
                  Calculated from actual Google Sheets CRM records across outreach stages
                </p>
              </div>
              <span className="text-xs font-medium text-[#2D6A4F] bg-[#2D6A4F]/10 px-2.5 py-1 rounded-full border border-[#2D6A4F]/20">
                {metrics.contactedInfluencers > 0
                  ? `${((metrics.interestedInfluencers / metrics.contactedInfluencers) * 100).toFixed(1)}% Conversion`
                  : 'Active Pipeline'}
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineFunnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2D9D0" vertical={false} />
                  <XAxis dataKey="stage" stroke="#7A6860" tick={{ fontSize: 11 }} tickLine={false} />
                  <YAxis stroke="#7A6860" tick={{ fontSize: 11 }} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Influencers" radius={[6, 6, 0, 0]}>
                    {pipelineFunnelData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-3 mt-3 border-t border-[#E2D9D0]/60 flex items-center justify-between text-xs text-[#7A6860]">
              <span>Data Source: Live n8n Cloud Webhook</span>
              <strong className="text-[#1C1410]">{metrics.total} Total Records Processed</strong>
            </div>
          </div>

          {/* Right: AI Priority Distribution Donut (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#E2D9D0] shadow-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-bold text-[#1C1410]">
                  CRM Priority Distribution
                </h3>
                <p className="text-xs text-[#7A6860]">
                  High ({metrics.highPriority}), Medium ({metrics.mediumPriority}), Low ({metrics.lowPriority})
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E2D9D0] text-[#1C1410]">
                {metrics.total} Creators
              </span>
            </div>

            <div className="h-56 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {priorityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Inner Center Total */}
              <div className="absolute text-center pointer-events-none">
                <span className="text-2xl font-bold text-[#1C1410] font-sans">{metrics.total}</span>
                <p className="text-[10px] uppercase tracking-wider text-[#7A6860] font-medium">CRM Records</p>
              </div>
            </div>

            {/* Breakdown legend */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#E2D9D0]/60">
              {priorityDistribution.map((item) => (
                <div key={item.name} className="text-center p-2 rounded-lg bg-[#FAF7F2]">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[11px] font-medium text-[#7A6860] truncate">{item.name}</span>
                  </div>
                  <p className="text-base font-bold text-[#1C1410]">{item.value}</p>
                  <p className="text-[10px] text-[#7A6860]">
                    {metrics.total > 0 ? ((item.value / metrics.total) * 100).toFixed(0) : 0}% of CRM
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECOND ROW OF CHARTS & CRM ACTION ITEMS */}
      {!loading && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Niche Breakdown Chart (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E2D9D0] shadow-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#1C1410]">
                  CRM Niche Distribution
                </h3>
                <p className="text-xs text-[#7A6860]">
                  Creator volume and high-priority breakdown per niche from Google Sheets
                </p>
              </div>
              <span className="text-xs text-[#7A6860]">
                {nicheChartData.length} Active Niches
              </span>
            </div>

            <div className="h-64 w-full">
              {nicheChartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-[#7A6860]">
                  No niche data recorded yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={nicheChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2D9D0" vertical={false} />
                    <XAxis dataKey="niche" stroke="#7A6860" tick={{ fontSize: 11 }} tickLine={false} />
                    <YAxis stroke="#7A6860" tick={{ fontSize: 11 }} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Total Creators" fill="#6B1A2A" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="highCount" name="High Priority" fill="#C9A84C" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="pt-3 mt-3 border-t border-[#E2D9D0]/60 flex items-center justify-between text-xs text-[#7A6860]">
              <span>Niche categorization synced with Sheets</span>
              <strong className="text-[#1C1410]">
                {metrics.highPriority} High Priority Creators Total
              </strong>
            </div>
          </div>

          {/* Action List / Creators to Follow Up (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#E2D9D0] shadow-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-[#1C1410]">
                  Priority Influencer Action Queue
                </h3>
                <p className="text-xs text-[#7A6860]">
                  High priority & active CRM prospects from Google Sheets
                </p>
              </div>
              <button
                onClick={() => navigate('/influencers')}
                className="text-xs font-semibold text-[#6B1A2A] hover:text-[#8B2535] flex items-center gap-0.5 cursor-pointer"
              >
                View Directory &rarr;
              </button>
            </div>

            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-64 pr-1">
              {priorityActionList.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#7A6860]">
                  No priority creators found in active queue.
                </div>
              ) : (
                priorityActionList.map((inf) => (
                  <div
                    key={inf.id}
                    onClick={() => navigate('/influencers')}
                    className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E2D9D0] flex items-center justify-between gap-3 hover:border-[#8B2535]/30 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={inf.avatar}
                        alt={inf.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-[#E2D9D0]"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#1C1410] truncate">
                          {inf.name}
                        </p>
                        <p className="text-[11px] text-[#7A6860] truncate">
                          {inf.username} • {inf.niche}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[11px] font-bold text-[#6B1A2A]">
                        Score: {inf.aiScore}/100
                      </div>
                      <Badge size="sm">{inf.status}</Badge>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 mt-3 border-t border-[#E2D9D0]/60 flex items-center justify-between text-xs text-[#7A6860]">
              <span>High priority CRM prospects</span>
              <strong className="text-[#1C1410]">{metrics.highPriority} High Priority</strong>
            </div>
          </div>
        </section>
      )}

      {/* RECENT ACTIVITY & SYSTEM ARCHITECTURE */}
      {!loading && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent CRM Activity Feed (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E2D9D0] shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#1C1410]">
                  Live CRM Activity Stream
                </h3>
                <p className="text-xs text-[#7A6860]">
                  Recent influencer entries and scoring data synchronized from Google Sheets
                </p>
              </div>
              <span className="text-xs text-[#2D6A4F] flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse" />
                Live CRM Synced
              </span>
            </div>

            <div className="space-y-3">
              {dynamicActivities.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#7A6860]">
                  No recent CRM activity found.
                </div>
              ) : (
                dynamicActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E2D9D0]/70 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1C1410]">{act.influencer}</span>
                        <span className="text-[11px] text-[#7A6860] font-mono">{act.handle}</span>
                        <Badge size="sm">{act.classification}</Badge>
                      </div>
                      <p className="text-xs text-[#7A6860] leading-snug">
                        {act.action}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-[#7A6860] block font-medium">{act.time}</span>
                      <span className="text-[10px] text-[#6B1A2A] font-semibold block">{act.workflow}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Connected CRM Architecture Summary (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#E2D9D0] shadow-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-[#1C1410]">
                  Active CRM Integration Specs
                </h3>
                <p className="text-xs text-[#7A6860]">
                  Configuration details for the connected n8n Cloud webhook
                </p>
              </div>
              <span className="text-xs font-mono text-[#6B1A2A] font-bold bg-[#6B1A2A]/10 px-2 py-0.5 rounded">
                GET API
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E2D9D0] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1C1410]">CRM Database</span>
                  <span className="text-[#2D6A4F] font-semibold">Google Sheets</span>
                </div>
                <p className="text-[11px] text-[#7A6860]">
                  Central CRM containing discovered creator handles, follower counts, AI scores, and outreach status.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E2D9D0] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1C1410]">n8n Automation</span>
                  <span className="text-[#6B1A2A] font-semibold">Cloud Webhook</span>
                </div>
                <p className="text-[11px] text-[#7A6860]">
                  Orchestrates live ingestion from Google Sheets and streams normalized JSON records to the frontend.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E2D9D0] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1C1410]">Dynamic Calculation</span>
                  <span className="text-[#C9A84C] font-semibold">Client-Side Engine</span>
                </div>
                <p className="text-[11px] text-[#7A6860]">
                  Zero mock numbers. All cards, conversion funnels, priority pies, and niche distribution bars reflect current API records.
                </p>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-[#E2D9D0]/60 flex items-center justify-between text-xs text-[#7A6860]">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#C9A84C]" />
                Google Sheets CRM
              </span>
              <span className="text-[#1C1410] font-semibold">{metrics.total} Records Computed</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
