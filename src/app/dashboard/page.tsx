"use client";

import { useState, useEffect, useCallback } from "react";

// Animated counter hook
function useAnimatedNumber(target: number, duration: number = 2000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

// Mini bar chart component
function BarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t transition-all duration-500"
          style={{
            height: `${(v / max) * 100}%`,
            backgroundColor: color,
            opacity: 0.4 + (i / data.length) * 0.6,
            animationDelay: `${i * 50}ms`,
          }}
        />
      ))}
    </div>
  );
}

// Activity line
function ActivityLine({ label, value, time, status }: { label: string; value: string; time: string; status: "success" | "info" | "warning" }) {
  const colors = {
    success: "bg-[var(--success)]",
    info: "bg-[var(--accent)]",
    warning: "bg-amber-400",
  };
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[var(--border)]/50 last:border-0 animate-fade-in-up">
      <div className={`w-2 h-2 rounded-full ${colors[status]}`} />
      <div className="flex-1 min-w-0">
        <div className="text-sm truncate">{label}</div>
        <div className="text-xs text-[var(--muted)]">{value}</div>
      </div>
      <div className="text-xs text-[var(--muted)]">{time}</div>
    </div>
  );
}

// Fake live conversations
const LIVE_CONVERSATIONS = [
  { name: "Maria S.", channel: "WhatsApp", status: "Active", duration: "2m 14s", topic: "Pricing inquiry" },
  { name: "Thomas K.", channel: "Voice", status: "Active", duration: "4m 32s", topic: "Integration setup" },
  { name: "Anna P.", channel: "Chatbot", status: "Resolved", duration: "1m 45s", topic: "GDPR compliance" },
  { name: "Jan de V.", channel: "WhatsApp", status: "Active", duration: "0m 58s", topic: "Demo request" },
  { name: "Carlos R.", channel: "Voice", status: "Queued", duration: "0m 12s", topic: "Technical support" },
  { name: "Sophie L.", channel: "Chatbot", status: "Resolved", duration: "3m 21s", topic: "Onboarding help" },
];

