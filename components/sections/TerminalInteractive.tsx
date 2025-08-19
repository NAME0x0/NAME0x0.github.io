"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap/gsapClient";

type Entry = { 
  id: number; 
  text: string; 
  type: "command" | "response" | "system" | "error";
  timestamp?: string;
};

export function TerminalInteractive() {
  const [history, setHistory] = useState<Entry[]>([
    { 
      id: 0, 
      text: "AVA Terminal v2.4.1 - AI Command Center initialized", 
      type: "system",
      timestamp: new Date().toLocaleTimeString()
    },
    { id: 1, text: "Type 'help' to see available commands", type: "system" },
  ]);
  const [value, setValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new entries are added
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  function typeResponse(text: string, type: "response" | "error" = "response"): Promise<void> {
    return new Promise((resolve) => {
      setIsTyping(true);
      let displayText = "";
      let i = 0;
      
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          displayText += text[i];
          setHistory(h => {
            const newHistory = [...h];
            const lastEntry = newHistory[newHistory.length - 1];
            if (lastEntry && lastEntry.type === type) {
              lastEntry.text = displayText + (i < text.length - 1 ? "_" : "");
            } else {
              newHistory.push({
                id: h.length + 1,
                text: displayText + "_",
                type,
                timestamp: new Date().toLocaleTimeString()
              });
            }
            return newHistory;
          });
          i++;
        } else {
          clearInterval(typeInterval);
          setHistory(h => {
            const newHistory = [...h];
            const lastEntry = newHistory[newHistory.length - 1];
            if (lastEntry) lastEntry.text = text;
            return newHistory;
          });
          setIsTyping(false);
          resolve();
        }
      }, 30);
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input = value.trim();
    if (!input || isTyping) return;

    // Add command to history
    setHistory(h => [...h, { 
      id: h.length + 1, 
      text: `$ ${input}`, 
      type: "command",
      timestamp: new Date().toLocaleTimeString()
    }]);
    setValue("");

    // Process command with typing effect
    const response = await handleCommand(input);
    await typeResponse(response.text, response.type);
  }

  async function handleCommand(input: string): Promise<{ text: string; type: "response" | "error" }> {
    const cmd = input.toLowerCase().trim();
    
    switch (cmd) {
      case "help":
        return {
          text: `Available Commands:
┌─────────────────────────────────────────┐
│ Navigation: skills, projects, contact   │
│ Info: about, whoami, status, time       │
│ Fun: matrix, easter, quote, joke        │
│ System: clear, theme, version           │
│ AVA: ava help, ava status               │
└─────────────────────────────────────────┘`,
          type: "response"
        };

      case "about":
      case "whoami":
        return {
          text: `Muhammad Afsah Mumtaz (NAME0x0)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌍 Global Perspective: 6 countries, 2 continents
🤖 AI Developer & Creative Technologist  
🎯 Building tomorrow's tech today
📍 Currently: Dubai, UAE
🔗 contact@name0x0.dev`,
          type: "response"
        };

      case "skills":
        return {
          text: `Core Superpowers:
🧠 AI/ML      ████████████████████ 92%
⚡ Frontend   ████████████████████ 95%  
🚀 Backend    ████████████████████ 88%

Run 'scroll skills' to see the interactive version.`,
          type: "response"
        };

      case "projects":
        return {
          text: `Featured Projects:
• AVA - AI Guided Portfolio Experience [2024]
• Holographic UI - WebGL Interface Experiments [2024]  
• Neural Canvas - AI-Powered Creative Platform [2023]

Run 'scroll projects' for cinematic view.`,
          type: "response"
        };

      case "contact":
        return {
          text: `Contact Channels:
📧 Email: contact@name0x0.dev
🌐 Portfolio: https://name0x0.is-a.dev
💬 AVA: Ask our AI assistant anything!

Run 'scroll contact' to access the holographic contact card.`,
          type: "response"
        };

      case "status":
        return {
          text: `System Status:
┌─────────────────────────────────────────┐
│ 🟢 Portfolio: Online                   │
│ 🟢 AVA AI: Ready                       │
│ 🟢 WebGL: Accelerated                  │
│ 🟢 Animations: 60fps                   │
│ 🔄 Last Update: ${new Date().toLocaleDateString()} │
└─────────────────────────────────────────┘`,
          type: "response"
        };

      case "time":
        return {
          text: `Current Time: ${new Date().toLocaleString()}
Time Zone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
Uptime: Portfolio has been running flawlessly! ⚡`,
          type: "response"
        };

      case "matrix":
        return {
          text: `Wake up, Neo...
The Matrix has you...
Follow the white rabbit 🐰

01001000 01100101 01101100 01101100 01101111`,
          type: "response"
        };

      case "easter":
        return {
          text: `🥚 Easter Egg Found! 
Congratulations, digital explorer!
You've unlocked the secret dev console.
AVA says: "Keep exploring, there are more secrets..." ✨`,
          type: "response"
        };

      case "quote":
        const quotes = [
          "\"The future belongs to those who believe in the beauty of their dreams.\" - Eleanor Roosevelt",
          "\"Innovation distinguishes between a leader and a follower.\" - Steve Jobs",
          "\"The best way to predict the future is to create it.\" - Peter Drucker",
          "\"Technology is best when it brings people together.\" - Matt Mullenweg"
        ];
        return {
          text: quotes[Math.floor(Math.random() * quotes.length)],
          type: "response"
        };

      case "joke":
        const jokes = [
          "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
          "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
          "Why don't programmers like nature? It has too many bugs! 🌲",
          "There are only 10 types of people: those who understand binary and those who don't! 😄"
        ];
        return {
          text: jokes[Math.floor(Math.random() * jokes.length)],
          type: "response"
        };

      case "clear":
        setHistory([{ 
          id: 0, 
          text: "Terminal cleared. Welcome back! 👋", 
          type: "system" 
        }]);
        return { text: "", type: "response" };

      case "theme":
        return {
          text: `Current Theme: Obsidian Cyber
Colors: Electric Blue (#0FF0FC) on Obsidian Black (#0A0A0A)
Typography: Space Grotesk + Inter
Note: Theme switching coming soon! 🎨`,
          type: "response"
        };

      case "version":
        return {
          text: `Portfolio Version: 2.4.1
Framework: Next.js 14
Powered by: GSAP, Three.js, TailwindCSS
AI: AVA Assistant v1.0
Build: Production Optimized ⚡`,
          type: "response"
        };

      case "ava help":
        return {
          text: `AVA AI Assistant:
🤖 I'm your personal portfolio guide!
💬 Click the AVA button to start chatting
🎯 I can help you navigate and learn about Afsah's work
🚀 Currently in beta - more features coming soon!`,
          type: "response"
        };

      case "ava status":
        return {
          text: `AVA Status: 
🟢 Online and ready to help!
🧠 AI Model: GPT-powered conversation engine
💡 Context: Portfolio-aware responses
🔄 Learning from every interaction...`,
          type: "response"
        };

      // Hidden Easter eggs
      case "konami":
      case "up up down down left right left right b a":
        return {
          text: `🎮 KONAMI CODE ACTIVATED! 
⭐ You've unlocked developer mode!
Secret developer tools are now available...
Try: 'dev mode', 'matrix rain', 'hack'`,
          type: "response"
        };

      case "dev mode":
        return {
          text: `🔧 Developer Mode: ACTIVATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Debug Tools:
• inspect - View portfolio stats
• performance - Check rendering metrics  
• secret - Access hidden commands
• glitch - Enable visual effects
• god mode - Unlock all features`,
          type: "response"
        };

      case "matrix rain":
        // Trigger matrix rain effect
        setTimeout(() => {
          const matrixChars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01";
          const lines = Array.from({ length: 20 }, () => 
            Array.from({ length: 40 }, () => 
              matrixChars[Math.floor(Math.random() * matrixChars.length)]
            ).join("")
          );
          setHistory(h => [...h, {
            id: h.length + 1,
            text: lines.join("\n"),
            type: "response"
          }]);
        }, 500);
        return {
          text: `Initializing Matrix Rain... 🌧️`,
          type: "response"
        };

      case "hack":
        return {
          text: `🚨 HACKING INITIATED...
[████████████████████████████████] 100%
> Accessing mainframe...
> Bypassing firewalls...
> Downloading internet...
> ERROR: Too much awesome detected!
> HACK COMPLETE: You are now a certified digital wizard! 🧙‍♂️`,
          type: "response"
        };

      case "glitch":
        return {
          text: `G̷L̷I̷T̷C̷H̷ ̷M̷O̷D̷E̷ ̷A̷C̷T̷I̷V̷A̷T̷E̷D̷
R̸E̸A̸L̸I̸T̸Y̸.̸E̸X̸E̸ ̸H̸A̸S̸ ̸S̸T̸O̸P̸P̸E̸D̸ ̸W̸O̸R̸K̸I̸N̸G̸
N̴O̴T̴H̴I̴N̴G̴ ̴I̴S̴ ̴R̴E̴A̴L̴.̴.̴.̴
J̵U̵S̵T̵ ̵K̵I̵D̵D̵I̵N̵G̵!̵ ̵😄`,
          type: "response"
        };

      case "god mode":
        return {
          text: `⚡ GOD MODE: ENABLED ⚡
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌟 Infinite creativity: ∞
🚀 Performance: MAX
🧠 AI power: UNLIMITED  
🎨 Design skills: LEGENDARY
🔮 Future vision: ACTIVATED
💫 Portfolio awesomeness: OVER 9000!

You are now unstoppable! 🦾`,
          type: "response"
        };

      case "inspect":
        return {
          text: `📊 Portfolio Inspection Report:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lines of Code: 15,847
Components: 23
Animations: 47
Easter Eggs: ${Math.floor(Math.random() * 10) + 5}
Coffee consumed: ☕☕☕☕☕☕☕☕ (Too much)
Performance: S-Tier 🏆`,
          type: "response"
        };

      case "secret":
        return {
          text: `🤫 Secret Commands Unlocked:
• 'teleport' - Travel through sections
• 'wizard' - Become a coding wizard
• 'nuke' - Delete the internet (just kidding!)
• 'time travel' - Go back to the 90s
• '42' - The answer to everything`,
          type: "response"
        };

      case "teleport":
        const sections = ["prologue", "skills", "projects", "global", "ops", "contact"];
        const randomSection = sections[Math.floor(Math.random() * sections.length)];
        // Actually scroll to the section
        setTimeout(() => {
          document.getElementById(randomSection)?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 1000);
        return {
          text: `🌀 Teleporting to ${randomSection} section...
Engaging quantum navigation systems...
Destination reached! ✨`,
          type: "response"
        };

      case "wizard":
        return {
          text: `🧙‍♂️ TRANSFORMATION COMPLETE!
You are now a Level 99 Code Wizard!
Your powers include:
• Debugging with your eyes closed
• Writing perfect code on the first try  
• Understanding CSS without crying
• Making JavaScript behave logically
• Converting coffee directly into code`,
          type: "response"
        };

      case "42":
        return {
          text: `🌌 The Answer to Life, Universe, and Everything: 42
But what was the question?
"What do you get when you multiply six by nine?"
Wait... that's not right... 🤔
Maybe the real answer was the code we wrote along the way! 💫`,
          type: "response"
        };

      case "time travel":
        return {
          text: `⏰ Time Travel Initiated...
Destination: 1995
Loading dial-up sounds... 📞
▓▓▓░░░░░░░ [33%] BEEP BOOP SCREECH
Welcome to the World Wide Web!
Error: Y2K bug detected. Returning to present... 🚀`,
          type: "response"
        };

      case "nuke":
        return {
          text: `💥 NUCLEAR LAUNCH DETECTED!
Target: The Internet
⚠️  WARNING: This action cannot be undone!
Just kidding! 😄 I'm not that powerful...
(Yet... 😈)`,
          type: "response"
        };

      default:
        if (cmd.startsWith("scroll ")) {
          const section = cmd.replace("scroll ", "");
          // Actually scroll to the section
          setTimeout(() => {
            const element = document.getElementById(section);
            if (element) {
              element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }
          }, 1000);
          return {
            text: `🚀 Scrolling to ${section} section...
Navigation systems engaged! ✨`,
            type: "response"
          };
        }
        
        // Check for partial matches and suggest
        const commands = ["help", "about", "skills", "projects", "contact", "matrix", "easter", "konami", "hack"];
        const suggestions = commands.filter(cmd => cmd.includes(input.toLowerCase()) || input.toLowerCase().includes(cmd));
        
        if (suggestions.length > 0) {
          return {
            text: `Command not found: ${input}
Did you mean: ${suggestions.join(", ")}?
Type 'help' for all available commands. 💡`,
            type: "error"
          };
        }
        
        return {
          text: `Command not found: ${input}
Type 'help' for available commands.
💡 Tip: Try some hidden commands like 'konami' or 'hack'!`,
          type: "error"
        };
    }
  }

  return (
    <div className="container mx-auto px-6 py-24">
      <div className="text-center mb-12">
        <h2 className="font-heading text-3xl md:text-5xl text-silver mb-4 animate-slide-up">
          AI Command Center
        </h2>
        <p className="text-silver/70 text-lg animate-fade-in">
          Interactive terminal powered by AVA intelligence
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="rounded-xl border border-electric/20 bg-gradient-to-br from-obsidian/90 to-gunmetal/50 backdrop-blur-sm shadow-holo animate-fade-in">
          {/* Terminal header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-electric/20 bg-obsidian/40">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <div className="text-silver/60 text-sm font-mono">
              terminal@name0x0:~$
            </div>
            <div className="text-silver/40 text-xs">
              {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Terminal content */}
          <div 
            ref={terminalRef}
            className="p-4 font-mono text-sm text-silver max-h-96 overflow-y-auto custom-scrollbar"
          >
            {history.map((entry) => (
              <div 
                key={entry.id} 
                className={`mb-1 ${
                  entry.type === "command" ? "text-electric" :
                  entry.type === "error" ? "text-red-400" :
                  entry.type === "system" ? "text-neonCyan" :
                  "text-silver/90"
                }`}
              >
                <span className="whitespace-pre-wrap">{entry.text}</span>
                {entry.timestamp && entry.type === "system" && (
                  <span className="text-silver/40 ml-2 text-xs">
                    [{entry.timestamp}]
                  </span>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="text-silver/60">
                <span className="animate-pulse">●</span> AVA is typing...
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={onSubmit} className="p-4 border-t border-electric/20">
            <div className="flex items-center gap-2">
              <span className="text-electric font-mono">$</span>
              <input
                ref={inputRef}
                className="flex-1 bg-transparent outline-none placeholder:text-silver/40 font-mono text-silver"
                placeholder="Type a command and press Enter..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={isTyping}
              />
              {isTyping && (
                <div className="text-silver/40 text-sm">
                  Processing...
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Quick commands */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {["help", "about", "skills", "projects", "easter"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => setValue(cmd)}
              className="px-3 py-1 bg-gunmetal/40 text-silver/70 rounded border border-silver/10 hover:border-electric/30 hover:text-electric transition-colors text-sm font-mono"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

