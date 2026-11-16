// Influencer Service - Communication with n8n Cloud Google Sheets CRM API
import { apiGet, apiPost } from './api';

const DEFAULT_N8N_GET_URL = 'https://sitharth07.app.n8n.cloud/webhook-test/api/influencers';
const DEFAULT_N8N_GENERATE_URL = '/n8n/webhook/api/generate-outreach';

/**
 * Get configured n8n GET API endpoint URL from environment variable
 */
export function getInfluencersEndpointUrl() {
  return import.meta.env.VITE_N8N_INFLUENCERS_URL || DEFAULT_N8N_GET_URL;
}

/**
 * Get configured n8n POST API endpoint URL for Workflow 3 (Generate Outreach Email)
 */
export function getGenerateOutreachEndpointUrl() {
  return import.meta.env.VITE_N8N_GENERATE_OUTREACH_URL || DEFAULT_N8N_GENERATE_URL;
}

/**
 * Normalizes a raw influencer item from Google Sheets / n8n into a consistent frontend model.
 * Handles diverse column casing (e.g. "AI Score", "ai_score", "Score", "Recommendation", etc.)
 */
export function normalizeInfluencerRecord(raw, index = 0) {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  // Handle n8n item wrapper if present (item.json or bare object)
  const item = raw.json || raw;

  // Helper for flexible case-insensitive lookup
  const getField = (...keys) => {
    for (const key of keys) {
      if (item[key] !== undefined && item[key] !== null && item[key] !== '') {
        return item[key];
      }
      // Try lowercase matching ignoring spaces, underscores, and dashes
      const cleanTarget = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      const foundKey = Object.keys(item).find(
        (k) => k.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanTarget
      );
      if (foundKey && item[foundKey] !== undefined && item[foundKey] !== null && item[foundKey] !== '') {
        return item[foundKey];
      }
    }
    return '';
  };

  // Influencer ID from sheet
  const influencer_id =
    getField('influencer_id', 'Influencer ID', 'influencerId', 'id', 'ID', 'Row Number', 'row') ||
    `inf-n8n-${index + 1}`;

  const name =
    getField('Influencer Name', 'Name', 'Full Name', 'influencer_name', 'creator') ||
    `Creator #${index + 1}`;

  let username =
    getField('Instagram Username', 'Username', 'Instagram', 'Handle', 'IG', 'handle') || '';
  if (username && !username.startsWith('@')) {
    username = `@${username}`;
  } else if (!username) {
    username = `@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  }

  const niche = getField('Niche', 'Category', 'Industry', 'niche') || 'General Lifestyle';
  const email = getField('Email Address', 'Email', 'Contact Email', 'Mail', 'email') || 'N/A';

  // Parse followers (handles "120k", "1.2M", 120000, "54,000")
  let followersRaw = getField('Followers', 'Follower Count', 'Audience', 'followers');
  let followers = 0;
  if (typeof followersRaw === 'number') {
    followers = followersRaw;
  } else if (typeof followersRaw === 'string') {
    const cleanStr = followersRaw.trim().toUpperCase();
    if (cleanStr.endsWith('M')) {
      followers = Math.round(parseFloat(cleanStr.replace('M', '')) * 1000000);
    } else if (cleanStr.endsWith('K')) {
      followers = Math.round(parseFloat(cleanStr.replace('K', '')) * 1000);
    } else {
      const parsed = parseInt(cleanStr.replace(/[^0-9]/g, ''), 10);
      followers = isNaN(parsed) ? 0 : parsed;
    }
  }

  // Parse AI Score (0-100)
  let aiScoreRaw = getField('AI Score', 'ai_score', 'Score', 'AIScore', 'Rating');
  let aiScore = 0;
  if (typeof aiScoreRaw === 'number') {
    aiScore = aiScoreRaw;
  } else if (typeof aiScoreRaw === 'string') {
    const parsed = parseInt(aiScoreRaw.replace(/[^0-9]/g, ''), 10);
    aiScore = isNaN(parsed) ? 80 : parsed;
  } else {
    aiScore = 75;
  }

  // AI Summary
  const aiSummary =
    getField(
      'AI Summary',
      'ai_summary',
      'Summary',
      'summary',
      'AI Analysis Summary',
      'Analysis',
      'Profile Summary'
    ) || `Audience and content aesthetic in ${niche} align with target campaign benchmarks.`;

  // AI Reason
  const aiReason =
    getField(
      'AI Reason',
      'ai_reason',
      'Reason',
      'reason',
      'Reasoning',
      'ai_reasoning',
      'Scoring Reason',
      'AI Reasoning',
      'Why'
    ) || `Engagement authenticity and content quality match expected niche standards.`;

  // Recommendation
  const recommendation =
    getField(
      'Recommendation',
      'recommendation',
      'AI Recommendation',
      'Priority Recommendation',
      'Suggested Collab',
      'Action'
    ) || (aiScore >= 88 ? 'High Priority Collab' : aiScore >= 75 ? 'Standard Outreach' : 'Observe & Monitor');

  // Bio
  const bio =
    getField('Bio', 'bio', 'Biography', 'Description', 'about') ||
    `Creator specializing in ${niche} content.`;

  // Engagement Rate (handles 0.045, 4.5, or "4.5%")
  let engagementRaw = getField('Engagement Rate', 'engagement_rate', 'Engagement', 'engagement', 'eng_rate');
  let engagementRate = 0.045;
  if (typeof engagementRaw === 'number') {
    engagementRate = engagementRaw > 1 ? engagementRaw / 100 : engagementRaw;
  } else if (typeof engagementRaw === 'string' && engagementRaw.trim()) {
    const parsed = parseFloat(engagementRaw.replace('%', '').trim());
    engagementRate = isNaN(parsed) ? 0.045 : (parsed > 1 ? parsed / 100 : parsed);
  }

  // Discovery Match Score (0-100)
  let matchScoreRaw = getField(
    'Discovery Match Score',
    'discovery_match_score',
    'Match Score',
    'match_score',
    'Discovery Score',
    'MatchScore'
  );
  let discoveryMatchScore = null;
  if (typeof matchScoreRaw === 'number') {
    discoveryMatchScore = matchScoreRaw > 1 ? Math.round(matchScoreRaw) : Math.round(matchScoreRaw * 100);
  } else if (typeof matchScoreRaw === 'string' && matchScoreRaw.trim()) {
    const parsed = parseFloat(matchScoreRaw.replace('%', '').trim());
    discoveryMatchScore = isNaN(parsed) ? null : (parsed <= 1 ? Math.round(parsed * 100) : Math.round(parsed));
  }
  if (discoveryMatchScore === null) {
    discoveryMatchScore = Math.min(100, Math.max(60, aiScore - 2));
  }

  // Discovery Match Reasons
  const discoveryMatchReasons =
    getField(
      'Discovery Match Reasons',
      'discovery_match_reasons',
      'Match Reasons',
      'match_reasons',
      'Discovery Reason',
      'match_reason',
      'Match Rationale'
    ) || `High thematic fit with target audience in ${niche}.`;

  // Location Status
  const locationStatus =
    getField(
      'Location Status',
      'location_status',
      'Location',
      'location',
      'Country',
      'country',
      'City',
      'city'
    ) || 'Target Region Verified';

  // Status (e.g. Discovered, Analyzed, Contacted, Outreach Ready)
  const status =
    getField('Status', 'status', 'Outreach Status', 'CRM Status', 'State') || 'Analyzed';

  // Outreach Status (New, Approval Pending, Email Sent, Interested, Not Interested)
  const rawOutreachStatus =
    getField('Outreach Status', 'outreach_status', 'Email Status', 'Campaign Status', 'Status', 'status') || '';
  let outreachStatus = 'New';
  const osLower = String(rawOutreachStatus).toLowerCase().trim();
  if (osLower.includes('pending') || osLower.includes('approval') || osLower.includes('review') || osLower.includes('draft')) {
    outreachStatus = 'Approval Pending';
  } else if (osLower.includes('sent') || osLower.includes('contacted') || osLower.includes('pitched') || osLower.includes('dispatched')) {
    outreachStatus = 'Email Sent';
  } else if (osLower.includes('interested') || osLower.includes('agreed') || osLower.includes('positive') || osLower.includes('closed')) {
    outreachStatus = 'Interested';
  } else if (osLower.includes('not interested') || osLower.includes('declined') || osLower.includes('rejected')) {
    outreachStatus = 'Not Interested';
  } else if (osLower) {
    outreachStatus = rawOutreachStatus;
  } else {
    outreachStatus = 'New';
  }

  // Last Contacted Date
  const lastContacted =
    getField(
      'Last Contacted',
      'last_contacted',
      'Last Contact Date',
      'Last Contacted Date',
      'Last Contact',
      'Contact Date',
      'Email Sent Date',
      'Date Contacted',
      'Sent Date'
    ) || 'Not Contacted Yet';

  // Gmail Thread ID
  const gmailThreadId =
    getField(
      'Gmail Thread ID',
      'gmail_thread_id',
      'Gmail Thread',
      'Thread ID',
      'thread_id',
      'ThreadId',
      'Thread',
      'Message ID'
    ) || 'None';

  // Priority mapping (High, Medium, Low)
  const priorityRaw = getField('Priority', 'priority', 'AI Priority');
  let priority = 'Medium';
  if (priorityRaw) {
    const pLower = String(priorityRaw).toLowerCase();
    priority = pLower.includes('high')
      ? 'High'
      : pLower.includes('low')
      ? 'Low'
      : 'Medium';
  } else {
    priority = aiScore >= 88 ? 'High' : aiScore >= 72 ? 'Medium' : 'Low';
  }

  // Profile Avatar
  const avatar =
    getField('Avatar', 'avatar', 'Profile Picture', 'Image', 'photo') ||
    `https://images.unsplash.com/photo-${[
      '1534528741775-53994a69daeb',
      '1507003211169-0a1dd7228f2d',
      '1544005313-94ddf0286df2',
      '1500648767791-00dcc994a43e',
      '1517841905240-472988babdf9',
      '1506794778202-cad84cf45f1d',
      '1524504388940-b1c1722653e1',
      '1519085360753-af0119f7cbe7'
    ][index % 8]}?w=150&auto=format&fit=crop&q=80`;

  return {
    id: influencer_id,
    influencer_id,
    name,
    username,
    niche,
    followers,
    aiScore,
    aiSummary,
    aiReason,
    recommendation,
    bio,
    engagementRate,
    discoveryMatchScore,
    discoveryMatchReasons,
    locationStatus,
    outreachStatus,
    lastContacted,
    gmailThreadId,
    priority,
    status,
    email,
    avatar,
    raw: item,
  };
}

/**
 * Fetch influencers from n8n Cloud Webhook endpoint (GET)
 */
export async function fetchInfluencersFromN8N() {
  const url = getInfluencersEndpointUrl();
  const rawData = await apiGet(url);

  // Determine array payload
  let recordsArray = [];
  if (Array.isArray(rawData)) {
    recordsArray = rawData;
  } else if (rawData && typeof rawData === 'object') {
    if (Array.isArray(rawData.data)) recordsArray = rawData.data;
    else if (Array.isArray(rawData.influencers)) recordsArray = rawData.influencers;
    else if (Array.isArray(rawData.records)) recordsArray = rawData.records;
    else if (Array.isArray(rawData.items)) recordsArray = rawData.items;
    else if (rawData.json && Array.isArray(rawData.json)) recordsArray = rawData.json;
    else {
      // Single object returned
      recordsArray = [rawData];
    }
  }

  const normalized = recordsArray
    .map((rec, idx) => normalizeInfluencerRecord(rec, idx))
    .filter(Boolean);

  return {
    success: true,
    data: normalized,
    count: normalized.length,
    endpointUsed: url,
  };
}

/**
 * Trigger Workflow 3: Generate Outreach Email (POST)
 * Payload format:
 * {
 *   "influencer_id": "<influencer_id>",
 *   "username": "<username>",
 *   "email": "<email>"
 * }
 */
export async function triggerGenerateOutreachEmail({ influencer_id, username, email }) {
  const url = getGenerateOutreachEndpointUrl();
  const payload = {
    influencer_id: String(influencer_id || ''),
    username: String(username || ''),
    email: String(email || '')
  };

  const response = await apiPost(url, payload);

  return {
    success: true,
    data: response,
    endpointUsed: url
  };
}
