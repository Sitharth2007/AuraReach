// Comprehensive Mock Dataset for AuraReach AI Influencer Outreach
// Exactly 150 influencers: 35 High, 75 Medium, 40 Low
// Emails sent: 85, Pending approvals: 12, Follow-ups sent: 30, Interested: 18

const rawCuratedProfiles = [
  {
    name: "Genevieve Dubois",
    username: "@genevieve_paris",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    niche: "Luxury & Fashion",
    followers: 428000,
    engagementRate: 0.048,
    email: "collabs@genevievedubois.com",
    country: "France",
    bio: "Haute couture editorial curator & sustainable luxury advocate. Paris / Milan.",
    aiScore: 96,
    priority: "High",
    status: "Replied",
    audienceFit: 98,
    engagementAuthenticity: 95,
    brandSafety: 99,
    contentQuality: 97,
    conversionProbability: 92,
    summary: "Exceptional visual aesthetic with an affluent European audience. Her audience engagement matches luxury brand demographics with 72% aged 24-38.",
    reasoning: "High comment quality index (0.84) with minimal bot indicators. Prior sponsored collaborations with Hermès and Celine demonstrated 3.2x industry average conversion.",
    strengths: ["High-affinity European luxury audience", "Flawless color harmony and photography", "Zero controversial past sponsorships"],
    risks: "Prefers gifted curation before agreeing to long-term ambassadorship.",
    collabType: "Exclusive Seasonal Ambassadorship",
    outreach: {
      status: "Sent",
      subject: "Private Collaboration Invitation: Artisanal Heritage Collection",
      sentDate: "2026-11-04",
      body: "Dear Genevieve,\n\nWe have long admired your deliberate Parisian aesthetic and particularly your recent feature on sustainable atelier craftsmanship. Your vision aligns seamlessly with our Autumn Capsule.\n\nWe would love to extend a private invitation for you to preview the collection and curate three signature editorial features.\n\nCould we arrange a brief introductory call this Thursday?",
      previewHook: "Deliberate Parisian aesthetic & atelier craftsmanship"
    },
    followup: {
      sequenceStep: 1,
      lastContactDate: "2026-11-09",
      nextFollowupDate: "2026-11-18",
      status: "Paused - Replied",
      history: [
        { step: 1, date: "2026-11-04", type: "Initial Email", note: "Pitch sent via Gmail automation (Workflow 4)" },
        { step: 2, date: "2026-11-09", type: "Follow-up #1", note: "Gentle reminder with editorial moodboard attached" }
      ]
    },
    reply: {
      incomingDate: "2026-11-11",
      incomingText: "Bonjour! Thank you so much for thinking of me. The Autumn Capsule looks exquisite, and the burgundy and gold palette matches my feed aesthetic for the upcoming season. Could you share the deliverables, timeline, and budget guidelines so my manager and I can review?",
      classification: "Interested",
      sentiment: "Positive",
      status: "Drafted",
      aiDraftResponse: "Bonjour Genevieve,\n\nWe are delighted that the aesthetic resonates with your upcoming feed plans! Attached is our comprehensive partnership brief detailing the timeline (early December launch), 3 proposed IG carousel/Reels deliverables, and compensation details ($4,500 + seasonal gifting allowance).\n\nLet us know if you'd like to schedule a 10-minute briefing with our creative director."
    }
  },
  {
    name: "Julian Vance",
    username: "@julianvance.ai",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    niche: "Tech & AI",
    followers: 312000,
    engagementRate: 0.052,
    email: "contact@julianvance.tech",
    country: "United States",
    bio: "Demystifying generative AI and enterprise productivity. Host of 'The Intelligence Shift'.",
    aiScore: 94,
    priority: "High",
    status: "Replied",
    audienceFit: 94,
    engagementAuthenticity: 96,
    brandSafety: 98,
    contentQuality: 92,
    conversionProbability: 95,
    summary: "Key opinion leader in modern AI tools with a high concentration of tech founders, VCs, and senior product operators.",
    reasoning: "Consistently drives double-digit CTR on specialized software breakdowns. Audience questions in comment sections reflect genuine product buyers.",
    strengths: ["Highly technical yet approachable delivery", "Massive reach across decision-makers", "High viral reel probability"],
    risks: "Requires hands-on product trial before endorsing any workflow tool.",
    collabType: "Deep-Dive Reel & Dedicated Workflow Breakdown",
    outreach: {
      status: "Sent",
      subject: "Exclusive Preview: Autonomous Influencer Outreach Engine",
      sentDate: "2026-11-06",
      body: "Hey Julian,\n\nLoved your recent breakdown on multi-agent n8n architectures. We've built an autonomous system pairing Gemini 2.0 with custom outreach workflows that solves influencer CRM fatigue.\n\nWould love to grant you full developer access and sponsor a dedicated breakdown if you find it valuable.",
      previewHook: "Multi-agent n8n breakdown & custom outreach engine"
    },
    followup: {
      sequenceStep: 1,
      lastContactDate: "2026-11-10",
      nextFollowupDate: "2026-11-19",
      status: "Paused - Replied",
      history: [
        { step: 1, date: "2026-11-06", type: "Initial Email", note: "Sent initial pitch with sandbox demo link" },
        { step: 2, date: "2026-11-10", type: "Follow-up #1", note: "Nudged with live performance metrics" }
      ]
    },
    reply: {
      incomingDate: "2026-11-12",
      incomingText: "Hey team, this actually caught my eye. I've been experimenting with automated CRM agents myself lately. Can you send over a sandbox login and let me test it for 48 hours? If it delivers what it promises, I'd definitely be open to a dedicated reel sponsorship.",
      classification: "Interested",
      sentiment: "Positive",
      status: "Drafted",
      aiDraftResponse: "Hi Julian,\n\nThrilled to hear it! Here are your dedicated sandbox credentials with full enterprise tier permissions enabled. We also created a private Slack channel with our lead engineer if you run into any architecture questions during your testing.\n\nTake it for a spin and let's touch base on Friday."
    }
  },
  {
    name: "Elena Rostova",
    username: "@elena.botanicals",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    niche: "Beauty & Skincare",
    followers: 189000,
    engagementRate: 0.061,
    email: "partnerships@elenabotanicals.com",
    country: "United Kingdom",
    bio: "Cosmetic formulation chemist & botanical skincare purist. Clean aesthetics.",
    aiScore: 92,
    priority: "High",
    status: "Pending Approval",
    audienceFit: 96,
    engagementAuthenticity: 94,
    brandSafety: 99,
    contentQuality: 95,
    conversionProbability: 89,
    summary: "Science-backed authority in skincare with extraordinarily loyal followers. Her product recommendations sell out within hours.",
    reasoning: "Strict ingredient vetting by creator translates into unmatched audience trust. High organic save and share rates.",
    strengths: ["Certified cosmetic chemist background", "6.1% active comment engagement", "Clean minimalist visual feed"],
    risks: "Demands full ingredient deck disclosure before contract signing.",
    collabType: "Ingredient Deep-Dive & Clinical Routine Integration",
    outreach: {
      status: "Pending Approval",
      subject: "Scientific Formulation Collaboration & Botanical Range Preview",
      sentDate: "2026-11-15",
      body: "Dear Elena,\n\nAs an admirer of your ingredient-first reviews—especially your breakdown of cold-pressed lipids—we would be honored to introduce our clean bioactive line to you.\n\nWe provide full lab COAs and transparency reports. We'd love to send an unreleased formulation package for your private assessment.",
      previewHook: "Bioactive formulation & ingredient transparency disclosure"
    },
    followup: {
      sequenceStep: 0,
      lastContactDate: null,
      nextFollowupDate: "2026-11-18",
      status: "Scheduled",
      history: []
    },
    reply: null
  },
  {
    name: "Marcus Sterling",
    username: "@marcus_horology",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    niche: "Luxury Lifestyle",
    followers: 540000,
    engagementRate: 0.039,
    email: "mgmt@marcussterling.ch",
    country: "Switzerland",
    bio: "Independent horology critic & bespoke menswear connoisseur. Geneva / Zurich / London.",
    aiScore: 95,
    priority: "High",
    status: "Replied",
    audienceFit: 97,
    engagementAuthenticity: 93,
    brandSafety: 99,
    contentQuality: 98,
    conversionProbability: 91,
    summary: "World-class collector with deep connections across Swiss watchmaking and bespoke tailoring.",
    reasoning: "Audience median net worth and purchasing power is in the top 1% tier. Flawless reputation and prestige brand history.",
    strengths: ["Ultra-high net worth demographic", "Museum-grade macro cinematography", "Uncompromised taste authority"],
    risks: "High baseline production fee ($8k+).",
    collabType: "Heritage Storytelling & Private Salon Experience",
    outreach: {
      status: "Sent",
      subject: "Private Invitation: Limited Edition Horological Retrospective",
      sentDate: "2026-11-01",
      body: "Dear Marcus,\n\nYour recent essay on independent Swiss complications was a masterclass in horological criticism. We are curating an intimate private gathering in Geneva and would be privileged to host you as our guest of honor.",
      previewHook: "Independent Swiss complications & private Geneva salon"
    },
    followup: {
      sequenceStep: 2,
      lastContactDate: "2026-11-08",
      nextFollowupDate: "2026-11-17",
      status: "Paused - Replied",
      history: [
        { step: 1, date: "2026-11-01", type: "Initial Email", note: "Sent tailored Geneva salon invitation" },
        { step: 2, date: "2026-11-08", type: "Follow-up #1", note: "Sent curator itinerary and attendee roster" }
      ]
    },
    reply: {
      incomingDate: "2026-11-13",
      incomingText: "Good afternoon. I appreciate the refined approach of your invitation. I am in Geneva during those dates for the Grand Prix d'Horlogerie. What is the proposed format for the private dinner, and are there specific media commitments expected from my end?",
      classification: "Negotiation",
      sentiment: "Neutral",
      status: "Drafted",
      aiDraftResponse: "Good afternoon Marcus,\n\nThank you for your response. The dinner is strictly capped at 14 collectors with zero overt branding or staged photo-ops. We would only request one reflective post or story thread capturing your honest impressions of the bespoke timepiece reveal. We would be glad to accommodate your standard editorial honorarium of $7,500."
    }
  },
  {
    name: "Aria Chen",
    username: "@ariachen_wellness",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    niche: "Fitness & Health",
    followers: 275000,
    engagementRate: 0.057,
    email: "collab@ariachen.co",
    country: "Singapore",
    bio: "Holistic longevity coach & mindful movement educator. Plant-based advocate.",
    aiScore: 91,
    priority: "High",
    status: "Replied",
    audienceFit: 93,
    engagementAuthenticity: 95,
    brandSafety: 97,
    contentQuality: 94,
    conversionProbability: 90,
    summary: "Leading Southeast Asian wellness voice with a strong global reach across Tokyo, Sydney, and San Francisco.",
    reasoning: "Followers exhibit extraordinary retention across multi-week challenges. Highly responsive community with strong affinity for wellness tech.",
    strengths: ["High-converting fitness and mindfulness community", "Authentic lifestyle storytelling", "Clean, uplifting production value"],
    risks: "Refuses any partnerships containing artificial sweeteners or synthetic stimulants.",
    collabType: "30-Day Morning Ritual Integration",
    outreach: {
      status: "Sent",
      subject: "Mindful Living Partnership: 30-Day Morning Ritual",
      sentDate: "2026-11-07",
      body: "Hi Aria,\n\nYour morning routine series has inspired so many of our community members. We have engineered a 100% organic, adaptogenic blend that supports sustained cognitive clarity without spikes or crashes.\n\nWe'd love to send you a full ritual kit and discuss a collaborative challenge.",
      previewHook: "Adaptogenic morning ritual & cognitive clarity blend"
    },
    followup: {
      sequenceStep: 1,
      lastContactDate: "2026-11-12",
      nextFollowupDate: "2026-11-20",
      status: "Paused - Replied",
      history: [
        { step: 1, date: "2026-11-07", type: "Initial Email", note: "Sent pitch with product certification deck" },
        { step: 2, date: "2026-11-12", type: "Follow-up #1", note: "Sent laboratory organic certificates" }
      ]
    },
    reply: {
      incomingDate: "2026-11-14",
      incomingText: "Hello! This actually aligns really well with what I look for. I checked the lab analysis you sent—very impressed by the heavy metal testing and sourcing transparency! I'd love to try the blend for 2 weeks first. Where do I send my delivery details?",
      classification: "Interested",
      sentiment: "Positive",
      status: "Drafted",
      aiDraftResponse: "Hi Aria,\n\nWe are thrilled! You can reply with your preferred shipping address or use our private creator portal link here. We'll expedite the welcome package by express air immediately.\n\nEnjoy the ritual, and we can catch up in two weeks!"
    }
  },
  {
    name: "Mateo Silva",
    username: "@mateo_architect",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    niche: "Design & Architecture",
    followers: 410000,
    engagementRate: 0.045,
    email: "studio@mateosilva.design",
    country: "Spain",
    bio: "Brutalist architecture, minimalist interiors & spatial photography. Barcelona.",
    aiScore: 93,
    priority: "High",
    status: "Replied",
    audienceFit: 95,
    engagementAuthenticity: 96,
    brandSafety: 99,
    contentQuality: 98,
    conversionProbability: 88,
    summary: "Visual tastemaker celebrating brutalist concrete and warm minimalist wood interiors.",
    reasoning: "Very high visual standard. Collaborations with Bang & Olufsen and Vitra showed 4.1% save rate.",
    strengths: ["Editorial-tier visual assets", "High architect & interior designer follower base", "Strong brand synergy for premium design"],
    risks: "Does not accept traditional talking-head video formats.",
    collabType: "Spatial Vignette & Still Life Feature",
    outreach: {
      status: "Sent",
      subject: "Architectural Design Feature: Sustainable Living Elements",
      sentDate: "2026-11-05",
      body: "Hola Mateo,\n\nYour photo series on Ricardo Bofill's La Muralla Roja was breathtaking. We are launching a new architectural interior piece in warm travertine and brushed bronze and would love to commission a dedicated spatial vignette in your studio.",
      previewHook: "Warm travertine & brushed bronze spatial study"
    },
    followup: {
      sequenceStep: 1,
      lastContactDate: "2026-11-11",
      nextFollowupDate: "2026-11-21",
      status: "Paused - Replied",
      history: [
        { step: 1, date: "2026-11-05", type: "Initial Email", note: "Sent pitch with 3D product renders" },
        { step: 2, date: "2026-11-11", type: "Follow-up #1", note: "Nudged with studio staging concepts" }
      ]
    },
    reply: {
      incomingDate: "2026-11-13",
      incomingText: "Hola team. The materials look superb. Travertine has been a primary focus of our current studio renovation. Do you have dimensions and shipping feasibility to Barcelona? Let's talk about the production budget.",
      classification: "Interested",
      sentiment: "Positive",
      status: "Drafted",
      aiDraftResponse: "Hola Mateo,\n\nDimensions are 110cm x 45cm x 35cm, hand-carved in Italy. We handle all white-glove freight and customs direct to your Barcelona studio. Our standard fee for a dedicated vignette and rights package is $5,000.\n\nLet us know if this works for your schedule!"
    }
  },
  {
    name: "Clara Beauchamp",
    username: "@clara_gastronome",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    niche: "Food & Gourmet",
    followers: 195000,
    engagementRate: 0.063,
    email: "clara@claramedia.fr",
    country: "France",
    bio: "Michelin guide contributor, wine collector, and sourdough purist. Lyon.",
    aiScore: 90,
    priority: "High",
    status: "Replied",
    audienceFit: 92,
    engagementAuthenticity: 94,
    brandSafety: 98,
    contentQuality: 96,
    conversionProbability: 91,
    summary: "Culinary luminary with intense credibility among food artisans and luxury epicureans.",
    reasoning: "Authentic recipe saves are consistently above 10,000 per post. High trust factor with culinary brands.",
    strengths: ["Uncompromising culinary standards", "Strong foodie community engagement", "Exceptional food styling"],
    risks: "Refuses mass-market commercial foods.",
    collabType: "Tasting Menu Feature & Artisan Ingredient Reel",
    outreach: {
      status: "Sent",
      subject: "Culinary Heritage Partnership: Rare Cold-Pressed Olive Harvest",
      sentDate: "2026-11-03",
      body: "Chère Clara,\n\nYour celebration of regional terroir mirrors our philosophy. We are releasing an unfiltered, single-estate olive oil from 200-year-old trees in Crete and would be overjoyed to send you an early harvest flacon.",
      previewHook: "Single-estate early harvest olive oil & regional terroir"
    },
    followup: {
      sequenceStep: 1,
      lastContactDate: "2026-11-08",
      nextFollowupDate: "2026-11-17",
      status: "Paused - Replied",
      history: [
        { step: 1, date: "2026-11-03", type: "Initial Email", note: "Sent harvest invite" },
        { step: 2, date: "2026-11-08", type: "Follow-up #1", note: "Sent harvest notes from master miller" }
      ]
    },
    reply: {
      incomingDate: "2026-11-10",
      incomingText: "Bonjour! Early harvest Cretan oil with high polyphenols is exactly what I feature every autumn. I would be delighted to taste it and incorporate it into an upcoming rustic focaccia reel. Please send it over!",
      classification: "Interested",
      sentiment: "Positive",
      status: "Drafted",
      aiDraftResponse: "Bonjour Clara,\n\nWonderful! Two bottles of our cold-extracted harvest (polyphenols > 820mg/kg) have been packaged in UV-protected glass and are en route to your Lyon address.\n\nWe look forward to your culinary alchemy!"
    }
  },
  {
    name: "Liam O'Connor",
    username: "@liam_voyages",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    niche: "Travel & Hospitality",
    followers: 680000,
    engagementRate: 0.041,
    email: "press@liamoconnor.travel",
    country: "Ireland",
    bio: "Slow travel & remote boutique hideaways. National Geographic contributor.",
    aiScore: 92,
    priority: "High",
    status: "Replied",
    audienceFit: 94,
    engagementAuthenticity: 95,
    brandSafety: 99,
    contentQuality: 97,
    conversionProbability: 87,
    summary: "One of the most respected slow-travel documentarians on Instagram.",
    reasoning: "Exceptional drone photography, thoughtful storytelling, and consistent audience virality across Europe and North America.",
    strengths: ["NatGeo contributor pedigree", "Long-form captions that prompt meaningful comments", "Boutique hotel conversions"],
    risks: "Requires 3-month advance lead time for major shoots.",
    collabType: "Cinematic Travelogue & Wilderness Lodge Residency",
    outreach: {
      status: "Sent",
      subject: "Exclusive Invitation: Wilderness Sanctuary Experience & Capsule Launch",
      sentDate: "2026-11-02",
      body: "Hi Liam,\n\nYour cinematic series on the Lofoten Islands was stunning. We are opening an off-grid architectural sanctuary in the Scottish Highlands and would love to host you for a 4-night creative residency.",
      previewHook: "Scottish Highlands sanctuary & off-grid architectural residency"
    },
    followup: {
      sequenceStep: 1,
      lastContactDate: "2026-11-09",
      nextFollowupDate: "2026-11-19",
      status: "Paused - Replied",
      history: [
        { step: 1, date: "2026-11-02", type: "Initial Email", note: "Sent sanctuary invitation" },
        { step: 2, date: "2026-11-09", type: "Follow-up #1", note: "Sent architectural blueprint and private sauna details" }
      ]
    },
    reply: {
      incomingDate: "2026-11-12",
      incomingText: "Hi there. The Scottish Highlands project looks extraordinary—right in line with my documentary focus for winter. What are the available dates in January, and would my partner (who handles our aerial cinematography) be able to join?",
      classification: "Interested",
      sentiment: "Positive",
      status: "Drafted",
      aiDraftResponse: "Hi Liam,\n\nAbsolutely, your partner is warmly welcomed to co-stay and film. We have January 12–16 or January 22–26 open for your private lodge. We also cover all travel from Edinburgh.\n\nLet us know which window suits your schedule!"
    }
  },
  {
    name: "Sofia Lindqvist",
    username: "@sofia.scandi",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    niche: "Luxury Lifestyle",
    followers: 380000,
    engagementRate: 0.046,
    email: "mgmt@sofialindqvist.se",
    country: "Sweden",
    bio: "Scandinavian minimalism, slow fashion & Stockholm design journal.",
    aiScore: 91,
    priority: "High",
    status: "Replied",
    audienceFit: 94,
    engagementAuthenticity: 93,
    brandSafety: 99,
    contentQuality: 96,
    conversionProbability: 92,
    summary: "Stockholm-based tastemaker with high organic shopping conversion.",
    reasoning: "Her audience actively purchases items featured in her weekly 'Sunday Edits'.",
    strengths: ["High-affinity Nordic and UK audience", "Clean curation", "Loyal repeat engagement"],
    risks: "Selective about color palettes.",
    collabType: "Autumn Lookbook Carousel & Story Link Integration",
    outreach: {
      status: "Sent",
      subject: "Nordic Autumn Collaboration: Cashmere & Wool Overcoat Series",
      sentDate: "2026-11-06",
      body: "Hej Sofia,\n\nYour Sunday Edits are always an inspiration. We have produced a limited run of double-faced cashmere overcoats in burgundy and oatmeal, and we'd love to gift you a piece and feature your styling.",
      previewHook: "Double-faced cashmere & Sunday Edit styling"
    },
    followup: {
      sequenceStep: 1,
      lastContactDate: "2026-11-11",
      nextFollowupDate: "2026-11-20",
      status: "Paused - Replied",
      history: [
        { step: 1, date: "2026-11-06", type: "Initial Email", note: "Sent coat styling pitch" },
        { step: 2, date: "2026-11-11", type: "Follow-up #1", note: "Sent fabric swatches" }
      ]
    },
    reply: {
      incomingDate: "2026-11-13",
      incomingText: "Hej! Oh, the burgundy double-faced coat is magnificent! I would love to style it with my vintage raw denim for an upcoming Reel. Could you send the medium size? Here is my studio address in Stockholm.",
      classification: "Interested",
      sentiment: "Positive",
      status: "Drafted",
      aiDraftResponse: "Hej Sofia,\n\nThe medium coat in Deep Burgundy has been dispatched via DHL Express with tracking! We're excited to see your signature styling. We'll follow up once delivery is confirmed."
    }
  },
  {
    name: "Dr. Ethan Wright",
    username: "@dr_ethan_longevity",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
    niche: "Fitness & Health",
    followers: 245000,
    engagementRate: 0.053,
    email: "drwright@longevitylabs.io",
    country: "United States",
    bio: "MD, Cellular Biology & Longevity Medicine. Translating peer-reviewed science into daily vitality.",
    aiScore: 94,
    priority: "High",
    status: "Replied",
    audienceFit: 96,
    engagementAuthenticity: 97,
    brandSafety: 99,
    contentQuality: 93,
    conversionProbability: 94,
    summary: "Practicing physician with unmatched scientific rigor and an audience eager for evidence-based wellness.",
    reasoning: "Zero scam/fringe endorsements. High audience engagement with clinical trial breakdowns.",
    strengths: ["Board-certified credibility", "High converting newsletter crossover", "Audience with strong disposable income"],
    risks: "Demands double-blind randomized trial references.",
    collabType: "Medical Educational Reel & Clinical Review",
    outreach: {
      status: "Sent",
      subject: "Clinical Evidence Brief & Cellular Health Study Collaboration",
      sentDate: "2026-11-04",
      body: "Dear Dr. Wright,\n\nWe deeply respect your uncompromising standards for clinical evidence. We have completed a Phase II randomized trial on mitochondrial NAD+ precursors and would welcome your critical review.",
      previewHook: "Randomized trial on mitochondrial precursors & clinical review"
    },
    followup: {
      sequenceStep: 1,
      lastContactDate: "2026-11-10",
      nextFollowupDate: "2026-11-19",
      status: "Paused - Replied",
      history: [
        { step: 1, date: "2026-11-04", type: "Initial Email", note: "Sent paper preprint" },
        { step: 2, date: "2026-11-10", type: "Follow-up #1", note: "Sent clinical trial registration details" }
      ]
    },
    reply: {
      incomingDate: "2026-11-14",
      incomingText: "Thank you for sending the full methodology. The sample size and p-values are legitimate, which is rare in this space. I would be open to breaking down the mechanism of action on my page if you can supply the raw pharmacokinetic data.",
      classification: "Interested",
      sentiment: "Positive",
      status: "Drafted",
      aiDraftResponse: "Dear Dr. Wright,\n\nAttached is the complete pharmacokinetic dataset and bioavailability curve. Our chief medical officer is also available for a 15-minute scientific briefing whenever convenient for your clinic schedule."
    }
  },
  {
    name: "Camille Laurent",
    username: "@camille.couture",
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&auto=format&fit=crop&q=80",
    niche: "Luxury & Fashion",
    followers: 610000,
    engagementRate: 0.043,
    email: "agent@camillecouture.com",
    country: "France",
    bio: "Parisian style archivist, vintage Dior collector & fashion week fixture.",
    aiScore: 92,
    priority: "High",
    status: "Replied",
    audienceFit: 95,
    engagementAuthenticity: 91,
    brandSafety: 99,
    contentQuality: 97,
    conversionProbability: 90,
    summary: "One of the most photogenic European fashion accounts with consistent street-style coverage.",
    reasoning: "Her audience tracks every garment tag. Over 400,000 monthly story impressions.",
    strengths: ["High luxury brand compatibility", "Strong fashion week presence", "High aesthetic prestige"],
    risks: "Agency managed, formal contract required.",
    collabType: "Fashion Week Front Row Feature",
    outreach: {
      status: "Sent",
      subject: "Exclusive Haute Joaillerie & Couture Partnership",
      sentDate: "2026-11-05",
      body: "Chère Camille,\n\nYour archive series is essential viewing. We would love to outfit you for your upcoming Paris presentations with bespoke jewels from our burgundy enamel collection.",
      previewHook: "Burgundy enamel collection & bespoke Paris outfitting"
    },
    followup: {
      sequenceStep: 1,
      lastContactDate: "2026-11-10",
      nextFollowupDate: "2026-11-20",
      status: "Paused - Replied",
      history: [
        { step: 1, date: "2026-11-05", type: "Initial Email", note: "Sent jewelry moodboard" },
        { step: 2, date: "2026-11-10", type: "Follow-up #1", note: "Sent lookbook to agent" }
      ]
    },
    reply: {
      incomingDate: "2026-11-13",
      incomingText: "Hello. I represent Camille. We reviewed the enamel pieces and Camille is very keen on the earrings and cuff. What is your commercial budget for two dedicated feed posts and 4 stories during Paris Couture Week?",
      classification: "Negotiation",
      sentiment: "Neutral",
      status: "Drafted",
      aiDraftResponse: "Hello,\n\nWe are delighted Camille loves the pieces! For 2 feed posts and 4 stories during Couture Week, we offer $6,000 plus full gifting of the selected jewelry set (valued at $3,200). We can have our legal team send the contract today."
    }
  },
  {
    name: "Alexandre Moreau",
    username: "@alex.horlogerie",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    niche: "Luxury Lifestyle",
    followers: 210000,
    engagementRate: 0.058,
    email: "contact@alexmoreau.ch",
    country: "Switzerland",
    bio: "Micro-mechanics, vintage chronographs, and artisanal watchmaking essays.",
    aiScore: 93,
    priority: "High",
    status: "Replied",
    audienceFit: 94,
    engagementAuthenticity: 96,
    brandSafety: 99,
    contentQuality: 95,
    conversionProbability: 92,
    summary: "Dedicated watch enthusiast with an obsessive, knowledgeable community.",
    reasoning: "Comments reflect serious collectors discussing calibers, escapements, and finishing.",
    strengths: ["Passionate collector community", "High authority", "Macro horological video content"],
    risks: "Highly critical of mass-produced movements.",
    collabType: "Movement Teardown & Case Study",
    outreach: {
      status: "Sent",
      subject: "Craftsmanship Feature: Hand-Finished Mechanical Caliber",
      sentDate: "2026-11-07",
      body: "Cher Alexandre,\n\nWe admire your microscopic breakdowns of beveling and Geneva stripes. We have completed an in-house manual winding caliber with anglage by hand and would love to send a prototype for your loupe review.",
      previewHook: "Hand-finished manual caliber & loupe inspection"
    },
    followup: {
      sequenceStep: 1,
      lastContactDate: "2026-11-12",
      nextFollowupDate: "2026-11-20",
      status: "Paused - Replied",
      history: [
        { step: 1, date: "2026-11-07", type: "Initial Email", note: "Sent caliber schematics" },
        { step: 2, date: "2026-11-12", type: "Follow-up #1", note: "Nudged with high-res macro photos" }
      ]
    },
    reply: {
      incomingDate: "2026-11-14",
      incomingText: "The anglage in the photos looks surprisingly crisp for an independent debut. Yes, send the prototype to my Geneva workshop. I'll inspect the escapement under my microscope and film a macro reel if it meets expectations.",
      classification: "Interested",
      sentiment: "Positive",
      status: "Drafted",
      aiDraftResponse: "Merci Alexandre!\n\nThe prototype with hand-finished anglage is insured and dispatched directly to your Geneva workshop. We can't wait for your honest assessment under the loupe."
    }
  }
];

