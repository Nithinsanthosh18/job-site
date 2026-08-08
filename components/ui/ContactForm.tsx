"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Wire this up to your email/API provider of choice.
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 900);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <input
          required
          placeholder="Your name"
          className="bg-white/5 border border-white/10 focus:border-solar-gold/60 rounded-lg px-4 py-3 text-sm outline-none transition-colors"
        />
        <input
          required
          type="email"
          placeholder="Email address"
          className="bg-white/5 border border-white/10 focus:border-solar-gold/60 rounded-lg px-4 py-3 text-sm outline-none transition-colors"
        />
      </div>
      <input
        placeholder="Subject"
        className="bg-white/5 border border-white/10 focus:border-solar-gold/60 rounded-lg px-4 py-3 text-sm outline-none transition-colors"
      />
      <textarea
        required
        rows={4}
        placeholder="Tell us about your project"
        className="bg-white/5 border border-white/10 focus:border-solar-gold/60 rounded-lg px-4 py-3 text-sm outline-none transition-colors resize-none"
      />
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={sending}
        className="justify-self-start rounded-full bg-gradient-to-r from-solar-orange to-solar-gold px-8 py-3 text-sm font-semibold text-void tracking-wide disabled:opacity-60"
      >
        {sent ? "Sent ✓" : sending ? "Sending…" : "Send Message"}
      </motion.button>
    </form>
  );
}
