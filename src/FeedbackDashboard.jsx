import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Github, Star, Mail, MessageSquare, Users, Globe, AlertCircle, Sparkles, Rocket } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CHANNELS = [
  { id: 'github', name: 'GitHub', icon: Github, color: 'bg-slate-700' },
  { id: 'appstore', name: 'App Store', icon: Star, color: 'bg-blue-500' },
  { id: 'support', name: 'Support Tickets', icon: MessageSquare, color: 'bg-emerald-600' },
  { id: 'email', name: 'Email', icon: Mail, color: 'bg-purple-600' },
  { id: 'x', name: 'X/Twitter', icon: Globe, color: 'bg-slate-900' },
  { id: 'forum', name: 'Community Forum', icon: Users, color: 'bg-orange-600' }
];

const DEPLOYMENTS = [
  { date: '2026-01-12', feature: 'Workers AI - New Models', description: 'Added Llama 3.1 and Claude support' },
  { date: '2026-01-15', feature: 'D1 Performance Update', description: 'Improved query performance by 40%' },
  { date: '2026-01-17', feature: 'Dashboard UI Refresh', description: 'New analytics dashboard with better UX' }
];

// Realistic feedback templates
const generateMockFeedback = () => {
  const negativeFeedback = [
    { text: "Dashboard logs not showing up - can't debug my Workers", channel: 'github', keywords: ['dashboard logs', 'debugging'] },
    { text: "Billing invoice calculation seems incorrect this month", channel: 'support', keywords: ['billing invoice', 'calculation'] },
    { text: "Deployment failed with error 500, no helpful message", channel: 'github', keywords: ['deployment failed', 'error message'] },
    { text: "Documentation for D1 migrations is missing key steps", channel: 'forum', keywords: ['D1 documentation', 'migrations'] },
    { text: "Analytics dashboard takes 30+ seconds to load", channel: 'appstore', keywords: ['analytics loading', 'performance'] },
    { text: "Can't figure out how to configure Workers routes properly", channel: 'support', keywords: ['Workers routes', 'configuration'] },
    { text: "Error logs buried too deep in the dashboard UI", channel: 'x', keywords: ['error logs', 'dashboard UI'] },
    { text: "Billing dashboard not reflecting current usage accurately", channel: 'email', keywords: ['billing accuracy', 'usage tracking'] },
    { text: "Deployment timeout with no clear reason why it failed", channel: 'github', keywords: ['deployment timeout', 'error clarity'] },
    { text: "Wrangler CLI documentation outdated for new D1 commands", channel: 'forum', keywords: ['CLI documentation', 'D1 commands'] },
    { text: "Dashboard navigation confusing - can't find KV bindings", channel: 'support', keywords: ['dashboard navigation', 'KV bindings'] },
    { text: "Logs panel empty even though Worker is throwing errors", channel: 'github', keywords: ['logs panel', 'error visibility'] },
    { text: "Invoice breakdown doesn't show per-product costs clearly", channel: 'email', keywords: ['invoice breakdown', 'cost clarity'] },
    { text: "Workers AI deployment keeps timing out after 2 minutes", channel: 'x', keywords: ['AI deployment', 'timeout issue'] },
    { text: "Documentation examples don't match actual API responses", channel: 'forum', keywords: ['documentation accuracy', 'API examples'] }
  ];

  const positiveFeedback = [
    { text: "Workers AI inference speed is incredible - under 100ms!", channel: 'x', keywords: ['Workers AI speed', 'inference time'] },
    { text: "D1 query performance after the update is blazing fast", channel: 'github', keywords: ['D1 performance', 'query speed'] },
    { text: "Pages deployment workflow is so smooth and intuitive", channel: 'appstore', keywords: ['Pages deployment', 'workflow'] },
    { text: "R2 pricing model is super competitive vs competitors", channel: 'forum', keywords: ['R2 pricing', 'cost savings'] },
    { text: "Workers global edge network latency is outstanding", channel: 'x', keywords: ['edge latency', 'global performance'] },
    { text: "KV storage replication speed across regions is impressive", channel: 'github', keywords: ['KV replication', 'multi-region'] },
    { text: "Workers AI model selection keeps getting better", channel: 'appstore', keywords: ['AI model variety', 'selection'] },
    { text: "CDN cache hit ratio is consistently above 95%", channel: 'email', keywords: ['CDN performance', 'cache efficiency'] },
    { text: "Dashboard redesign makes finding features much easier", channel: 'forum', keywords: ['dashboard UX', 'usability'] },
    { text: "Free tier limits are very generous for small projects", channel: 'x', keywords: ['free tier', 'generous limits'] },
    { text: "Wrangler CLI makes deploying Workers super easy", channel: 'github', keywords: ['Wrangler CLI', 'deployment ease'] },
    { text: "Pages build times improved dramatically this month", channel: 'appstore', keywords: ['Pages build speed', 'CI/CD'] },
    { text: "Workers AI cost is fraction of what we paid elsewhere", channel: 'email', keywords: ['AI cost savings', 'pricing'] },
    { text: "D1 SQL syntax support is comprehensive and reliable", channel: 'forum', keywords: ['D1 SQL support', 'compatibility'] },
    { text: "R2 API compatibility with S3 made migration seamless", channel: 'github', keywords: ['R2 compatibility', 'S3 migration'] }
  ];

  const allFeedback = [];
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  // Add negative feedback
  negativeFeedback.forEach((item, idx) => {
    const isRecent = idx < 10;
    const timestamp = isRecent 
      ? oneDayAgo + Math.random() * (now - oneDayAgo)
      : sevenDaysAgo + Math.random() * (oneDayAgo - sevenDaysAgo);
    
    allFeedback.push({
      id: `neg-${idx}`,
      channel: item.channel,
      text: item.text,
      sentiment: 'negative',
      timestamp,
      engagement: Math.floor(Math.random() * 100),
      upvotes: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 20),
      keywords: item.keywords,
      confidence: 80 + Math.floor(Math.random() * 17) // 80-97%
    });
  });

  // Add positive feedback
  positiveFeedback.forEach((item, idx) => {
    const isRecent = idx < 12;
    const timestamp = isRecent 
      ? oneDayAgo + Math.random() * (now - oneDayAgo)
      : sevenDaysAgo + Math.random() * (oneDayAgo - sevenDaysAgo);
    
    allFeedback.push({
      id: `pos-${idx}`,
      channel: item.channel,
      text: item.text,
      sentiment: 'positive',
      timestamp,
      engagement: Math.floor(Math.random() * 100),
      upvotes: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 20),
      keywords: item.keywords,
      confidence: 82 + Math.floor(Math.random() * 15) // 82-97%
    });
  });

  // Add neutral feedback
  const neutralTexts = [
    "Checking if Workers support WebSockets natively",
    "Would love to see more detailed metrics in Analytics",
    "Feature request: dark mode for the dashboard",
    "Is there a timeline for Durable Objects regional support?",
    "Documentation could use more real-world examples"
  ];

  neutralTexts.forEach((text, idx) => {
    CHANNELS.forEach(channel => {
      allFeedback.push({
        id: `neutral-${channel.id}-${idx}`,
        channel: channel.id,
        text,
        sentiment: 'neutral',
        timestamp: sevenDaysAgo + Math.random() * (now - sevenDaysAgo),
        engagement: Math.floor(Math.random() * 50),
        upvotes: Math.floor(Math.random() * 25),
        comments: Math.floor(Math.random() * 10),
        keywords: [],
        confidence: Math.round(65 + Math.random() * 20) // 65-85% for neutral
      });
    });
  });

  return allFeedback;
};

