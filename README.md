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


<img width="547" height="598" alt="image" src="https://github.com/user-attachments/assets/74bb2fbd-5a7c-4fd1-8b91-2e969b27f559" />

