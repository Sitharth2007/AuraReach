import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Sparkles,
  Send,
  Clock,
  MessageSquare,
  Settings,
  ChevronRight,
  Database,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { metrics } = useApp();

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/influencers',
      label: 'Influencers',
      icon: Users,
      badge: `${metrics.total}`
    },
    {
      to: '/ai-analysis',
      label: 'AI Analysis',
      icon: Sparkles,
      badge: `${metrics.highPriority} High`
    },
    {
      to: '/email-outreach',
      label: 'Email Outreach',
      icon: Send,
      badge: metrics.pendingApprovals > 0 ? `${metrics.pendingApprovals} Pending` : null,
      badgeHighlight: metrics.pendingApprovals > 0
    },
    {
      to: '/follow-ups',
      label: 'Follow-ups',
      icon: Clock,
      badge: `${metrics.followupsSent}`
    },
    {
      to: '/reply-management',
      label: 'Reply Management',
      icon: MessageSquare,
      badge: `${metrics.interestedInfluencers} Interested`,
      badgeGold: true
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#6B1A2A] text-[#FAF7F2] border-r border-[#8B2535]">
      {/* Brand Header */}
      <div className="px-6 py-5 border-b border-[#8B2535]/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8B2535] border border-[#C9A84C]/40 flex items-center justify-center shadow-sm">
            <span className="font-serif text-lg font-bold text-[#C9A84C] tracking-wider">A</span>
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold tracking-tight text-[#FAF7F2] leading-tight">
              AuraReach
            </h1>
            <p className="text-[11px] font-medium text-[#FAF7F2]/60 tracking-wider uppercase">
              AI Influencer CRM
            </p>
          </div>
        </div>
      </div>

      {/* Backend Engine Status Indicator */}
      <div className="px-5 py-3 mx-4 mt-4 rounded-lg bg-[#4E111E]/70 border border-[#8B2535] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
          <span className="text-[11px] font-medium text-[#FAF7F2]/80">
            6 n8n Workflows
          </span>
        </div>
        <span className="text-[10px] uppercase font-semibold tracking-wider text-[#C9A84C]">
          Live Sync
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider uppercase text-[#FAF7F2]/50">
          Core Modules
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={() => setMobileOpen && setMobileOpen(false)}
            className={({ isActive }) =>
              `group flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#8B2535] text-[#FAF7F2] shadow-sm font-semibold border-l-4 border-[#C9A84C]'
                  : 'text-[#FAF7F2]/80 hover:bg-[#8B2535]/50 hover:text-[#FAF7F2]'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4 text-[#FAF7F2]/75 group-hover:text-[#FAF7F2] shrink-0" />
              <span>{item.label}</span>
            </div>

            {item.badge && (
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 transition-colors ${
                  item.badgeHighlight
                    ? 'bg-[#B85C6E] text-white font-bold'
                    : item.badgeGold
                    ? 'bg-[#C9A84C] text-[#1C1410] font-semibold'
                    : 'bg-[#4E111E] text-[#FAF7F2]/80'
                }`}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* System Stack Pill */}
      <div className="p-4 border-t border-[#8B2535]/80 bg-[#4E111E]/40 text-xs text-[#FAF7F2]/70 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 text-[#FAF7F2]/80">
            <Database className="w-3.5 h-3.5 text-[#C9A84C]" />
            Sheets CRM
          </span>
          <span className="text-[#2D6A4F] bg-[#2D6A4F]/20 px-1.5 py-0.5 rounded text-[10px] font-medium">
            Active
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 text-[#FAF7F2]/80">
            <Layers className="w-3.5 h-3.5 text-[#C9A84C]" />
            Gemini 2.0 Flash
          </span>
          <span className="text-[#C9A84C] text-[10px] font-mono">
            Ready
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block w-64 h-screen fixed inset-y-0 left-0 z-30">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#1C1410]/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 max-w-xs h-full z-10 shadow-xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
