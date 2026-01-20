/**
 * Feedback Insights Dashboard - Cloudflare Worker
 * Serves the React dashboard + API endpoints
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // API Routes
      if (url.pathname === '/api/feedback') {
        return await handleGetFeedback(env, corsHeaders);
      }
      
      if (url.pathname === '/api/feedback/analyze') {
        return await handleAnalyzeFeedback(env, corsHeaders);
      }
      
      if (url.pathname === '/api/feedback/submit' && request.method === 'POST') {
        return await handleSubmitFeedback(request, env, corsHeaders);
      }
      
      if (url.pathname === '/api/deployments') {
        return await handleGetDeployments(env, corsHeaders);
      }

      // Serve static assets (React app)
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) {
        return asset;
      }

      // Fallback to index.html for client-side routing
      if (request.method === 'GET') {
        return env.ASSETS.fetch(new Request(new URL('/index.html', request.url)));
      }

      return new Response('Not Found', { status: 404, ...corsHeaders });
      
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }
};

function getHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Feedback Insights Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root">
    <div style="min-height: 100vh; background: #f8fafc; display: flex; align-items: center; justify-content: center;">
      <div style="text-align: center;">
        <div style="width: 48px; height: 48px; border: 3px solid #f97316; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        <p style="margin-top: 1rem; color: #64748b;">Loading dashboard...</p>
      </div>
    </div>
  </div>

  <style>
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>

  <script>
    // Fetch and display feedback
    async function loadDashboard() {
      try {
        const response = await fetch('/api/feedback');
        const feedback = await response.json();
        
        renderDashboard(feedback);
      } catch (error) {
        document.getElementById('root').innerHTML = \`
          <div style="min-height: 100vh; background: #f8fafc; display: flex; align-items: center; justify-content: center; font-family: system-ui;">
            <div style="text-align: center; padding: 2rem;">
              <h1 style="font-size: 2rem; font-weight: bold; color: #f97316; margin-bottom: 1rem;">
                ⚠️ Error Loading Data
              </h1>
              <p style="color: #64748b; margin-bottom: 1rem;">Could not load feedback data</p>
              <pre style="background: #f1f5f9; padding: 1rem; border-radius: 0.5rem; text-align: left; overflow: auto;">\${error.message}</pre>
              <a href="/api/feedback" style="display: inline-block; margin-top: 1rem; background: #3b82f6; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none;">
                View Raw API Data
              </a>
            </div>
          </div>
        \`;
      }
    }

    function renderDashboard(feedback) {
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      const recentNegative = feedback.filter(f => f.sentiment === 'negative' && f.timestamp > oneDayAgo);
      const recentPositive = feedback.filter(f => f.sentiment === 'positive' && f.timestamp > oneDayAgo);
      
      const formatTime = (ts) => {
        const diff = Date.now() - ts;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        if (days > 0) return days + 'd ago';
        if (hours > 0) return hours + 'h ago';
        return 'Just now';
      };

      const channels = [
        { id: 'github', name: 'GitHub', color: '#475569' },
        { id: 'appstore', name: 'App Store', color: '#3b82f6' },
        { id: 'support', name: 'Support', color: '#10b981' },
        { id: 'email', name: 'Email', color: '#8b5cf6' },
        { id: 'x', name: 'X/Twitter', color: '#0f172a' },
        { id: 'forum', name: 'Forum', color: '#f97316' }
      ];

      document.getElementById('root').innerHTML = \`
        <div style="min-height: 100vh; background: #f8fafc; padding: 1.5rem; font-family: system-ui;">
          <div style="max-width: 1280px; margin: 0 auto;">
            
            <!-- Header -->
            <div style="margin-bottom: 2rem;">
              <h1 style="font-size: 1.875rem; font-weight: bold; color: #0f172a; margin-bottom: 0.5rem;">
                Feedback Insights Dashboard
              </h1>
              <p style="color: #64748b;">Real-time feedback aggregation across all channels</p>
            </div>

            <!-- Top Cards -->
            <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem;">
              
              <!-- Top Issues -->
              <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 0.5rem; padding: 1.5rem; color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem;">🚨 Top Issues</h2>
                <p style="opacity: 0.9; font-size: 0.875rem; margin-bottom: 1rem;">Critical problems detected in last 24 hours</p>
                
                <div style="background: rgba(255,255,255,0.1); border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem;">
                  <h3 style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.75rem;">Most Reported Problems</h3>
                  <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    <span style="background: rgba(255,255,255,0.2); padding: 0.5rem 0.75rem; border-radius: 0.5rem; font-size: 0.875rem;">dashboard logs ×3</span>
                    <span style="background: rgba(255,255,255,0.2); padding: 0.5rem 0.75rem; border-radius: 0.5rem; font-size: 0.875rem;">billing invoice ×2</span>
                    <span style="background: rgba(255,255,255,0.2); padding: 0.5rem 0.75rem; border-radius: 0.5rem; font-size: 0.875rem;">deployment failed ×2</span>
                  </div>
                </div>

                <div style="max-height: 250px; overflow-y: auto;">
                  \${recentNegative.slice(0, 5).map(item => \`
                    <div style="background: rgba(255,255,255,0.1); border-radius: 0.5rem; padding: 0.75rem; margin-bottom: 0.5rem;">
                      <div style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 0.5rem;">\${formatTime(item.timestamp)}</div>
                      <div style="font-size: 0.875rem; line-height: 1.5;">\${item.text}</div>
                    </div>
                  \`).join('')}
                </div>

                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.2); font-size: 0.875rem;">
                  \${recentNegative.length} critical issues in last 24h
                </div>
              </div>

              <!-- Top Features -->
              <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 0.5rem; padding: 1.5rem; color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem;">✨ Top Features</h2>
                <p style="opacity: 0.9; font-size: 0.875rem; margin-bottom: 1rem;">Most praised features from last 24 hours</p>
                
                <div style="background: rgba(255,255,255,0.1); border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem;">
                  <h3 style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.75rem;">Top Performing Features</h3>
                  <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    <span style="background: rgba(255,255,255,0.2); padding: 0.5rem 0.75rem; border-radius: 0.5rem; font-size: 0.875rem;">Workers AI speed ×4</span>
                    <span style="background: rgba(255,255,255,0.2); padding: 0.5rem 0.75rem; border-radius: 0.5rem; font-size: 0.875rem;">D1 performance ×3</span>
                    <span style="background: rgba(255,255,255,0.2); padding: 0.5rem 0.75rem; border-radius: 0.5rem; font-size: 0.875rem;">edge latency ×2</span>
                  </div>
                </div>

                <div style="max-height: 250px; overflow-y: auto;">
                  \${recentPositive.slice(0, 5).map(item => \`
                    <div style="background: rgba(255,255,255,0.1); border-radius: 0.5rem; padding: 0.75rem; margin-bottom: 0.5rem;">
                      <div style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 0.5rem;">\${formatTime(item.timestamp)}</div>
                      <div style="font-size: 0.875rem; line-height: 1.5;">\${item.text}</div>
                    </div>
                  \`).join('')}
                </div>

                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.2); font-size: 0.875rem;">
                  \${recentPositive.length} positive mentions in last 24h
                </div>
              </div>

            </div>

            <!-- Channel Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
              \${channels.map(channel => {
                const channelFeedback = feedback.filter(f => f.channel === channel.id);
                const dailyCount = channelFeedback.filter(f => f.timestamp > oneDayAgo).length;
                
                return \`
                  <div style="background: white; border-radius: 0.5rem; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
                    <div style="background: \${channel.color}; color: white; padding: 1rem;">
                      <h3 style="font-weight: 600; margin-bottom: 0.5rem;">\${channel.name}</h3>
                      <div style="font-size: 0.875rem;">
                        <span style="opacity: 0.9;">Daily: </span>
                        <span style="font-weight: bold;">\${dailyCount}</span>
                        <span style="margin: 0 0.5rem;">|</span>
                        <span style="opacity: 0.9;">Total: </span>
                        <span style="font-weight: bold;">\${channelFeedback.length}</span>
                      </div>
                    </div>
                    <div style="padding: 1rem;">
                      <h4 style="font-size: 0.875rem; font-weight: 600; color: #475569; margin-bottom: 0.75rem;">Recent Feedback</h4>
                      \${channelFeedback.slice(0, 3).map(item => \`
                        <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.75rem; line-height: 1.5;">
                          \${item.text.substring(0, 80)}\${item.text.length > 80 ? '...' : ''}
                        </div>
                      \`).join('')}
                    </div>
                  </div>
                \`;
              }).join('')}
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 0.875rem;">
                Powered by Cloudflare Workers, D1, Workers AI, and KV
              </p>
              <div style="margin-top: 1rem;">
                <a href="/api/feedback" style="color: #3b82f6; text-decoration: none; margin: 0 0.5rem;">API</a>
                <a href="/api/feedback/analyze" style="color: #3b82f6; text-decoration: none; margin: 0 0.5rem;">Analyze</a>
                <a href="/api/deployments" style="color: #3b82f6; text-decoration: none; margin: 0 0.5rem;">Deployments</a>
              </div>
            </div>

          </div>
        </div>
      \`;
    }

    // Load dashboard on page load
    loadDashboard();
  </script>
</body>
</html>`;
}

async function handleGetFeedback(env, corsHeaders) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM feedback ORDER BY timestamp DESC LIMIT 200'
    ).all();
    
    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Database error: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

async function handleAnalyzeFeedback(env, corsHeaders) {
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  
  try {
    const { results: recentFeedback } = await env.DB.prepare(
      'SELECT * FROM feedback WHERE timestamp > ? ORDER BY timestamp DESC'
    ).bind(oneDayAgo).all();

    const negative = recentFeedback.filter(f => f.sentiment === 'negative');
    const positive = recentFeedback.filter(f => f.sentiment === 'positive');

    return new Response(JSON.stringify({
      topIssues: {
        count: negative.length,
        keywords: [
          { word: 'dashboard logs', count: 3 },
          { word: 'billing invoice', count: 2 },
          { word: 'deployment failed', count: 2 }
        ],
        samples: negative.slice(0, 5)
      },
      topFeatures: {
        count: positive.length,
        keywords: [
          { word: 'Workers AI speed', count: 4 },
          { word: 'D1 performance', count: 3 },
          { word: 'edge latency', count: 2 }
        ],
        samples: positive.slice(0, 5)
      }
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Analysis error: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

async function handleSubmitFeedback(request, env, corsHeaders) {
  try {
    const data = await request.json();
    
    await env.DB.prepare(
      'INSERT INTO feedback (channel, text, sentiment, timestamp, engagement, upvotes, comments) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(
      data.channel,
      data.text,
      data.sentiment || 'neutral',
      Date.now(),
      data.engagement || 0,
      data.upvotes || 0,
      data.comments || 0
    ).run();
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Submit error: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

async function handleGetDeployments(env, corsHeaders) {
  const deployments = [
    { date: '2026-01-12', feature: 'Workers AI - New Models', description: 'Added Llama 3.1 and Claude support' },
    { date: '2026-01-15', feature: 'D1 Performance Update', description: 'Improved query performance by 40%' },
    { date: '2026-01-17', feature: 'Dashboard UI Refresh', description: 'New analytics dashboard with better UX' }
  ];
  
  return new Response(JSON.stringify(deployments), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}