// Helper to generate full 150 influencers with exact distribution:
// Total: 150
// High: 35
// Medium: 75
// Low: 40
// Total = 150.
// Outreach status:
// Pending Approvals: exactly 12
// Emails sent: exactly 85
// In follow-up count (follow-ups sent): exactly 30
// Replies: exactly 37, of which Interested: 18, Negotiation: 8, Needs More Info: 6, Not Interested: 5

export function generateAllInfluencers() {
  const niches = [
    "Luxury & Fashion",
    "Tech & AI",
    "Beauty & Skincare",
    "Luxury Lifestyle",
    "Fitness & Health",
    "Design & Architecture",
    "Food & Gourmet",
    "Travel & Hospitality"
  ];

  const firstNames = [
    "Genevieve", "Julian", "Elena", "Marcus", "Aria", "Mateo", "Clara", "Liam", "Sofia", "Ethan",
    "Camille", "Alexandre", "Victoria", "Lucas", "Maya", "Sebastian", "Oliver", "Charlotte", "Gabriel", "Isabella",
    "Freja", "Henrik", "Leila", "Dante", "Chloe", "Maximilian", "Sienna", "Noah", "Zara", "Felix",
    "Giselle", "Arthur", "Nadia", "Raphael", "Amara", "Theo", "Stella", "Hugo", "Valentina", "Jasper",
    "Astrid", "Leon", "Katarina", "Elias", "Sora", "Declan", "Helena", "Kai", "Sybilla", "Ronan"
  ];

  const lastNames = [
    "Dubois", "Vance", "Rostova", "Sterling", "Chen", "Silva", "Beauchamp", "O'Connor", "Lindqvist", "Wright",
    "Laurent", "Moreau", "Sinclair", "Vanderbilt", "Al-Mansoor", "Kovacs", "Fontaine", "Mercer", "De Luca", "Holt",
    "Svensson", "Nygard", "Haddad", "Rossi", "Beaumont", "Von Berg", "Kwon", "Winter", "Vargas", "Blackwood",
    "Lombardi", "Ashford", "Mikhailov", "Cazalet", "Takahashi", "Monet", "Castiglione", "Thorne", "Benali", "Somerset"
  ];

  const avatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80"
  ];

  const list = [];

  // We need exactly:
  // High: 35
  // Medium: 75
  // Low: 40
  // Total: 150

  // Emails sent: exactly 85
  // Pending approvals: exactly 12
  // Uncontacted/Discovered/Analyzed: 150 - (85 + 12) = 53
  // Follow-ups sent: exactly 30 (subset of emails sent)
  // Replies: exactly 37 (subset of emails sent)
  //   Interested: 18
  //   Negotiation: 8
  //   Needs More Info: 6
  //   Not Interested: 5

  for (let i = 0; i < 150; i++) {
    let priority;
    let aiScore;
    if (i < 35) {
      priority = "High";
      aiScore = 88 + (i % 11); // 88 - 98
    } else if (i < 35 + 75) {
      priority = "Medium";
      aiScore = 72 + (i % 16); // 72 - 87
    } else {
      priority = "Low";
      aiScore = 55 + (i % 16); // 55 - 70
    }

    const curated = rawCuratedProfiles[i];
    const name = curated ? curated.name : `${firstNames[i % firstNames.length]} ${lastNames[(i * 3) % lastNames.length]}`;
    const username = curated ? curated.username : `@${name.toLowerCase().replace(/[^a-z]/g, '')}_${(i * 7) % 99 + 1}`;
    const niche = curated ? curated.niche : niches[i % niches.length];
    const avatar = curated ? curated.avatar : avatars[i % avatars.length];
    const followers = curated ? curated.followers : 25000 + ((i * 18451) % 950000);
    const engagementRate = curated ? curated.engagementRate : +(0.02 + ((i * 13) % 45) / 1000).toFixed(3);
    const email = curated ? curated.email : `contact@${name.toLowerCase().replace(/[^a-z]/g, '')}.com`;
    const country = curated ? curated.country : ["France", "United States", "United Kingdom", "Switzerland", "Sweden", "Italy", "Japan", "Germany"][i % 8];

    // Status assignment:
    // Exactly 12 pending approval (e.g. index 35 to 46)
    // Exactly 85 sent (e.g. 0 to 34 [highs] + 47 to 96 [mediums])
    // Exactly 53 not yet sent (analyzed/discovered)
    let outreachStatus = "Draft";
    let generalStatus = "Discovered";
    let followupObj = {
      sequenceStep: 0,
      lastContactDate: null,
      nextFollowupDate: null,
      status: "None",
      history: []
    };
    let replyObj = null;

    if (i < 85) {
      // These 85 are Emails Sent!
      outreachStatus = "Sent";
      generalStatus = "Contacted";

      // Follow-ups sent: exactly 30 items
      if (i < 30) {
        followupObj = {
          sequenceStep: 1 + (i % 2),
          lastContactDate: `2026-11-${String((i % 10) + 2).padStart(2, '0')}`,
          nextFollowupDate: `2026-11-${String((i % 10) + 16).padStart(2, '0')}`,
          status: i < 18 ? "Paused - Replied" : "Scheduled",
          history: [
            { step: 1, date: `2026-11-${String((i % 5) + 1).padStart(2, '0')}`, type: "Initial Email", note: "Sent automated intro via n8n" },
            { step: 2, date: `2026-11-${String((i % 5) + 6).padStart(2, '0')}`, type: "Follow-up #1", note: "Sent value-add hook" }
          ]
        };
        generalStatus = i < 18 ? "Replied" : "In Follow-up";
      }

      // Exactly 37 replies: 18 Interested, 8 Negotiation, 6 Needs More Info, 5 Not Interested
      if (i < 37) {
        generalStatus = "Replied";
        let classification = "Interested";
        let draft = "We are thrilled! Let us send over the complete campaign brief and deliverables.";
        let incomingMsg = "Hello! We would love to collaborate with your brand. Please send over rates and creative guidelines.";

        if (i < 18) {
          classification = "Interested";
          incomingMsg = curated && curated.reply ? curated.reply.incomingText : `Hi there! Love your aesthetic and products. I'd love to review the sample kit and discuss an Instagram Reel for late November.`;
          draft = curated && curated.reply ? curated.reply.aiDraftResponse : `Hi ${name.split(' ')[0]},\n\nWe are delighted to partner with you! We've prepared a comprehensive brief with creative freedom and compensation ($3,500). Let us know your shipping details for the gift pack.`;
        } else if (i < 18 + 8) {
          classification = "Negotiation";
          incomingMsg = `Hi team, my standard rate for 1 Reel + 2 Stories is $4,500. Let me know if that fits your campaign budget so we can proceed.`;
          draft = `Hi ${name.split(' ')[0]},\n\nThank you for sharing your rate card. We can meet you at $4,000 plus an additional 15% affiliate commission link. Does this balance work for you?`;
        } else if (i < 18 + 8 + 6) {
          classification = "Needs More Information";
          incomingMsg = `Hello, can you clarify whether this includes exclusivity in our category for Q4? Also what are the specific usage rights?`;
          draft = `Hi ${name.split(' ')[0]},\n\nGreat question! We only request 30 days category exclusivity on organic posts, with 6-month digital usage rights included in the base fee.`;
        } else {
          classification = "Not Interested";
          incomingMsg = `Thank you for reaching out, but our editorial calendar is currently fully committed through Q1. Best of luck with the campaign!`;
          draft = `Dear ${name.split(' ')[0]},\n\nThank you for letting us know! We will keep your team in mind for future seasonal activations. Have a wonderful season ahead.`;
        }

        replyObj = {
          incomingDate: `2026-11-${String((i % 12) + 2).padStart(2, '0')}`,
          incomingText: incomingMsg,
          classification,
          sentiment: classification === "Interested" ? "Positive" : classification === "Not Interested" ? "Hesitant" : "Neutral",
          status: i % 3 === 0 ? "Drafted" : i % 3 === 1 ? "Handled" : "Unread",
          aiDraftResponse: draft
        };
      }
    } else if (i < 85 + 12) {
      // Exactly 12 Pending Approvals! (85 to 96)
      outreachStatus = "Pending Approval";
      generalStatus = "Outreach Ready";
    } else {
      // Remaining 53 are Discovered / Analyzed
      outreachStatus = "Draft";
      generalStatus = i % 2 === 0 ? "Analyzed" : "Discovered";
    }

    const item = {
      id: `inf-${i + 1}`,
      name,
      username,
      avatar,
      niche,
      followers,
      engagementRate,
      email,
      country,
      bio: curated ? curated.bio : `Creative visual curator sharing daily inspirations in ${niche}. Brand collaborator & photographer.`,
      aiScore: curated ? curated.aiScore : aiScore,
      priority: curated ? curated.priority : priority,
      status: generalStatus,
      aiAnalysis: {
        summary: curated ? curated.summary : `High-affinity creator in ${niche} with consistent aesthetic cohesion and genuine follower engagement.`,
        reasoning: curated ? curated.reasoning : `Audience demographics show 74% alignment with target demographic. Minimal bot churn and strong comment sentiment score.`,
        audienceFit: curated ? curated.audienceFit : Math.min(99, aiScore + 2),
        engagementAuthenticity: curated ? curated.engagementAuthenticity : Math.min(98, aiScore + 1),
        brandSafety: curated ? curated.brandSafety : 98,
        contentQuality: curated ? curated.contentQuality : Math.min(99, aiScore + 3),
        conversionProbability: curated ? curated.conversionProbability : Math.max(70, aiScore - 4),
        keyStrengths: curated ? curated.strengths : [
          `Strong authority in ${niche}`,
          `High organic save/bookmark rate`,
          `Elevated photo & video production value`
        ],
        risksOrNotes: curated ? curated.risks : "Requires clear creative brief and 10-day lead time.",
        recommendedCollabType: curated ? curated.collabType : "Dedicated Reel + 2 Supporting Stories"
      },
      outreach: {
        status: outreachStatus,
        subject: curated && curated.outreach ? curated.outreach.subject : `Exclusive Collaboration Invitation: Autumn Editorial with ${name.split(' ')[0]}`,
        sentDate: outreachStatus === "Sent" ? `2026-11-${String((i % 12) + 1).padStart(2, '0')}` : null,
        body: curated && curated.outreach ? curated.outreach.body : `Dear ${name.split(' ')[0]},\n\nWe have been following your curated content in ${niche} and particularly loved your recent perspective on authentic aesthetics.\n\nWe are launching a limited premium collection and believe your creative lens is the perfect match. We would love to send you a complimentary curation kit and discuss a tailored paid collaboration.\n\nCould we send over the creative lookbook for your review?`,
        previewHook: curated && curated.outreach ? curated.outreach.previewHook : `Curated perspective on authentic ${niche} aesthetics`
      },
      followup: followupObj,
      reply: replyObj
    };

    list.push(item);
  }

  return list;
}

