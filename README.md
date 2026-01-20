Feedback Insights Dashboard
AI-powered feedback aggregation and analysis tool built for Cloudflare Product Manager Intern Assignment.

🏗️ Architecture Overview
This project demonstrates a production-ready feedback analysis system using Cloudflare's Developer Platform.

Cloudflare Products Used
1. Cloudflare Workers (Core Application)
Purpose: Hosts the main application logic and API endpoints
Why: Serverless, edge-deployed, incredibly fast cold starts
Usage:
API routes for feedback CRUD operations
Orchestrates communication between D1, AI, and KV
Serves the dashboard UI
2. D1 Database (Data Storage)
Purpose: Stores all feedback entries with metadata
Why: Native serverless SQL database, perfect for structured feedback data
Schema:
sql
  - feedback table: id, channel, text, sentiment, timestamp, engagement, upvotes, comments
  - Indexes on timestamp, channel, sentiment for fast queries
Usage:
Store feedback from 6 channels (GitHub, App Store, Support, Email, X, Forum)
Query for time-series analysis (7-day trends)
Filter by channel, sentiment, date ranges
3. Workers AI (ML-Powered Analysis)
Purpose: Sentiment analysis and keyword extraction
Why: Run ML models at the edge without external API calls
Models Used:
@cf/huggingface/distilbert-sst-2-int8 - Sentiment classification (positive/negative/neutral)
@cf/meta/llama-3.1-8b-instruct - Keyword extraction from feedback text
Usage:
Analyze sentiment of incoming feedback automatically
Extract recurring problem keywords from negative feedback (Top Issues)
Extract praised features from positive feedback (Top Features)
4. Workers KV (Caching Layer)
Purpose: Cache deployment timeline data and aggregated metrics
Why: Fast, globally distributed key-value store for frequently accessed data
Usage:
Cache deployment events (feature releases) with 1-hour TTL
Store pre-computed analytics to reduce D1 queries
Future: Cache aggregated daily/weekly reports
Architecture Diagram
┌─────────────────────────────────────────────────────────────────┐
│                        Cloudflare Edge                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Cloudflare Worker                     │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │           API Routes                             │   │  │
│  │  │  • GET  /api/feedback                            │   │  │
│  │  │  • GET  /api/feedback/analyze                    │   │  │
│  │  │  • POST /api/feedback/submit                     │   │  │
│  │  │  • GET  /api/deployments                         │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │                          │                               │  │
│  │         ┌────────────────┼────────────────┐             │  │
│  │         │                │                │             │  │
│  │         ▼                ▼                ▼             │  │
│  │   ┌─────────┐     ┌──────────┐     ┌──────────┐       │  │
│  │   │   D1    │     │Workers AI│     │    KV    │       │  │
│  │   │Database │     │          │     │ Storage  │       │  │
│  │   └─────────┘     └──────────┘     └──────────┘       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  React Dashboard │
                    │   (Frontend UI)  │
                    └──────────────────┘
🎨 Dashboard Features
1. Top Issues (Burning Tasks) - Orange Card
ML-extracted keywords from negative feedback (last 24h)
Shows recurring problem words with frequency
Highlights critical issues needing immediate attention
Real-time count of negative feedback
2. Top Features - Blue Card
ML-extracted keywords from positive feedback (last 24h)
Most praised features and capabilities
Validates product decisions with user sentiment
Real-time count of positive mentions
3. Sentiment Trend Chart
7-day time-series of net sentiment (positive - negative)
Deployment markers show feature release impact
Interactive: Hover over rocket icons to see deployment details
Tracks correlation between releases and sentiment changes
4. Channel Cards
6 feedback channels: GitHub, App Store, Support, Email, X, Forum
Daily vs Total feedback counts
5 most recent items per channel
Drill-down to view all channel feedback
🚀 Setup & Deployment
Prerequisites
bash
npm install -g wrangler
wrangler login
1. Create D1 Database
bash
npm run db:create
# Copy the database_id to wrangler.toml
2. Initialize Database Schema
bash
npm run db:migrate
3. Create KV Namespace
bash
npm run kv:create
# Copy the id to wrangler.toml
4. Deploy to Cloudflare Workers
bash
npm run deploy
5. Access Your Dashboard
https://feedback-insights-dashboard.YOUR_SUBDOMAIN.workers.dev
📊 API Endpoints
GET /api/feedback
Returns all feedback entries from D1

json
[
  {
    "id": 1,
    "channel": "github",
    "text": "Workers deployment is super fast",
    "sentiment": "positive",
    "timestamp": 1737158400000,
    "engagement": 45,
    "upvotes": 12,
    "comments": 5
  }
]
GET /api/feedback/analyze
Returns AI-analyzed insights

json
{
  "topIssues": {
    "count": 15,
    "keywords": [
      { "word": "dashboard", "count": 8 },
      { "word": "logs", "count": 6 }
    ],
    "samples": [...]
  },
  "topFeatures": {
    "count": 23,
    "keywords": [
      { "word": "performance", "count": 12 },
      { "word": "speed", "count": 9 }
    ],
    "samples": [...]
  }
}
POST /api/feedback/submit
Submit new feedback (auto-analyzed by Workers AI)

json
{
  "channel": "github",
  "text": "The new feature is amazing!",
  "engagement": 10,
  "upvotes": 5,
  "comments": 2
}
GET /api/deployments
Returns deployment timeline from KV cache

json
[
  {
    "date": "2026-01-17",
    "feature": "Dashboard UI Refresh",
    "description": "New analytics dashboard with better UX"
  }
]
🔧 Development
Local Development
bash
npm run dev
# Visit http://localhost:8787
Query Database Locally
bash
wrangler d1 execute feedback-db --local --command "SELECT * FROM feedback LIMIT 10"
Test Workers AI Locally
bash
wrangler dev --remote  # Workers AI requires remote mode
💡 Product Insights
This project solves the core PM problem of aggregating scattered feedback from multiple channels (Discord, GitHub, Support tickets, etc.) and using AI to surface actionable insights.

Key Benefits:
Automated Sentiment Analysis - No manual categorization needed
Keyword Extraction - ML identifies recurring themes automatically
Deployment Impact Tracking - Correlate releases with sentiment changes
Real-time Dashboard - Instant visibility into customer sentiment
Edge Performance - Sub-50ms response times globally
📈 Future Enhancements
Workflows Integration: Multi-step pipeline for feedback processing
R2 Integration: Store feedback attachments (screenshots, logs)
Slack/Discord Webhooks: Push daily summaries to team channels
Advanced AI: Topic modeling, trend prediction, anomaly detection
Multi-tenancy: Support multiple products/teams
🎯 Why This Architecture?
Workers = Lightning-fast API, deployed to 300+ cities
D1 = Structured data with SQL flexibility
Workers AI = No external API calls, data stays on Cloudflare edge
KV = Fast caching for frequently accessed data

This stack provides sub-100ms response times globally while keeping costs incredibly low on Cloudflare's generous free tier.

Built with ☁️ by [Your Name] for Cloudflare PM Intern Assignment 2026

