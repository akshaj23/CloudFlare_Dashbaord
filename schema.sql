-- 1. Clean Slate: Drop the table if it exists so we don't get duplicates
DROP TABLE IF EXISTS feedback;

-- 2. Create Table: Define the structure
CREATE TABLE feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  channel TEXT NOT NULL,
  text TEXT NOT NULL,
  sentiment TEXT NOT NULL CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  timestamp INTEGER NOT NULL,
  engagement INTEGER DEFAULT 0,
  upvotes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Indexes: For faster searching later
CREATE INDEX idx_feedback_timestamp ON feedback(timestamp DESC);
CREATE INDEX idx_feedback_channel ON feedback(channel);
CREATE INDEX idx_feedback_sentiment ON feedback(sentiment);

-- 4. Seed Data: Diverse examples for your AI to analyze
-- Note: We use ABS(RANDOM() % 168) to ensure we go BACK in time, not forward/negative.

INSERT INTO feedback (channel, text, sentiment, timestamp, engagement, upvotes, comments) VALUES
-- GitHub Issues (Technical bugs & Feature requests)
('github', 'Workers deployment is super fast but the logs are hard to find', 'negative', strftime('%s', 'now', '-' || ABS(RANDOM() % 24) || ' hours') * 1000, 45, 12, 5),
('github', 'D1 migrations failed with unclear error message', 'negative', strftime('%s', 'now', '-' || ABS(RANDOM() % 48) || ' hours') * 1000, 67, 23, 8),
('github', 'The new AI features are amazing! Great work team', 'positive', strftime('%s', 'now', '-' || ABS(RANDOM() % 12) || ' hours') * 1000, 89, 34, 12),
('github', 'Workers Analytics takes too long to load on weekends', 'negative', strftime('%s', 'now', '-' || ABS(RANDOM() % 72) || ' hours') * 1000, 56, 19, 7),
('github', 'Integration with GitHub Actions is seamless and easy', 'positive', strftime('%s', 'now', '-' || ABS(RANDOM() % 5) || ' hours') * 1000, 72, 28, 9),

-- App Store (UX & Billing)
('appstore', 'Love the new UI! Documentation could be better though', 'positive', strftime('%s', 'now', '-' || ABS(RANDOM() % 24) || ' hours') * 1000, 91, 41, 15),
('appstore', 'Dashboard is confusing, took me 20 mins to find bindings', 'negative', strftime('%s', 'now', '-' || ABS(RANDOM() % 10) || ' hours') * 1000, 78, 31, 11),
('appstore', 'R2 pricing is very competitive, saving us a ton', 'positive', strftime('%s', 'now', '-' || ABS(RANDOM() % 48) || ' hours') * 1000, 65, 25, 6),
('appstore', 'The free tier is generous, thanks Cloudflare!', 'positive', strftime('%s', 'now', '-' || ABS(RANDOM() % 96) || ' hours') * 1000, 88, 38, 13),
('appstore', 'Billing dashboard needs a cost prediction feature', 'neutral', strftime('%s', 'now', '-' || ABS(RANDOM() % 36) || ' hours') * 1000, 52, 18, 4),

-- Support Tickets (Specific technical hurdles)
('support', 'KV storage works great but need better monitoring tools', 'neutral', strftime('%s', 'now', '-' || ABS(RANDOM() % 12) || ' hours') * 1000, 43, 14, 3),
('support', 'Wrangler CLI crashes on Windows sometimes', 'negative', strftime('%s', 'now', '-' || ABS(RANDOM() % 100) || ' hours') * 1000, 69, 27, 10),
('support', 'Workers AI response time is impressive for Llama models', 'positive', strftime('%s', 'now', '-' || ABS(RANDOM() % 2) || ' hours') * 1000, 81, 35, 8),
('support', 'Pages deployment failed, error message was cryptic', 'negative', strftime('%s', 'now', '-' || ABS(RANDOM() % 5) || ' hours') * 1000, 74, 29, 9),
('support', 'D1 query performance exceeded expectations', 'positive', strftime('%s', 'now', '-' || ABS(RANDOM() % 8) || ' hours') * 1000, 77, 32, 7),

-- Email (Enterprise/Business feedback)
('email', 'Need better examples in the docs for Workflows', 'neutral', strftime('%s', 'now', '-' || ABS(RANDOM() % 48) || ' hours') * 1000, 48, 16, 4),
('email', 'Rate limiting kicked in unexpectedly, no warning email sent', 'negative', strftime('%s', 'now', '-' || ABS(RANDOM() % 24) || ' hours') * 1000, 63, 24, 8),
('email', 'CDN performance is outstanding as always globally', 'positive', strftime('%s', 'now', '-' || ABS(RANDOM() % 168) || ' hours') * 1000, 86, 37, 11),
('email', 'Docs search does not always find what I need', 'negative', strftime('%s', 'now', '-' || ABS(RANDOM() % 72) || ' hours') * 1000, 55, 20, 6),
('email', 'Workers deployment speed is incredible', 'positive', strftime('%s', 'now', '-' || ABS(RANDOM() % 12) || ' hours') * 1000, 79, 33, 9),

-- X/Twitter (Sentiment & Community)
('x', 'The Discord community is super helpful!', 'positive', strftime('%s', 'now', '-' || ABS(RANDOM() % 6) || ' hours') * 1000, 92, 42, 16),
('x', 'Dashboard performance needs improvement, feels laggy', 'negative', strftime('%s', 'now', '-' || ABS(RANDOM() % 2) || ' hours') * 1000, 61, 22, 7),
('x', 'Just deployed my first Worker - so easy!', 'positive', strftime('%s', 'now', '-' || ABS(RANDOM() % 24) || ' hours') * 1000, 84, 36, 10),
('x', 'Analytics dashboard is slow to load', 'negative', strftime('%s', 'now', '-' || ABS(RANDOM() % 10) || ' hours') * 1000, 58, 21, 5),
('x', 'Workers AI is a game changer for our team', 'positive', strftime('%s', 'now', '-' || ABS(RANDOM() % 50) || ' hours') * 1000, 95, 44, 18);

-- 5. Bulk Generation: Multiply the data above to simulate "noise"
-- This takes the 25 distinct rows above and duplicates them with slight random variations
-- to reach ~150 rows total.
INSERT INTO feedback (channel, text, sentiment, timestamp, engagement, upvotes, comments)
SELECT 
  channel,
  text,
  sentiment,
  -- FIXED: ABS() ensures we don't get negative numbers causing NULL errors
  strftime('%s', 'now', '-' || ABS(RANDOM() % 168) || ' hours') * 1000,
  ABS(RANDOM() % 100),
  ABS(RANDOM() % 50),
  ABS(RANDOM() % 20)
FROM feedback
LIMIT 125;