// Initial dataset instance
export const initialInfluencers = generateAllInfluencers();

// Verification helper that guarantees exact counts
export function calculateMetrics(influencers) {
  const total = influencers.length;
  const highPriority = influencers.filter(i => i.priority === "High").length;
  const mediumPriority = influencers.filter(i => i.priority === "Medium").length;
  const lowPriority = influencers.filter(i => i.priority === "Low").length;

  const emailsSent = influencers.filter(i => i.outreach.status === "Sent").length;
  const pendingApprovals = influencers.filter(i => i.outreach.status === "Pending Approval").length;
  const followupsSent = influencers.filter(i => i.followup && i.followup.sequenceStep > 0).length;
  const interestedInfluencers = influencers.filter(i => i.reply && i.reply.classification === "Interested").length;

  return {
    total,
    highPriority,
    mediumPriority,
    lowPriority,
    emailsSent,
    pendingApprovals,
    followupsSent,
    interestedInfluencers
  };
}

// Discovery Chart Data (Weekly batches from n8n Workflow 1)
export const discoveryVelocityData = [
  { week: "Oct W1", discovered: 18, analyzed: 16, approved: 12 },
  { week: "Oct W2", discovered: 24, analyzed: 22, approved: 18 },
  { week: "Oct W3", discovered: 32, analyzed: 30, approved: 24 },
  { week: "Oct W4", discovered: 28, analyzed: 26, approved: 20 },
  { week: "Nov W1", discovered: 36, analyzed: 34, approved: 28 },
  { week: "Nov W2", discovered: 42, analyzed: 40, approved: 35 },
];

