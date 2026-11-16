import React, { createContext, useContext, useState, useMemo } from 'react';
import { initialInfluencers, calculateMetrics, recentActivities, n8nWorkflows } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [influencers, setInfluencers] = useState(initialInfluencers);
  const [activities, setActivities] = useState(recentActivities);
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedInfluencerId, setSelectedInfluencerId] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [notification, setNotification] = useState(null);

  // Compute live metrics dynamically from the influencers list
  const metrics = useMemo(() => calculateMetrics(influencers), [influencers]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(prev => (prev?.id ? null : prev));
    }, 4000);
  };

  const closeNotification = () => setNotification(null);

  // Email Actions
  const approveEmail = (id) => {
    setInfluencers(prev => prev.map(inf => {
      if (inf.id === id) {
        return {
          ...inf,
          status: 'Contacted',
          outreach: {
            ...inf.outreach,
            status: 'Sent',
            sentDate: new Date().toISOString().split('T')[0]
          },
          followup: {
            ...inf.followup,
            status: 'Scheduled',
            nextFollowupDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        };
      }
      return inf;
    }));

    const target = influencers.find(i => i.id === id);
    if (target) {
      setActivities(prev => [
        {
          id: `act-${Date.now()}`,
          type: 'outreach',
          influencer: target.name,
          handle: target.username,
          action: 'Email approved and dispatched via Gmail API',
          classification: 'Sent',
          time: 'Just now',
          workflow: 'Workflow 4: Email Sending'
        },
        ...prev
      ]);
      showNotification(`Email to ${target.name} approved & dispatched via Gmail automation.`);
    }
  };

  const approveAllPending = () => {
    const pendingCount = influencers.filter(i => i.outreach.status === 'Pending Approval').length;
    if (pendingCount === 0) return;

    setInfluencers(prev => prev.map(inf => {
      if (inf.outreach.status === 'Pending Approval') {
        return {
          ...inf,
          status: 'Contacted',
          outreach: {
            ...inf.outreach,
            status: 'Sent',
            sentDate: new Date().toISOString().split('T')[0]
          },
          followup: {
            ...inf.followup,
            status: 'Scheduled',
            nextFollowupDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        };
      }
      return inf;
    }));

    setActivities(prev => [
      {
        id: `act-${Date.now()}`,
        type: 'outreach',
        influencer: 'Batch Approval',
        handle: `@${pendingCount}_creators`,
        action: `Batch approved ${pendingCount} outreach emails`,
        classification: 'Batch Dispatched',
        time: 'Just now',
        workflow: 'Workflow 4: Email Sending'
      },
      ...prev
    ]);

    showNotification(`Batch approved and queued all ${pendingCount} pending emails.`);
  };

  const editEmail = (id, newSubject, newBody) => {
    setInfluencers(prev => prev.map(inf => {
      if (inf.id === id) {
        return {
          ...inf,
          outreach: {
            ...inf.outreach,
            subject: newSubject,
            body: newBody
          }
        };
      }
      return inf;
    }));
    showNotification('Email draft updated successfully.');
  };

  const rejectEmail = (id, reason) => {
    setInfluencers(prev => prev.map(inf => {
      if (inf.id === id) {
        return {
          ...inf,
          status: 'Analyzed',
          outreach: {
            ...inf.outreach,
            status: 'Draft',
            rejectionReason: reason || 'Revision requested'
          }
        };
      }
      return inf;
    }));
    showNotification('Draft marked for AI re-generation.');
  };

  // Follow-up Actions
  const sendFollowupNow = (id) => {
    setInfluencers(prev => prev.map(inf => {
      if (inf.id === id) {
        const nextStep = (inf.followup.sequenceStep || 0) + 1;
        return {
          ...inf,
          status: 'In Follow-up',
          followup: {
            ...inf.followup,
            sequenceStep: nextStep,
            lastContactDate: new Date().toISOString().split('T')[0],
            nextFollowupDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: nextStep >= 3 ? 'Completed' : 'Scheduled',
            history: [
              ...(inf.followup.history || []),
              {
                step: nextStep,
                date: new Date().toISOString().split('T')[0],
                type: `Follow-up #${nextStep}`,
                note: 'Manually triggered follow-up sequence via n8n'
              }
            ]
          }
        };
      }
      return inf;
    }));

    const target = influencers.find(i => i.id === id);
    if (target) {
      showNotification(`Follow-up sent to ${target.name}.`);
    }
  };

  const pauseFollowup = (id) => {
    setInfluencers(prev => prev.map(inf => {
      if (inf.id === id) {
        return {
          ...inf,
          followup: {
            ...inf.followup,
            status: 'Paused - Replied'
          }
        };
      }
      return inf;
    }));
    showNotification('Follow-up sequence paused.');
  };

  // Reply Actions
  const sendReplyResponse = (id, customText) => {
    setInfluencers(prev => prev.map(inf => {
      if (inf.id === id && inf.reply) {
        return {
          ...inf,
          status: 'Deal Closed',
          reply: {
            ...inf.reply,
            status: 'Handled',
            aiDraftResponse: customText || inf.reply.aiDraftResponse
          }
        };
      }
      return inf;
    }));

    const target = influencers.find(i => i.id === id);
    if (target) {
      showNotification(`Response sent to ${target.name}. Conversation marked Handled.`);
    }
  };

  // AI Re-analysis simulation
  const reanalyzeInfluencer = (id) => {
    setInfluencers(prev => prev.map(inf => {
      if (inf.id === id) {
        const adjustedScore = Math.min(99, Math.max(70, inf.aiScore + 1));
        return {
          ...inf,
          aiScore: adjustedScore,
          aiAnalysis: {
            ...inf.aiAnalysis,
            summary: `${inf.aiAnalysis.summary} Re-verified with Gemini 2.0 multi-modal scan.`,
            brandSafety: 99
          }
        };
      }
      return inf;
    }));
    showNotification('Gemini 2.0 completed profile re-scoring.');
  };

  // Sync simulation (Workflow 1 trigger)
  const triggerResearchSync = () => {
    showNotification('Workflow 1: Synchronizing with Instagram API & Google Sheets CRM...', 'info');
    setTimeout(() => {
      showNotification('CRM Synchronized: 150 creators up to date.', 'success');
    }, 1500);
  };

  const selectedInfluencer = useMemo(() => {
    return influencers.find(i => i.id === selectedInfluencerId) || null;
  }, [influencers, selectedInfluencerId]);

  return (
    <AppContext.Provider
      value={{
        influencers,
        metrics,
        activities,
        n8nWorkflows,
        globalSearch,
        setGlobalSearch,
        selectedInfluencerId,
        setSelectedInfluencerId,
        selectedInfluencer,
        activeTab,
        setActiveTab,
        approveEmail,
        approveAllPending,
        editEmail,
        rejectEmail,
        sendFollowupNow,
        pauseFollowup,
        sendReplyResponse,
        reanalyzeInfluencer,
        triggerResearchSync,
        notification,
        closeNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
