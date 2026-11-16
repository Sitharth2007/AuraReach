import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Influencers from './pages/Influencers';
import AIAnalysis from './pages/AIAnalysis';
import EmailOutreach from './pages/EmailOutreach';
import Followups from './pages/Followups';
import ReplyManagement from './pages/ReplyManagement';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/influencers" element={<Influencers />} />
            <Route path="/ai-analysis" element={<AIAnalysis />} />
            <Route path="/email-outreach" element={<EmailOutreach />} />
            <Route path="/follow-ups" element={<Followups />} />
            <Route path="/reply-management" element={<ReplyManagement />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
