Deployment Guide - Feedback Insights Dashboard
Complete step-by-step guide to deploy your dashboard to Cloudflare Workers.

✅ Pre-Deployment Checklist
 Node.js 16+ installed
 Cloudflare account created (free tier works!)
 Wrangler CLI installed and logged in
📦 Step 1: Initial Setup
bash
# Create project directory
npm create cloudflare@latest

# OR if you already have the files
npm install
npm install -g wrangler

# Login to Cloudflare
wrangler login
🗄️ Step 2: Create D1 Database
bash
# Create the database
wrangler d1 create feedback-db
Output will look like:

✅ Successfully created DB 'feedback-db'

[[d1_databases]]
binding = "DB"
database_name = "feedback-db"
database_id = "xxxx-xxxx-xxxx-xxxx"
Action: Copy the database_id and paste it into your wrangler.toml file.

📋 Step 3: Initialize Database Schema
bash
# Run the schema.sql file against your D1 database
wrangler d1 execute feedback-db --file=./schema.sql --remote
Verify it worked:

bash
wrangler d1 execute feedback-db --command "SELECT COUNT(*) FROM feedback" --remote
You should see a count of the mock data inserted (~180 rows).

🗂️ Step 4: Create KV Namespace
bash
# Create KV namespace for deployment caching
wrangler kv:namespace create "DEPLOYMENTS_KV"
Output will look like:

✅ Successfully created KV namespace

[[kv_namespaces]]
binding = "DEPLOYMENTS_KV"
id = "xxxx-xxxx-xxxx-xxxx"
Action: Copy the id and paste it into your wrangler.toml file under kv_namespaces.

🤖 Step 5: Workers AI (No Setup Needed!)
Workers AI is automatically available through the [ai] binding in wrangler.toml. No additional setup required!

🚀 Step 6: Deploy to Workers
bash
# Deploy your Worker to production
npm run deploy
You'll see:

⛅️ wrangler 3.78.0
-------------------
Uploaded feedback-insights-dashboard (x.xx sec)
Published feedback-insights-dashboard (x.xx sec)
  https://feedback-insights-dashboard.YOUR_SUBDOMAIN.workers.dev
✅ Step 7: Test Your Deployment
Test API Endpoints:
bash
# Get all feedback
curl https://feedback-insights-dashboard.YOUR_SUBDOMAIN.workers.dev/api/feedback

# Get AI analysis
curl https://feedback-insights-dashboard.YOUR_SUBDOMAIN.workers.dev/api/feedback/analyze

# Get deployments
curl https://feedback-insights-dashboard.YOUR_SUBDOMAIN.workers.dev/api/deployments
Test in Browser:
Visit https://feedback-insights-dashboard.YOUR_SUBDOMAIN.workers.dev

🎨 Step 8: Deploy React Dashboard (Optional)
If you want to deploy the React dashboard as well:

bash
# Build your React app
cd dashboard
npm install
npm run build

# Deploy static files to Workers
# Option 1: Use wrangler pages (recommended)
wrangler pages deploy build --project-name feedback-dashboard

# Option 2: Use R2 + Workers for serving
# Upload build/ folder to R2 and configure Worker to serve from R2
🔧 Troubleshooting
Issue: "Database not found"
bash
# List your databases
wrangler d1 list

# Make sure database_id in wrangler.toml matches
Issue: "KV namespace not found"
bash
# List your KV namespaces
wrangler kv:namespace list

# Verify the id in wrangler.toml
Issue: "Workers AI not working"
bash
# Make sure you're deploying remotely (AI doesn't work in local dev)
wrangler deploy

# AI requires remote deployment, not local
Issue: CORS errors
The Worker includes CORS headers by default. If you still see errors, check that you're accessing the correct URL.

📊 Monitoring Your Deployment
View Logs:
bash
wrangler tail
Check Analytics:
Go to Cloudflare Dashboard
Navigate to Workers & Pages
Click on your Worker
View Analytics tab
Query D1 Database:
bash
# See recent feedback
wrangler d1 execute feedback-db --command "SELECT * FROM feedback ORDER BY timestamp DESC LIMIT 10" --remote

# Check sentiment distribution
wrangler d1 execute feedback-db --command "SELECT sentiment, COUNT(*) FROM feedback GROUP BY sentiment" --remote
🎯 Quick Commands Reference
bash
# Development
npm run dev                    # Local development server

# Database
npm run db:create              # Create D1 database
npm run db:migrate             # Run schema migrations
wrangler d1 execute feedback-db --command "SQL_HERE" --remote

# KV
npm run kv:create              # Create KV namespace
wrangler kv:key put --namespace-id=YOUR_ID "key" "value"

# Deployment
npm run deploy                 # Deploy to production
wrangler tail                  # View live logs
wrangler delete                # Delete deployment

# Debugging
wrangler dev --remote          # Test with real bindings
wrangler whoami                # Check logged-in account
📸 Screenshot for Assignment Submission
Take a screenshot of your Workers Dashboard Bindings page:

Go to Cloudflare Dashboard
Workers & Pages → Your Worker
Settings → Bindings
Screenshot showing:
D1 Database binding (DB)
KV Namespace binding (DEPLOYMENTS_KV)
AI binding
This screenshot is required for your architecture documentation!

🎓 For Cloudflare PM Assignment
Required Deliverables:
✅ Project Link: Your deployed Worker URL
✅ GitHub Repo: Source code repository
✅ Architecture Overview: README.md (already created)
✅ Bindings Screenshot: From your Workers dashboard
✅ Friction Log: Document 3-5 insights about using Cloudflare products
Example GitHub README Structure:
# Feedback Insights Dashboard

## Live Demo
🔗 https://feedback-insights-dashboard.YOUR_SUBDOMAIN.workers.dev

## Architecture
[Include your bindings screenshot here]

**Cloudflare Products Used:**
- Workers (API & hosting)
- D1 (feedback storage)
- Workers AI (sentiment analysis)
- KV (deployment caching)

[Rest of your README content]
🚨 Common Mistakes to Avoid
❌ Forgetting to update database_id in wrangler.toml
❌ Trying to use Workers AI in local dev (use --remote)
❌ Not running schema.sql before deployment
❌ Using wrong binding names (must match wrangler.toml)
❌ Deploying without testing endpoints first

✅ Always test with wrangler dev --remote first
✅ Verify bindings are correctly configured
✅ Check logs with wrangler tail after deployment
✅ Test all API endpoints before submission

Need Help?

Cloudflare Discord: https://discord.gg/cloudflaredev
Docs: https://developers.cloudflare.com
Assignment Support: pminternassignment@cloudflare.com
Good luck with your assignment! 🚀