export default function DashboardDemo() {
  const [liveCount, setLiveCount] = useState(847);
  const [responseTime, setResponseTime] = useState(1.2);

  const totalCalls = useAnimatedNumber(12847);
  const totalMessages = useAnimatedNumber(45293);
  const autoResolved = useAnimatedNumber(85);
  const satisfaction = useAnimatedNumber(97);

  // Simulate live updates
  const updateLive = useCallback(() => {
    setLiveCount((c) => c + Math.floor(Math.random() * 3) - 1);
    setResponseTime(+(1.1 + Math.random() * 0.4).toFixed(1));
  }, []);

  useEffect(() => {
    const interval = setInterval(updateLive, 3000);
    return () => clearInterval(interval);
  }, [updateLive]);

  const weeklyData = [34, 45, 52, 38, 65, 72, 58, 80, 67, 91, 74, 85];
  const channelData = [
    { name: "Voice", pct: 35, color: "bg-indigo-500" },
    { name: "WhatsApp", pct: 42, color: "bg-emerald-500" },
    { name: "Chatbot", pct: 23, color: "bg-amber-500" },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--muted)] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Dashboard Demo
            </div>
            <h1 className="text-3xl font-bold">Agent Performance</h1>
            <p className="text-[var(--muted)] text-sm mt-1">Real-time metrics across all x20ai agents</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--success)]/10 text-[var(--success)] text-sm">
              <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
              All systems operational
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--muted)]">
              Last 30 days
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Calls", value: totalCalls.toLocaleString(), change: "+12.5%", icon: "phone", color: "from-indigo-500 to-purple-600" },
            { label: "Messages Handled", value: totalMessages.toLocaleString(), change: "+18.3%", icon: "chat", color: "from-emerald-500 to-teal-600" },
            { label: "Auto-Resolved", value: `${autoResolved}%`, change: "+3.2%", icon: "check", color: "from-amber-500 to-orange-600" },
            { label: "Satisfaction", value: `${satisfaction}%`, change: "+1.8%", icon: "star", color: "from-pink-500 to-rose-600" },
          ].map((kpi, i) => (
            <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--accent)]/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                  {kpi.icon === "phone" && <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>}
                  {kpi.icon === "chat" && <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>}
                  {kpi.icon === "check" && <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  {kpi.icon === "star" && <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>}
                </div>
                <span className="text-xs text-[var(--success)] font-medium">{kpi.change}</span>
              </div>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="text-xs text-[var(--muted)] mt-1">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Conversation Volume Chart */}
          <div className="lg:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold">Conversation Volume</h3>
                <p className="text-xs text-[var(--muted)] mt-1">Daily conversations across all channels</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[var(--accent)]" />
                  This period
                </span>
              </div>
            </div>
            <BarChart data={weeklyData} color="var(--accent)" />
            <div className="flex justify-between mt-2 text-xs text-[var(--muted)]">
              <span>Mar 10</span>
              <span>Mar 15</span>
              <span>Mar 20</span>
              <span>Today</span>
            </div>
          </div>

          {/* Channel Distribution */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h3 className="font-semibold mb-6">Channel Distribution</h3>
            <div className="space-y-4">
              {channelData.map((ch, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span>{ch.name}</span>
                    <span className="font-semibold">{ch.pct}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[var(--surface-light)]">
                    <div
                      className={`h-full rounded-full ${ch.color} transition-all duration-1000`}
                      style={{ width: `${ch.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--border)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--muted)]">Live conversations</span>
                <span className="text-lg font-bold text-[var(--success)]">{liveCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted)]">Avg response time</span>
                <span className="text-lg font-bold">{responseTime}s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Live Conversations */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <h3 className="font-semibold">Live Conversations</h3>
              <span className="flex items-center gap-1.5 text-xs text-[var(--success)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                Live
              </span>
            </div>
            <div className="divide-y divide-[var(--border)]/50">
              {LIVE_CONVERSATIONS.map((conv, i) => (
                <div key={i} className="px-6 py-3 flex items-center gap-4 hover:bg-[var(--surface-light)] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[var(--surface-light)] flex items-center justify-center text-xs font-bold text-[var(--muted)]">
                    {conv.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{conv.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        conv.channel === "Voice" ? "bg-indigo-500/10 text-indigo-400" :
                        conv.channel === "WhatsApp" ? "bg-emerald-500/10 text-emerald-400" :
                        "bg-amber-500/10 text-amber-400"
                      }`}>
                        {conv.channel}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--muted)]">{conv.topic}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-medium ${
                      conv.status === "Active" ? "text-[var(--success)]" :
                      conv.status === "Resolved" ? "text-[var(--accent-light)]" :
                      "text-amber-400"
                    }`}>
                      {conv.status}
                    </div>
                    <div className="text-xs text-[var(--muted)]">{conv.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border)]">
              <h3 className="font-semibold">Recent Activity</h3>
            </div>
            <div className="px-6 py-2">
              <ActivityLine
                label="Voice agent resolved billing inquiry"
                value="Customer: Thomas K. - Duration: 3m 12s"
                time="2m ago"
                status="success"
              />
              <ActivityLine
                label="WhatsApp lead qualified and appointment booked"
                value="Lead: Maria S. - Booked for Thursday 2pm"
                time="5m ago"
                status="success"
              />
              <ActivityLine
                label="New integration connected: HubSpot CRM"
                value="Auto-sync enabled for contacts and deals"
                time="12m ago"
                status="info"
              />
              <ActivityLine
                label="Chatbot escalated to human agent"
                value="Complex technical query - Ticket #4821"
                time="18m ago"
                status="warning"
              />
              <ActivityLine
                label="Voice agent handled 3 simultaneous calls"
                value="All resolved - Avg duration: 2m 45s"
                time="25m ago"
                status="success"
              />
              <ActivityLine
                label="Daily report generated"
                value="847 conversations, 97% satisfaction score"
                time="1h ago"
                status="info"
              />
              <ActivityLine
                label="WhatsApp campaign completed"
                value="1,200 messages sent - 68% open rate"
                time="2h ago"
                status="success"
              />
            </div>
          </div>
        </div>

        {/* ROI Summary */}
        <div className="mt-6 rounded-xl border border-[var(--accent)]/30 bg-gradient-to-r from-[var(--accent)]/5 to-purple-600/5 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg">ROI Summary</h3>
              <p className="text-sm text-[var(--muted)]">Based on 30-day agent performance</p>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--success)]">162h</div>
                <div className="text-xs text-[var(--muted)]">Time Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--accent-light)]">€8,430</div>
                <div className="text-xs text-[var(--muted)]">Cost Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">5.6x</div>
                <div className="text-xs text-[var(--muted)]">ROI Multiple</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