// Email Outreach Performance Funnel Chart Data
export const emailPerformanceData = [
  { stage: "Pitched", count: 85, fill: "#6B1A2A" },
  { stage: "Delivered", count: 84, fill: "#8B2535" },
  { stage: "Opened", count: 68, fill: "#B85C6E" },
  { stage: "Replied", count: 37, fill: "#C9A84C" },
  { stage: "Interested", count: 18, fill: "#2D6A4F" },
  { stage: "Contracted", count: 11, fill: "#1C1410" },
];

// Niche distribution
export const nicheDistributionData = [
  { name: "Luxury & Fashion", value: 34, color: "#6B1A2A" },
  { name: "Tech & AI", value: 24, color: "#8B2535" },
  { name: "Beauty & Skincare", value: 26, color: "#B85C6E" },
  { name: "Luxury Lifestyle", value: 20, color: "#C9A84C" },
  { name: "Fitness & Health", value: 18, color: "#2D6A4F" },
  { name: "Design & Arch", value: 16, color: "#7A6860" },
  { name: "Food & Gourmet", value: 12, color: "#B45309" },
];

// n8n Backend Workflows status
export const n8nWorkflows = [
  {
    id: 1,
    name: "Influencer Research & Data Collection",
    trigger: "Scheduled (Daily 06:00 AM)",
    status: "Active",
    lastRun: "24 minutes ago",
    processedCount: 150,
    integration: "Instagram Graph API & Google Sheets CRM"
  },
  {
    id: 2,
    name: "AI Influencer Analysis & Scoring",
    trigger: "Webhook on New Sheet Row",
    status: "Active",
    lastRun: "18 minutes ago",
    processedCount: 150,
    integration: "Gemini 2.0 Flash & Google Sheets CRM"
  },
  {
    id: 3,
    name: "AI-Powered Email Outreach Generator",
    trigger: "Score > 75 & Status = Ready",
    status: "Active",
    lastRun: "12 minutes ago",
    processedCount: 97,
    integration: "Gemini Pro Personalization Engine"
  },
  {
    id: 4,
    name: "Email Sending & Status Tracking",
    trigger: "Manual Approval / Queue",
    status: "Active",
    lastRun: "7 minutes ago",
    processedCount: 85,
    integration: "Gmail API & Tracking Pixel Webhook"
  },
  {
    id: 5,
    name: "Automated Follow-up Sequences",
    trigger: "Scheduled (Every 48 Hours)",
    status: "Active",
    lastRun: "3 hours ago",
    processedCount: 30,
    integration: "Gmail API & Conditional Branching"
  },
  {
    id: 6,
    name: "AI Reply Detection & Classification",
    trigger: "Gmail Webhook (Incoming Message)",
    status: "Active",
    lastRun: "2 minutes ago",
    processedCount: 37,
    integration: "Gemini Classifier & Draft Responder"
  }
];

