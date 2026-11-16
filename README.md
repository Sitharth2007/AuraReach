# AuraReach – AI-Powered Influencer Research & Outreach Automation Platform

**Discover. Analyse. Connect. Automate.**

AuraReach is an AI-powered influencer research and outreach automation platform designed to simplify and streamline influencer marketing campaigns.

The platform automates the influencer outreach lifecycle, from discovering potential influencers and analysing their profiles to generating personalized emails, tracking communication, sending automated follow-ups and managing incoming replies.

By integrating Artificial Intelligence, workflow automation and email management, AuraReach reduces repetitive manual work and helps businesses manage influencer collaborations more efficiently.

---

## 🚀 Key Features

- **Influencer Research:** Collect influencer information and build a centralized influencer database.
- **AI-Powered Analysis:** Analyse influencer profiles, evaluate their suitability and generate AI-based scores.
- **Personalized Email Generation:** Generate customized influencer outreach emails using Gemini AI.
- **Automated Email Tracking:** Detect sent outreach emails and automatically update CRM records.
- **Intelligent Follow-ups:** Identify influencers who haven't replied and automatically send personalized follow-up emails.
- **AI Reply Classification:** Analyse incoming influencer replies and identify their sentiment and intent.
- **Automated Reply Drafting:** Generate personalized email responses for manual approval.
- **Duplicate Prevention:** Track processed reply message IDs to prevent the same reply from being processed repeatedly.
- **Centralized CRM:** Manage influencer information, communication history and outreach statuses through Google Sheets.
- **Interactive Dashboard:** View influencer records, AI analysis, outreach activities and reply information through a React-based interface.

---

## 🏗️ System Architecture

AuraReach follows a frontend-to-automation architecture where the React application communicates with n8n webhooks to trigger automation workflows.

### Architecture Components

| Component | Technology | Responsibility |
|---|---|---|
| Frontend | React.js | User interface and dashboard |
| Frontend Build Tool | Vite | Development and production builds |
| Styling | Tailwind CSS | Responsive UI styling |
| Automation Backend | n8n Cloud | Workflow orchestration |
| AI Engine | Google Gemini | Influencer analysis, email generation and reply classification |
| Email Service | Gmail API | Draft creation, email sending and reply retrieval |
| CRM Database | Google Sheets | Influencer records and outreach tracking |
| API Communication | REST Webhooks | Frontend-to-n8n communication |

### High-Level Architecture

```text
                 USER
                  |
                  v
        +---------------------+
        |   React Frontend    |
        |     AuraReach       |
        +---------------------+
                  |
                  v
        +---------------------+
        |   n8n Webhooks      |
        |   API Integration  |
        +---------------------+
                  |
          +-------+-------+
          |       |       |
          v       v       v
       Gemini   Gmail   Google Sheets
         AI      API       CRM
          |       |         |
          +-------+---------+
                  |
                  v
        Automated Outreach
        & Reply Management
```

---

## ⚙️ Automation Workflow Architecture

AuraReach consists of six interconnected n8n workflows and dedicated API integrations.

### Workflow 1 – Instagram Influencer Research & Data Collection

**Purpose:** Collect influencer information and populate the centralized CRM.

Process:
1. Trigger influencer research.
2. Collect influencer profile information.
3. Extract relevant influencer details.
4. Organize the collected information.
5. Store influencer records in Google Sheets.

**Output:** A centralized influencer database containing collected influencer information.

### Workflow 2 – AI Influencer Analysis & Scoring

**Purpose:** Evaluate influencers using AI-based analysis.

Process:
1. Retrieve influencer information from the CRM.
2. Pass relevant profile information to Gemini AI.
3. Analyse influencer suitability.
4. Generate AI-based scores and classifications.
5. Update the influencer records with analysis results.

**Output:** AI-analysed influencer records with scores and classifications.

### Workflow 3 – API: Generate Personalized Outreach

**Purpose:** Generate personalized outreach emails directly from the frontend.

Process:
1. User selects an influencer from the dashboard.
2. React frontend triggers the n8n webhook.
3. Workflow retrieves the influencer information.
4. Gemini generates a personalized outreach email.
5. Generated email content is parsed.
6. Gmail creates an email draft.
7. Google Sheets updates the influencer status to `Approval Pending`.
8. The Gmail thread ID is stored in the CRM.
9. The webhook returns a JSON response to the frontend.

**Output:** A personalized Gmail draft awaiting manual approval.

### Workflow 4 – Email Sending & CRM Status Tracking

**Purpose:** Automatically track outreach emails sent through Gmail.

Process:
1. Scheduled workflow executes every five minutes.
2. Retrieve recently sent Gmail messages.
3. Retrieve influencer records from the CRM.
4. Match sent emails with influencer records using Gmail thread IDs.
5. Update the influencer's outreach status.
6. Record the last contacted timestamp.
7. Calculate the next follow-up date.

**Output:** Updated CRM records with email tracking information.

### Workflow 5 – Automated Follow-up Emails

**Purpose:** Automatically follow up with influencers who haven't responded.

Process:
1. Scheduled workflow executes daily at 9 AM.
2. Retrieve influencer records.
3. Identify influencers eligible for follow-up.
4. Check which follow-ups are due.
5. Retrieve the existing Gmail conversation.
6. Check whether the influencer has already replied.
7. Generate a personalized follow-up email using Gemini.
8. Send the follow-up within the existing Gmail conversation.
9. Update follow-up count and next follow-up schedule in the CRM.

