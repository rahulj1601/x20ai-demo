"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale } from "@/lib/locale-context";
import { translations } from "@/lib/i18n";

function useAnimatedNumber(target: number, duration = 2000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

function BarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-24">
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-t transition-all duration-700" style={{ height: `${(v / max) * 100}%`, backgroundColor: color, opacity: 0.4 + (i / data.length) * 0.6 }} />
      ))}
    </div>
  );
}

export default function DashboardDemo() {
  const { locale } = useLocale();
  const t = translations[locale].dashboard;
  const common = translations[locale].common;

  const [liveCount, setLiveCount] = useState(847);
  const [responseTime, setResponseTime] = useState(1.2);

  const totalCalls = useAnimatedNumber(12847);
  const totalMessages = useAnimatedNumber(45293);
  const autoResolved = useAnimatedNumber(85);
  const satisfaction = useAnimatedNumber(97);

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
    { name: "Voice", pct: 35, color: "bg-primary" },
    { name: "WhatsApp", pct: 42, color: "bg-emerald-500" },
    { name: "Chatbot", pct: 23, color: "bg-amber-500" },
  ];

  const kpis = [
    { label: t.totalCalls, value: totalCalls.toLocaleString(), change: "+12.5%", icon: "phone", gradient: "from-[hsl(var(--primary))] to-[hsl(var(--accent))]" },
    { label: t.messagesHandled, value: totalMessages.toLocaleString(), change: "+18.3%", icon: "chat", gradient: "from-emerald-500 to-teal-600" },
    { label: t.autoResolved, value: `${autoResolved}%`, change: "+3.2%", icon: "check", gradient: "from-amber-500 to-orange-600" },
    { label: t.satisfaction, value: `${satisfaction}%`, change: "+1.8%", icon: "star", gradient: "from-pink-500 to-rose-600" },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs text-muted-foreground mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {t.badge}
            </div>
            <h1 className="text-3xl font-bold text-foreground">{t.pageTitle}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 text-success text-sm">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              {common.allSystemsOperational}
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-card border border-border text-sm text-muted-foreground">{common.last30Days}</div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpis.map((kpi, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${kpi.gradient} flex items-center justify-center`}>
                  {kpi.icon === "phone" && <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>}
                  {kpi.icon === "chat" && <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>}
                  {kpi.icon === "check" && <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  {kpi.icon === "star" && <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>}
                </div>
                <span className="text-xs text-success font-medium">{kpi.change}</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-foreground">{t.conversationVolume}</h3>
                <p className="text-xs text-muted-foreground mt-1">{t.conversationVolumeSubtitle}</p>
              </div>
            </div>
            <BarChart data={weeklyData} color="hsl(217, 91%, 60%)" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Mar 10</span><span>Mar 15</span><span>Mar 20</span><span>Today</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-6">{t.channelDistribution}</h3>
            <div className="space-y-4">
              {channelData.map((ch, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-foreground">{ch.name}</span>
                    <span className="font-semibold text-foreground">{ch.pct}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-secondary">
                    <div className={`h-full rounded-full ${ch.color} transition-all duration-1000`} style={{ width: `${ch.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{t.liveConversations}</span>
                <span className="text-lg font-bold text-success">{liveCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t.avgResponseTime}</span>
                <span className="text-lg font-bold text-foreground">{responseTime}s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">{t.liveConversationsTitle}</h3>
              <span className="flex items-center gap-1.5 text-xs text-success">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                {common.live}
              </span>
            </div>
            <div className="divide-y divide-border/50">
              {t.conversations.map((conv, i) => (
                <div key={i} className="px-6 py-3 flex items-center gap-4 hover:bg-secondary/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {conv.name.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{conv.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        conv.channel === "Voice" ? "bg-primary/10 text-primary" :
                        conv.channel === "WhatsApp" ? "bg-emerald-500/10 text-emerald-400" :
                        "bg-amber-500/10 text-amber-400"
                      }`}>{conv.channel}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{conv.topic}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-medium ${conv.status === "Active" ? "text-success" : conv.status === "Resolved" ? "text-primary" : "text-amber-400"}`}>{conv.status}</div>
                    <div className="text-xs text-muted-foreground">{conv.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground">{t.recentActivity}</h3>
            </div>
            <div className="px-6 py-2">
              {t.activities.map((act, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border/50 last:border-0 animate-fade-in-up">
                  <div className={`w-2 h-2 rounded-full ${act.status === "success" ? "bg-success" : act.status === "info" ? "bg-primary" : "bg-amber-400"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-foreground">{act.label}</div>
                    <div className="text-xs text-muted-foreground">{act.value}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{act.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROI Summary */}
        <div className="mt-6 rounded-xl border border-primary/30 bg-gradient-to-r from-[hsl(var(--primary)/0.05)] to-[hsl(var(--accent)/0.05)] p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg text-foreground">{t.roiSummary}</h3>
              <p className="text-sm text-muted-foreground">{t.roiSubtitle}</p>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">162h</div>
                <div className="text-xs text-muted-foreground">{t.timeSaved}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">&euro;8,430</div>
                <div className="text-xs text-muted-foreground">{t.costSaved}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">5.6x</div>
                <div className="text-xs text-muted-foreground">{t.roiMultiple}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