// Activity log for recent dashboard activity
export const recentActivities = [
  {
    id: "act-1",
    type: "reply",
    influencer: "Genevieve Dubois",
    handle: "@genevieve_paris",
    action: "Replied with interest",
    classification: "Interested",
    time: "12 minutes ago",
    workflow: "Workflow 6: AI Reply Detection"
  },
  {
    id: "act-2",
    type: "outreach",
    influencer: "Elena Rostova",
    handle: "@elena.botanicals",
    action: "Generated outreach draft awaiting review",
    classification: "Pending Approval",
    time: "24 minutes ago",
    workflow: "Workflow 3: AI Email Outreach"
  },
  {
    id: "act-3",
    type: "followup",
    influencer: "Mateo Silva",
    handle: "@mateo_architect",
    action: "Follow-up Step 1 delivered",
    classification: "Follow-up Sent",
    time: "48 minutes ago",
    workflow: "Workflow 5: Follow-up Automation"
  },
  {
    id: "act-4",
    type: "scoring",
    influencer: "Julian Vance",
    handle: "@julianvance.ai",
    action: "Scored 94/100 by Gemini 2.0 (High Priority)",
    classification: "High Priority",
    time: "1 hour ago",
    workflow: "Workflow 2: AI Scoring Engine"
  },
  {
    id: "act-5",
    type: "research",
    influencer: "Sofia Lindqvist",
    handle: "@sofia.scandi",
    action: "Synced from Instagram search to Google Sheets",
    classification: "CRM Sync",
    time: "2 hours ago",
    workflow: "Workflow 1: Influencer Research"
  }
];
