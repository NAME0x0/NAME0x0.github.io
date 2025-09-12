"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export function AvaChat() {
  const [open, setOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // Floating animation for the button
    gsap.to(button, {
      y: "+=3",
      duration: 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Pulse glow effect
    gsap.to(button, {
      boxShadow: "0 0 20px rgba(15, 240, 252, 0.3), 0 0 40px rgba(15, 240, 252, 0.1)",
      duration: 1.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (open) {
      gsap.fromTo(
        panel,
        {
          opacity: 0,
          scale: 0.9,
          y: 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        }
      );
    }
  }, [open]);

  const handleToggle = () => {
    if (open) {
      const panel = panelRef.current;
      if (panel) {
        gsap.to(panel, {
          opacity: 0,
          scale: 0.9,
          y: 20,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => setOpen(false),
        });
      } else {
        setOpen(false);
      }
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      {/* AVA Button */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-50 group"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="ava-chat-panel"
      >
        <div className="relative">
          {/* Main button */}
          <div className="cta px-6 py-4 rounded-2xl shadow-glow hover:shadow-holo transition-all duration-300 group-hover:scale-105">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-obsidian flex items-center justify-center">
                  <span className="text-electric font-bold text-sm">AVA</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-obsidian">AI Assistant</div>
                <div className="text-xs text-obsidian/70">Always ready to help</div>
              </div>
            </div>
          </div>

          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-2xl border-2 border-electric/30 animate-ping" />
        </div>
      </button>

      {/* Chat Panel */}
      {open && (
        <div
          ref={panelRef}
          id="ava-chat-panel"
          role="dialog"
          aria-label="AVA Chatbot"
          className="fixed bottom-32 right-6 z-50 w-[380px] max-w-[90vw]"
        >
          <div className="frame-strong backdrop-blur-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-electric/20 bg-gradient-to-r from-electric/10 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-electric/20 flex items-center justify-center">
                      <span className="text-electric font-bold">A</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-gunmetal" />
                  </div>
                  <div>
                    <div className="font-heading text-electric font-semibold">AVA</div>
                    <div className="text-xs text-silver/60">AI Portfolio Guide</div>
                  </div>
                </div>
                <button 
                  onClick={handleToggle} 
                  className="text-silver/70 hover:text-electric transition-colors w-8 h-8 rounded-full hover:bg-electric/10 flex items-center justify-center"
                  aria-label="Close chat"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="p-4 space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
              {/* Welcome message */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-electric/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-electric text-sm font-bold">A</span>
                </div>
                <div className="space-y-2">
                  <div className="glass-subtle rounded-lg p-3">
                    <p className="text-silver/90 text-sm leading-relaxed">
                      Hello! I'm AVA, your AI guide through Afsah's portfolio. 
                      I can help you explore his skills, projects, and experience.
                    </p>
                  </div>
                  <div className="text-xs text-silver/50">Just now</div>
                </div>
              </div>

              {/* Feature preview */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-electric/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-electric text-sm font-bold">A</span>
                </div>
                <div className="space-y-2">
                  <div className="glass-subtle rounded-lg p-3 border border-electric/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
                      <span className="text-xs font-medium text-warning uppercase tracking-wide">
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-silver/80 text-sm">
                      Real-time AI conversations, contextual guidance, and interactive portfolio tours.
                    </p>
                  </div>
                  <div className="text-xs text-silver/50">Preview</div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="pt-2">
                <div className="text-xs text-silver/60 mb-3 uppercase tracking-wide">Quick Actions</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: "💼", label: "View Projects", action: "projects" },
                    { icon: "⚡", label: "See Skills", action: "skills" },
                    { icon: "🌍", label: "Global Journey", action: "global" },
                    { icon: "💬", label: "Contact Info", action: "contact" },
                  ].map((item) => (
                    <button
                      key={item.action}
                      className="p-3 glass-subtle rounded-lg hover:border-electric/30 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm text-silver/80 group-hover:text-electric transition-colors">
                          {item.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-electric/20 bg-gradient-to-t from-electric/5 to-transparent">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Ask me anything about Afsah's work..."
                  className="input-field flex-1 text-sm"
                  disabled
                />
                <button className="cta-ghost px-4 py-2 rounded-lg">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <div className="text-xs text-silver/50 mt-2 text-center">
                Full AI integration coming soon
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

