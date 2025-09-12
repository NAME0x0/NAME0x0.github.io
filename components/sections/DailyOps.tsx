"use client";

import { useState, useEffect } from "react";

type Metric = {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "stable";
  icon: string;
  color: string;
  description: string;
};

export function DailyOps() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      label: "Lines of Code",
      value: 12847,
      unit: "LOC",
      trend: "up",
      icon: "💻",
      color: "text-electric",
      description: "Total codebase size"
    },
    {
      label: "Projects Active",
      value: 3,
      trend: "stable",
      icon: "🚀",
      color: "text-neonCyan",
      description: "Currently in development"
    },
    {
      label: "Coffee Consumed",
      value: "∞",
      icon: "☕",
      color: "text-orange-400",
      description: "Fuel for innovation"
    },
    {
      label: "Deploy Status",
      value: "✓ Live",
      trend: "up",
      icon: "🌐",
      color: "text-green-400",
      description: "Production ready"
    },
  ]);

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate live metric updates
    const metricsInterval = setInterval(() => {
      setMetrics(prev => prev.map(metric => {
        if (metric.label === "Lines of Code" && typeof metric.value === "number") {
          return {
            ...metric,
            value: metric.value + Math.floor(Math.random() * 5),
            trend: "up" as const
          };
        }
        return metric;
      }));
    }, 5000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(metricsInterval);
    };
  }, []);

  const tools = [
    { name: "Next.js", status: "active", usage: 95 },
    { name: "GSAP", status: "active", usage: 88 },
    { name: "Three.js", status: "active", usage: 76 },
    { name: "TailwindCSS", status: "active", usage: 92 },
  ];

  const recentCommits = [
    { message: "✨ Enhanced particle animations", time: "2h ago", branch: "feature/particles" },
    { message: "🎨 Updated holographic UI components", time: "4h ago", branch: "design/holo-ui" },
    { message: "🚀 Optimized Three.js performance", time: "6h ago", branch: "perf/webgl" },
  ];

  return (
    <div className="container mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h2 className="font-heading text-3xl md:text-5xl text-silver mb-4 animate-slide-up">
          Daily Operations
        </h2>
        <p className="text-silver/70 text-lg animate-fade-in">
          Real-time insights into the development workflow
        </p>
        <div className="mt-4 text-electric font-mono text-sm">
          Last updated: {currentTime.toLocaleTimeString()}
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {metrics.map((metric) => (
          <div key={metric.label} className="frame p-6 text-center animate-fade-in group hover:shadow-glow transition-shadow">
            <div className="flex items-center justify-center mb-3">
              <span className="text-3xl mr-2">{metric.icon}</span>
              {metric.trend && (
                <div className={`text-xs px-2 py-1 rounded-full ${
                  metric.trend === "up" ? "bg-green-500/20 text-green-400" :
                  metric.trend === "down" ? "bg-red-500/20 text-red-400" :
                  "bg-silver/20 text-silver"
                }`}>
                  {metric.trend === "up" ? "↗" : metric.trend === "down" ? "↘" : "→"}
                </div>
              )}
            </div>
            <div className={`font-heading text-2xl ${metric.color} mb-1`}>
              {metric.value}
              {metric.unit && <span className="text-sm text-silver/60 ml-1">{metric.unit}</span>}
            </div>
            <div className="text-electric font-medium text-sm mb-2">{metric.label}</div>
            <div className="text-silver/60 text-xs">{metric.description}</div>
          </div>
        ))}
      </div>

      {/* Development Tools */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="frame p-6">
          <h3 className="font-heading text-xl text-electric mb-4 flex items-center">
            <span className="mr-2">🛠️</span>
            Active Tools
          </h3>
          <div className="space-y-3">
            {tools.map((tool) => (
              <div key={tool.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse" />
                  <span className="text-silver">{tool.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gunmetal rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-electric to-neonCyan transition-all duration-1000"
                      style={{ width: `${tool.usage}%` }}
                    />
                  </div>
                  <span className="text-xs text-silver/60 w-8">{tool.usage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="frame p-6">
          <h3 className="font-heading text-xl text-electric mb-4 flex items-center">
            <span className="mr-2">📊</span>
            System Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-silver/80">Portfolio Uptime</span>
              <span className="text-green-400 font-mono">99.9%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-silver/80">Build Status</span>
              <span className="text-green-400">✓ Passing</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-silver/80">Performance Score</span>
              <span className="text-electric font-mono">98/100</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-silver/80">Last Deploy</span>
              <span className="text-neonCyan font-mono">12m ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="frame p-6">
        <h3 className="font-heading text-xl text-electric mb-6 flex items-center">
          <span className="mr-2">🔄</span>
          Recent Commits
        </h3>
        <div className="space-y-4">
          {recentCommits.map((commit, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gunmetal/30 rounded-lg border border-silver/10">
              <div className="flex-1">
                <div className="text-silver/90 font-mono text-sm">{commit.message}</div>
                <div className="text-silver/60 text-xs mt-1">{commit.branch}</div>
              </div>
              <div className="text-electric text-xs font-mono">{commit.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Focus */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-3 frame px-6 py-4">
          <div className="w-3 h-3 bg-electric rounded-full animate-pulse" />
          <span className="text-silver/80">Currently focused on:</span>
          <span className="text-electric font-medium">Enhancing holographic UI experiences</span>
        </div>
      </div>
    </div>
  );
}

