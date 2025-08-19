"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const holoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    const holo = holoRef.current;
    if (!card || !holo) return;

    const ctx = gsap.context(() => {
      // Floating animation
      gsap.to(card, {
        y: "+=10",
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Holographic scan effect
      gsap.to(holo, {
        backgroundPosition: "200% 0",
        duration: 3,
        ease: "none",
        repeat: -1,
      });

      // Mouse move effect
      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        gsap.to(card, {
          rotationX: rotateX,
          rotationY: rotateY,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      };

      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      };
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="container mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h2 className="font-heading text-3xl md:text-5xl text-silver mb-4 animate-slide-up">
          Let's Create Something Extraordinary
        </h2>
        <p className="text-silver/70 text-lg animate-fade-in max-w-2xl mx-auto">
          Ready to bring your vision to life? Reach out for AI-powered solutions, 
          cinematic web experiences, or thought leadership collaborations.
        </p>
      </div>

      <div className="max-w-4xl mx-auto" style={{ perspective: "1000px" }}>
        <div 
          ref={cardRef}
          className="relative bg-gradient-to-br from-gunmetal/60 via-obsidian/80 to-gunmetal/40 backdrop-blur-xl rounded-2xl border border-electric/30 shadow-holo overflow-hidden"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Holographic scan overlay */}
          <div 
            ref={holoRef}
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(15,240,252,0.2), transparent)",
              backgroundSize: "200% 100%",
              backgroundPosition: "-200% 0",
            }}
          />

          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(15,240,252,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(15,240,252,0.3) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />

          <div className="relative z-10 p-8 md:p-12">
            {!submitted ? (
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Contact Info */}
                <div className="space-y-8">
                  <div>
                    <h3 className="font-heading text-2xl text-electric mb-6">
                      Multiple Ways to Connect
                    </h3>
                    <div className="space-y-4">
                      <a 
                        href="mailto:m.afsah.279@gmail.com"
                        className="flex items-center group hover:text-electric transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-electric/20 flex items-center justify-center mr-4 group-hover:bg-electric/30 transition-colors">
                          <span className="text-electric">📧</span>
                        </div>
                        <div>
                          <div className="text-silver font-medium">Email</div>
                          <div className="text-silver/70 text-sm">m.afsah.279@gmail.com</div>
                        </div>
                      </a>

                      <div className="flex items-center group">
                        <div className="w-10 h-10 rounded-full bg-electric/20 flex items-center justify-center mr-4">
                          <span className="text-electric">🌍</span>
                        </div>
                        <div>
                          <div className="text-silver font-medium">Location</div>
                          <div className="text-silver/70 text-sm">Dubai, UAE (UTC+4)</div>
                        </div>
                      </div>

                      <div className="flex items-center group">
                        <div className="w-10 h-10 rounded-full bg-electric/20 flex items-center justify-center mr-4">
                          <span className="text-electric">🤖</span>
                        </div>
                        <div>
                          <div className="text-silver font-medium">AVA Assistant</div>
                          <div className="text-silver/70 text-sm">Click the AVA button for instant help</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h4 className="font-heading text-lg text-electric mb-4">Find Me Online</h4>
                    <div className="flex gap-4">
                      {[
                        { name: "GitHub", icon: "🔗", url: "https://github.com/NAME0x0" },
                        { name: "LinkedIn", icon: "💼", url: "https://www.linkedin.com/in/muhammad-afsah-mumtaz" },
                        { name: "Twitter", icon: "🐦", url: "https://twitter.com/NAME0X0_0" },
                      ].map((social) => (
                        <a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-lg bg-gunmetal/40 border border-silver/20 flex items-center justify-center hover:border-electric/60 hover:bg-electric/10 transition-all duration-300 group"
                        >
                          <span className="group-hover:scale-110 transition-transform">
                            {social.icon}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-silver mb-2 font-medium">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-obsidian/60 border border-silver/20 rounded-lg text-silver placeholder:text-silver/40 focus:border-electric/60 focus:outline-none transition-colors"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-silver mb-2 font-medium">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-obsidian/60 border border-silver/20 rounded-lg text-silver placeholder:text-silver/40 focus:border-electric/60 focus:outline-none transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-silver mb-2 font-medium">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 bg-obsidian/60 border border-silver/20 rounded-lg text-silver placeholder:text-silver/40 focus:border-electric/60 focus:outline-none transition-colors resize-none"
                        placeholder="Tell me about your project..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full cta disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <span className="text-lg">🚀</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-electric/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">✨</span>
                </div>
                <h3 className="font-heading text-2xl text-electric mb-4">
                  Message Sent Successfully!
                </h3>
                <p className="text-silver/80 mb-6">
                  Thank you for reaching out. I'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", message: "" });
                  }}
                  className="cta"
                >
                  Send Another Message
                </button>
              </div>
            )}
          </div>

          {/* Corner accents */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-electric/40" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-electric/40" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-electric/40" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-electric/40" />
        </div>
      </div>

      {/* AVA Integration Hint */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-3 frame px-6 py-4">
          <div className="w-3 h-3 bg-electric rounded-full animate-pulse" />
          <span className="text-silver/80">Quick questions?</span>
          <span className="text-electric font-medium">Ask AVA for instant assistance</span>
        </div>
      </div>
    </div>
  );
}