// Generate AI confidence score based on sentiment
const generateConfidenceScore = (sentiment) => {
  if (sentiment === 'positive') {
    return Math.round(82 + Math.random() * 15); // 82-97%
  } else if (sentiment === 'negative') {
    return Math.round(80 + Math.random() * 17); // 80-97%
  } else {
    return Math.round(65 + Math.random() * 20); // 65-85%
  }
};

const generateTimeSeriesData = (feedback) => {
  const data = [];
  const now = Date.now();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayStart = date.getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    
    const dayFeedback = feedback.filter(f => f.timestamp >= dayStart && f.timestamp < dayEnd);
    const positive = dayFeedback.filter(f => f.sentiment === 'positive').length;
    const negative = dayFeedback.filter(f => f.sentiment === 'negative').length;
    const neutral = dayFeedback.filter(f => f.sentiment === 'neutral').length;
    const total = dayFeedback.length;
    
    const deployment = DEPLOYMENTS.find(d => d.date === dateStr);
    
    data.push({
      date: dateStr,
      dateLabel: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      positive,
      negative,
      neutral,
      total,
      score: positive - negative,
      deployment: deployment || null
    });
  }
  
  return data;
};

const extractTopKeywords = (feedbackList) => {
  const keywordCounts = {};
  
  feedbackList.forEach(f => {
    if (f.keywords && f.keywords.length > 0) {
      f.keywords.forEach(keyword => {
        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
      });
    }
  });
  
  return Object.entries(keywordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));
};

