import React from 'react';
import { Database, Mail, Sparkles, Workflow, Shield, Clock, Globe, Server, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/common/Badge';

export default function Settings() {
  const { n8nWorkflows, triggerResearchSync } = useApp();

  const integrations = [
    { name: 'Google Sheets CRM', description: 'Central influencer database, scoring results, and outreach logs', icon: Database, status: 'Connected', account: 'outreach@aurareach.studio' },
    { name: 'Gmail API', description: 'Automated email dispatch, reply detection, and follow-up sequences', icon: Mail, status: 'Connected', account: 'outreach@aurareach.studio' },
    { name: 'Gemini 2.0 Flash', description: 'Multi-modal AI analysis, influencer scoring, and email personalization', icon: Sparkles, status: 'Active', account: 'API Key ••••••4x9Q' },
    { name: 'n8n Automation Server', description: 'Self-hosted workflow orchestration engine running 6 production workflows', icon: Workflow, status: 'Running', account: 'https://n8n.aurareach.internal' },
    { name: 'Instagram Graph API', description: 'Profile discovery, follower metrics, and engagement data ingestion', icon: Globe, status: 'Connected', account: 'Business Account Linked' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold font-sans text-[#1C1410] tracking-tight">System Settings & Integrations</h1>
        <p className="text-xs text-[#7A6860]">Backend service connections, n8n workflow configuration, and platform health</p>
      </div>

      {/* Connected Services */}
      <section>
        <h2 className="text-sm font-bold text-[#1C1410] mb-4">Connected Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((svc) => (
            <div key={svc.name} className="bg-white rounded-2xl p-5 border border-[#E2D9D0] shadow-subtle flex items-start gap-4 hover:shadow-hover hover:border-[#B85C6E]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#6B1A2A]/8 text-[#6B1A2A] flex items-center justify-center shrink-0">
                <svc.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#1C1410]">{svc.name}</h3>
                  <span className="text-[10px] font-bold text-[#2D6A4F] bg-[#2D6A4F]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {svc.status}
                  </span>
                </div>
                <p className="text-xs text-[#7A6860] mt-1 leading-snug">{svc.description}</p>
                <p className="text-[11px] text-[#1C1410] font-mono mt-2 bg-[#FAF7F2] px-2 py-1 rounded border border-[#E2D9D0] inline-block">{svc.account}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* n8n Workflows */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[#1C1410]">n8n Workflow Architecture</h2>
          <span className="text-xs font-mono text-[#6B1A2A] font-bold bg-[#6B1A2A]/10 px-2 py-0.5 rounded">6 Active Workflows</span>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2D9D0] shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#E2D9D0] text-[#7A6860] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Workflow Name</th>
                  <th className="py-3 px-4">Trigger</th>
                  <th className="py-3 px-4">Integration</th>
                  <th className="py-3 px-4">Processed</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Run</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D9D0]/60">
                {n8nWorkflows.map(wf => (
                  <tr key={wf.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3 px-4"><span className="w-6 h-6 rounded-full bg-[#6B1A2A] text-[#FAF7F2] flex items-center justify-center font-bold text-[10px]">{wf.id}</span></td>
                    <td className="py-3 px-4 font-bold text-[#1C1410]">{wf.name}</td>
                    <td className="py-3 px-4 text-[#7A6860] font-mono text-[11px]">{wf.trigger}</td>
                    <td className="py-3 px-4 text-[#7A6860]">{wf.integration}</td>
                    <td className="py-3 px-4 font-bold text-[#1C1410]">{wf.processedCount}</td>
                    <td className="py-3 px-4"><Badge variant="success">{wf.status}</Badge></td>
                    <td className="py-3 px-4 text-[#7A6860]">{wf.lastRun}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* System Info */}
      <section className="bg-white rounded-2xl p-6 border border-[#E2D9D0] shadow-subtle">
        <h2 className="text-sm font-bold text-[#1C1410] mb-4">Platform Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E2D9D0]">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A6860]">Application</span>
            <p className="font-bold text-[#1C1410] mt-1">AuraReach v1.0</p>
            <p className="text-[11px] text-[#7A6860]">AI Influencer Intelligence Platform</p>
          </div>
          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E2D9D0]">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A6860]">Frontend Stack</span>
            <p className="font-bold text-[#1C1410] mt-1">React + Vite + Tailwind</p>
            <p className="text-[11px] text-[#7A6860]">Recharts · Lucide Icons · React Router</p>
          </div>
          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E2D9D0]">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A6860]">Backend Engine</span>
            <p className="font-bold text-[#1C1410] mt-1">n8n Self-Hosted</p>
            <p className="text-[11px] text-[#7A6860]">6 Automated Production Workflows</p>
          </div>
          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E2D9D0]">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A6860]">AI Model</span>
            <p className="font-bold text-[#1C1410] mt-1">Gemini 2.0 Flash</p>
            <p className="text-[11px] text-[#7A6860]">Multi-Modal Analysis & Generation</p>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <div className="text-center py-4">
        <p className="text-[11px] text-[#7A6860]">
          This frontend operates with mock data. Connect to the live n8n backend by configuring the API integration layer in <code className="text-[#6B1A2A] font-mono bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#E2D9D0]">src/services/</code>
        </p>
      </div>
    </div>
  );
}