**Output:** Automatically sent follow-up emails and updated CRM records.

### Workflow 6 – AI Reply Detection & Management

**Purpose:** Automatically identify, classify and manage incoming influencer replies.

Process:
1. Scheduled workflow executes daily at 9 AM.
2. Retrieve recent incoming Gmail messages.
3. Retrieve influencer records from Google Sheets.
4. Match incoming replies using sender email and Gmail thread ID.
5. Check processed reply IDs to prevent duplicate processing.
6. Classify influencer replies using Gemini AI.
7. Identify reply category and sentiment.
8. Update CRM records with AI-generated insights.
9. Generate a personalized response using Gemini AI.
10. Create a Gmail reply draft in the existing conversation.
11. Save the processed reply ID in the CRM.

**Output:** AI-classified influencer replies, updated CRM records and personalized Gmail reply drafts awaiting manual approval.

---

## 🔄 Complete End-to-End Application Flow

```text
Influencer Research
        |
        v
AI Influencer Analysis
        |
        v
Influencer Dashboard
        |
        v
Generate Personalized Outreach
        |
        v
Gmail Draft Creation
        |
        v
Manual Email Approval & Sending
        |
        v
Automated Email Tracking
        |
        v
CRM Status Update
        |
        v
Scheduled Follow-up Detection
        |
        v
Automated Follow-up Email
        |
        v
Incoming Influencer Reply
        |
        v
AI Reply Classification
        |
        v
CRM Reply Status Update
        |
        v
Personalized Reply Draft
        |
        v
Manual Approval & Sending
```

---

## 🛠️ Technology Stack

### Frontend
- React.js
- JavaScript
- Vite
- Tailwind CSS

### Backend & Automation
- n8n Cloud
- REST APIs
- Webhooks
- JavaScript Code Nodes

### Artificial Intelligence
- Google Gemini AI

### Integrations
- Gmail API
- Google Sheets API

### Development Tools
- Visual Studio Code
- Git
- GitHub
- Postman

---

## 📂 Project Structure

```text
AuraReach/
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── NotificationToast.jsx
│   │   │
│   │   └── layout/
│   │       ├── Layout.jsx
│   │       ├── Navbar.jsx
│   │       └── Sidebar.jsx
│   │
│   ├── context/
│   │   └── AppContext.jsx
│   │
│   ├── data/
│   │   └── mockData.js
│   │
│   ├── pages/
│   │   ├── AIAnalysis.jsx
│   │   ├── Dashboard.jsx
│   │   ├── EmailOutreach.jsx
│   │   ├── Followups.jsx
│   │   ├── Influencers.jsx
│   │   ├── ReplyManagement.jsx
│   │   └── Settings.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   └── influencerService.js
│   │
│   ├── utils/
│   │   └── formatters.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 💻 Installation & Local Setup

### Prerequisites

Make sure the following tools are installed:

- Node.js
- pnpm
- Git

### Step 1 – Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### Step 2 – Navigate to the Project

```bash
cd AuraReach
```

### Step 3 – Install Dependencies

```bash
pnpm install
```

### Step 4 – Configure Environment Variables

Create a `.env` file using `.env.example` as a reference.

```bash
cp .env.example .env
```

Add the required API configuration and webhook endpoints to the environment file.

Never commit actual API keys, OAuth credentials or private tokens to GitHub.

### Step 5 – Start the Development Server

```bash
pnpm dev
```

Open the local development URL displayed in your terminal.

---

## 🔐 Security Considerations

- API credentials and secrets must be stored securely.
- Environment files containing secrets must never be committed.
- Gmail access should use authorized credentials.
- Public webhook endpoints should be protected against unauthorized requests.
- User-specific data should be isolated before introducing multiple customers.
- API rate limits and email sending limits should be considered.

**Current deployment scope:** The existing implementation uses a shared Gmail integration and Google Sheets CRM. It is a working application prototype and is not yet a fully isolated multi-user SaaS platform.

---

## 🧪 Testing & Validation

The application has undergone end-to-end testing across its six automation workflows.

| Test Scenario | Result |
|---|---|
| Influencer research and collection | Passed |
| AI influencer analysis | Passed |
| Frontend outreach generation | Passed |
| Gmail draft creation | Passed |
| CRM email status tracking | Passed |
| Automated follow-up sending | Passed |
| Incoming reply detection | Passed |
| AI reply classification | Passed |
| Personalized reply draft generation | Passed |
| Duplicate reply prevention | Passed |
| Frontend and backend integration | Passed |

---

## 🌟 Future Enhancements

- User registration and authentication.
- Multi-tenant SaaS architecture.
- Individual Gmail account integration through Google OAuth.
- Dedicated database using PostgreSQL.
- Advanced influencer discovery and filtering.
- Campaign performance analytics.
- Subscription plans and payment integration.
- Role-based access control.
- Production monitoring and scalability improvements.

---

## 🎯 Project Objective

AuraReach aims to simplify influencer marketing by combining AI-powered research, intelligent email generation and workflow automation into one centralized platform.

Instead of manually researching influencers, writing emails, tracking conversations and sending follow-ups, users can manage the complete outreach lifecycle through a unified interface.

**AuraReach – Making Influencer Outreach Smarter, Faster and More Automated.**