const FeedbackDashboard = () => {
  const [feedback, setFeedback] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredDeployment, setHoveredDeployment] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setFeedback(generateMockFeedback());
      setLoading(false);
    }, 800);
  }, []);

  const getChannelStats = (channelId) => {
    const channelFeedback = feedback.filter(f => f.channel === channelId);
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const twoDaysAgo = Date.now() - 48 * 60 * 60 * 1000;
    
    const dailyCount = channelFeedback.filter(f => f.timestamp > oneDayAgo).length;
    
    // Calculate sentiment score for today
    const todayFeedback = channelFeedback.filter(f => f.timestamp > oneDayAgo);
    const todayPositive = todayFeedback.filter(f => f.sentiment === 'positive').length;
    const todayNegative = todayFeedback.filter(f => f.sentiment === 'negative').length;
    const todayNeutral = todayFeedback.filter(f => f.sentiment === 'neutral').length;
    
    // Use a weighted sentiment score: positive = +1, negative = -1, neutral = 0.2
    const todayScore = Math.round((todayPositive - todayNegative + todayNeutral * 0.2) * 10) / 10;
    
    // Calculate sentiment score for yesterday with realistic variance
    const yesterdayFeedback = channelFeedback.filter(f => f.timestamp > twoDaysAgo && f.timestamp <= oneDayAgo);
    const yesterdayPositive = yesterdayFeedback.filter(f => f.sentiment === 'positive').length;
    const yesterdayNegative = yesterdayFeedback.filter(f => f.sentiment === 'negative').length;
    const yesterdayNeutral = yesterdayFeedback.filter(f => f.sentiment === 'neutral').length;
    
    // Add variance factor to yesterday's score for realism
    const baseYesterdayScore = yesterdayPositive - yesterdayNegative + yesterdayNeutral * 0.2;
    const varianceFactor = 0.7 + Math.random() * 0.6; // Random factor between 0.7 and 1.3
    const yesterdayScore = Math.round(baseYesterdayScore * varianceFactor * 10) / 10;
    
    // Calculate percentage change with realistic bounds
    let scoreChange;
    if (yesterdayScore === 0 && todayScore === 0) {
      scoreChange = 0;
    } else if (yesterdayScore === 0) {
      scoreChange = todayScore > 0 ? Math.min(Math.random() * 85 + 15, 150) : -Math.min(Math.random() * 85 + 15, 150);
    } else {
      scoreChange = Math.round(((todayScore - yesterdayScore) / Math.abs(yesterdayScore)) * 100);
      // Cap the change to realistic values (-200% to +200%)
      scoreChange = Math.max(-200, Math.min(200, scoreChange));
    }
    
    const isPositiveTrend = todayScore >= yesterdayScore;
    
    return {
      total: channelFeedback.length,
      daily: dailyCount,
      recent: channelFeedback
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5),
      todayScore,
      yesterdayScore,
      scoreChange,
      isPositiveTrend
    };
  };

  const getSentimentColor = (sentiment) => {
    switch(sentiment) {
      case 'positive': return 'text-emerald-700 bg-emerald-50 border border-emerald-200';
      case 'negative': return 'text-orange-700 bg-orange-50 border border-orange-200';
      default: return 'text-slate-600 bg-slate-50 border border-slate-200';
    }
  };

  const formatTimestamp = (timestamp) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading feedback data...</p>
        </div>
      </div>
    );
  }

  if (selectedChannel) {
    const channel = CHANNELS.find(c => c.id === selectedChannel);
    const channelFeedback = feedback
      .filter(f => f.channel === selectedChannel)
      .sort((a, b) => b.timestamp - a.timestamp);
    
    const Icon = channel.icon;
    
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setSelectedChannel(null)}
            className="mb-6 text-slate-600 hover:text-slate-900 flex items-center gap-2 font-medium"
          >
            ← Back to Dashboard
          </button>
          
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`${channel.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{channel.name}</h1>
                <p className="text-slate-600">{channelFeedback.length} total feedback items</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {channelFeedback.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <p className="text-slate-900 mb-2">{item.text}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>{formatTimestamp(item.timestamp)}</span>
                      <span>↑ {item.upvotes}</span>
                      <span>💬 {item.comments}</span>
                      <span>👁 {item.engagement}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getSentimentColor(item.sentiment)}`}>
                      {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)} ({item.confidence || 85}%)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
                  <button className="text-xs px-3 py-1.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200 font-medium">
                    📋 Create Linear Ticket
                  </button>
                  <button className="text-xs px-3 py-1.5 rounded bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors border border-purple-200 font-medium">
                    💬 Share to Slack
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const recentNegative = feedback.filter(f => f.sentiment === 'negative' && f.timestamp > oneDayAgo);
  const recentPositive = feedback.filter(f => f.sentiment === 'positive' && f.timestamp > oneDayAgo);
  
  const negativeKeywords = extractTopKeywords(recentNegative);
  const positiveKeywords = extractTopKeywords(recentPositive);
  
  const timeSeriesData = generateTimeSeriesData(feedback);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-900 mb-2">{data.dateLabel}</p>
          <div className="space-y-1 text-sm">
            <p className="text-emerald-600">✓ Positive: {data.positive}</p>
            <p className="text-orange-600">✗ Negative: {data.negative}</p>
            <p className="text-slate-600">○ Neutral: {data.neutral}</p>
            <p className="font-semibold text-slate-900 mt-2">Total: {data.total}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Feedback Insights Dashboard</h1>
          <p className="text-slate-600">Real-time feedback aggregation across all channels</p>
        </div>

        {/* Top Two Aggregated Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Issues */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6" />
              <h2 className="text-xl font-bold">Top Issues</h2>
            </div>
            <p className="text-orange-100 text-sm mb-4">
              Critical problems detected in the last 24 hours
            </p>
            
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Most Reported Problems
              </h3>
              <div className="flex flex-wrap gap-2">
                {negativeKeywords.map(({ word, count }) => (
                  <div key={word} className="bg-white/20 px-3 py-2 rounded-lg backdrop-blur">
                    <span className="font-semibold text-sm">{word}</span>
                    <span className="ml-2 text-xs opacity-90">×{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentNegative.slice(0, 5).map((item) => {
                const channel = CHANNELS.find(c => c.id === item.channel);
                const Icon = channel.icon;
                return (
                  <div key={item.id} className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2 text-sm">
                      <Icon className="w-3 h-3" />
                      <span className="font-medium">{channel.name}</span>
                      <span className="opacity-75">• {formatTimestamp(item.timestamp)}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{item.text}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/20 text-sm text-orange-100">
              {recentNegative.length} critical issues in last 24h
            </div>
          </div>

          {/* Top Features */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6" />
              <h2 className="text-xl font-bold">Top Features</h2>
            </div>
            <p className="text-blue-100 text-sm mb-4">
              Most praised features from the last 24 hours
            </p>
            
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Top Performing Features
              </h3>
              <div className="flex flex-wrap gap-2">
                {positiveKeywords.map(({ word, count }) => (
                  <div key={word} className="bg-white/20 px-3 py-2 rounded-lg backdrop-blur">
                    <span className="font-semibold text-sm">{word}</span>
                    <span className="ml-2 text-xs opacity-90">×{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentPositive.slice(0, 5).map((item) => {
                const channel = CHANNELS.find(c => c.id === item.channel);
                const Icon = channel.icon;
                return (
                  <div key={item.id} className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2 text-sm">
                      <Icon className="w-3 h-3" />
                      <span className="font-medium">{channel.name}</span>
                      <span className="opacity-75">• {formatTimestamp(item.timestamp)}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{item.text}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/20 text-sm text-blue-100">
              {recentPositive.length} positive mentions in last 24h
            </div>
          </div>
        </div>

        {/* Time Series Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Sentiment Trend (7 Days)</h2>
              <p className="text-slate-600 text-sm">Track cumulative feedback sentiment and deployment impact</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-slate-700">Net Sentiment</span>
              </div>
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-orange-500" />
                <span className="text-slate-700">Deployment</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="dateLabel" 
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} label={{ value: 'Sentiment Score', angle: -90, position: 'insideLeft', style: { fill: '#64748b' } }} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    if (payload.deployment) {
                      return (
                        <g>
                          <circle cx={cx} cy={cy} r={8} fill="#f97316" stroke="#fff" strokeWidth={2} />
                          <foreignObject
                            x={cx - 12}
                            y={cy - 12}
                            width="24"
                            height="24"
                          >
                            <div
                              className="cursor-pointer flex items-center justify-center"
                              onMouseEnter={() => setHoveredDeployment(payload.deployment)}
                              onMouseLeave={() => setHoveredDeployment(null)}
                            >
                              <Rocket className="w-4 h-4 text-white" />
                            </div>
                          </foreignObject>
                        </g>
                      );
                    }
                    return <circle cx={cx} cy={cy} r={5} fill="#3b82f6" />;
                  }}
                  name="Net Sentiment"
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Deployment Info Card */}
            {hoveredDeployment && (
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border-2 border-orange-500 p-4 w-64 z-10 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <Rocket className="w-5 h-5 text-orange-500" />
                  <h3 className="font-bold text-slate-900">{hoveredDeployment.feature}</h3>
                </div>
                <p className="text-sm text-slate-600 mb-2">{hoveredDeployment.description}</p>
                <p className="text-xs text-slate-500">Deployed: {hoveredDeployment.date}</p>
              </div>
            )}
          </div>
        </div>

        {/* Channel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHANNELS.map(channel => {
            const stats = getChannelStats(channel.id);
            const Icon = channel.icon;
            
            return (
              <div key={channel.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className={`${channel.color} p-4 text-white`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-5 h-5" />
                    <h3 className="font-semibold">{channel.name}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    <div className="whitespace-nowrap">
                      <span className="opacity-90">Daily: </span>
                      <span className="font-bold">{stats.daily}</span>
                    </div>
                    <div className="whitespace-nowrap">
                      <span className="opacity-90">Total: </span>
                      <span className="font-bold">{stats.total}</span>
                    </div>
                    <div className="whitespace-nowrap">
                      <span className="opacity-90">Score: </span>
                      <span className="font-bold">{stats.todayScore >= 0 ? '+' : ''}{stats.todayScore}</span>
                    </div>
                    <div className="whitespace-nowrap">
                      <span className="opacity-90">Since Yesterday: </span>
                      <span className={`font-bold flex items-center gap-1 ${stats.isPositiveTrend ? 'text-emerald-200' : 'text-red-200'}`}>
                        {stats.isPositiveTrend ? '📈' : '📉'} {Math.abs(stats.scoreChange).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Recent Feedback</h4>
                  <div className="space-y-2 mb-4">
                    {stats.recent.map((item) => (
                      <div key={item.id} className="text-sm">
                        <p className="text-slate-900 line-clamp-2 mb-1">{item.text}</p>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${getSentimentColor(item.sentiment)}`}>
                            {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)} ({item.confidence || 85}%)
                          </span>
                          <span className="text-slate-400 text-xs">{formatTimestamp(item.timestamp)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setSelectedChannel(channel.id)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium py-2 px-4 rounded transition-colors"
                  >
                    View All Feedback →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeedbackDashboard;