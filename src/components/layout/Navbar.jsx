import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  RefreshCw,
  Menu,
  ChevronRight,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../common/Button';

export default function Navbar({ setMobileOpen }) {
  const location = useLocation();
  const {
    globalSearch,
    setGlobalSearch,
    activities,
    triggerResearchSync,
    metrics
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Map route to title and breadcrumb
  const pageTitles = {
    '/': { title: 'Executive Dashboard', category: 'Overview' },
    '/influencers': { title: 'Influencer Management', category: 'Discovery & CRM' },
    '/ai-analysis': { title: 'AI Scoring & Analysis', category: 'Intelligence' },
    '/email-outreach': { title: 'Email Outreach Studio', category: 'Campaigns' },
    '/follow-ups': { title: 'Automated Follow-ups', category: 'Sequences' },
    '/reply-management': { title: 'AI Reply Management', category: 'Inbox' },
    '/settings': { title: 'System Settings', category: 'Configuration' }
  };

  const current = pageTitles[location.pathname] || { title: 'Overview', category: 'Portal' };

  return (
    <header className="sticky top-0 z-20 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E2D9D0] px-4 lg:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 text-[#7A6860] hover:text-[#1C1410] rounded-lg hover:bg-[#F2EDE6]"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#7A6860]">
              <span className="hover:text-[#6B1A2A] transition-colors">{current.category}</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#E2D9D0]" />
              <span className="font-medium text-[#1C1410]">{current.title}</span>
            </div>
            <h2 className="text-lg lg:text-xl font-bold font-sans text-[#1C1410] tracking-tight">
              {current.title}
            </h2>
          </div>
        </div>

        {/* Right: Search, n8n Sync, Notifications, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Global Search Bar */}
          <div className="relative hidden md:block w-56 lg:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6860]" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search creators, niches, emails..."
              className="w-full bg-[#FFFFFF] border border-[#E2D9D0] rounded-lg pl-9 pr-3.5 py-1.5 text-xs text-[#1C1410] placeholder:text-[#7A6860]/70 focus:outline-none focus:ring-1 focus:ring-[#8B2535] focus:border-[#8B2535] transition-all shadow-subtle"
            />
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#7A6860] hover:text-[#1C1410]"
              >
                ×
              </button>
            )}
          </div>

          {/* Sync n8n action button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={triggerResearchSync}
            icon={RefreshCw}
            className="hidden sm:inline-flex text-xs border-[#E2D9D0] hover:border-[#8B2535]/30 text-[#1C1410]"
          >
            Sync CRM
          </Button>

          {/* Notification Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileOpen(false);
              }}
              className="relative p-2 rounded-lg bg-white border border-[#E2D9D0] text-[#7A6860] hover:text-[#6B1A2A] hover:bg-[#F2EDE6] transition-colors cursor-pointer shadow-subtle"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C9A84C] ring-2 ring-white" />
            </button>

            {notificationsOpen && (
              <div
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FFFFFF] border border-[#E2D9D0] rounded-xl shadow-modal overflow-hidden z-40 animate-in fade-in duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-3 bg-[#FAF7F2] border-b border-[#E2D9D0] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                    <span className="text-xs font-bold text-[#1C1410]">Recent System Activity</span>
                  </div>
                  <span className="text-[10px] text-[#7A6860] font-medium bg-[#F2EDE6] px-2 py-0.5 rounded-full">
                    n8n Event Stream
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#E2D9D0]/60">
                  {activities.map((act) => (
                    <div key={act.id} className="p-3 hover:bg-[#FAF7F2] transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-[#1C1410]">
                          {act.influencer}
                        </p>
                        <span className="text-[10px] text-[#7A6860] shrink-0 font-medium">
                          {act.time}
                        </span>
                      </div>
                      <p className="text-xs text-[#7A6860] mt-0.5 leading-snug">
                        {act.action}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[10px] text-[#8B2535] font-mono">
                          {act.workflow}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-[#FAF7F2] border-t border-[#E2D9D0] text-center">
                  <Link
                    to="/reply-management"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-xs font-semibold text-[#6B1A2A] hover:text-[#8B2535]"
                  >
                    View All {metrics.interestedInfluencers} Interested Responses &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2.5 pl-2 pr-1.5 py-1 rounded-lg hover:bg-white/70 transition-colors cursor-pointer border border-transparent hover:border-[#E2D9D0]"
            >
              <div className="w-8 h-8 rounded-full bg-[#6B1A2A] text-[#FAF7F2] flex items-center justify-center font-bold text-xs ring-2 ring-[#C9A84C]/50">
                SC
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-[#1C1410] leading-tight">Sarah Chen</p>
                <p className="text-[10px] text-[#7A6860] font-medium">Campaign Director</p>
              </div>
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white border border-[#E2D9D0] rounded-xl shadow-modal overflow-hidden z-40 p-2 animate-in fade-in duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-2 border-b border-[#E2D9D0]/70 mb-1">
                  <p className="text-xs font-bold text-[#1C1410]">Sarah Chen</p>
                  <p className="text-[11px] text-[#7A6860]">outreach@aurareach.studio</p>
                </div>
                <div className="space-y-0.5 text-xs text-[#1C1410]">
                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="block px-3 py-1.5 rounded-lg hover:bg-[#FAF7F2] text-[#1C1410]"
                  >
                    System Settings
                  </Link>
                  <div className="px-3 py-1.5 text-xs text-[#7A6860] flex items-center justify-between">
                    <span>n8n Webhook</span>
                    <span className="text-[10px] text-[#2D6A4F] font-bold">200 OK</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
