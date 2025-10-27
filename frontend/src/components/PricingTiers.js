import React from "react";
import { useNavigate } from "react-router-dom";

export default function PricingTiers() {
  const navigate = useNavigate();

  return (
    <section aria-labelledby="pricing" className="w-full py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 id="pricing" className="text-center text-3xl font-extrabold tracking-tight text-white">
          PLANS THAT <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">SCALE WITH YOU.</span>
        </h2>
        <p className="mt-3 text-center text-sm text-neutral-400">
          Whether you're optimizing one business or a full client portfolio, SAGE adapts to your goals.
        </p>

        {/* Cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Free */}
          <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg ring-1 ring-black/5 backdrop-blur">
            <h3 className="text-lg font-semibold text-white">Free</h3>
            <p className="mt-1 text-xs text-neutral-400">SEO Audit only</p>
            <div className="mt-6 text-4xl font-extrabold text-white">$0</div>
            <button 
              onClick={() => navigate('/audit')}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
              data-testid="free-plan-cta"
            >
              Run Free Audit
            </button>
          </div>

          {/* PRO — Recommended */}
          <div className="relative rounded-2xl border border-emerald-400/40 bg-white/5 p-6 shadow-2xl backdrop-blur
                          ring-1 ring-emerald-400/30 scale-105 lg:scale-105 z-10">
            {/* badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 select-none">
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-400/40">
                Recommended
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white">SAGE Pro</h3>
            <p className="mt-1 text-xs text-neutral-400">SEO + AEO Optimization</p>
            <div className="mt-6 text-4xl font-extrabold text-white">$99<span className="text-sm font-semibold text-neutral-400">/mo</span></div>
            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
              <li>Unlimited Website Audits</li>
              <li>Full SEO + AEO + GEO Reports</li>
              <li>Historical Analytics Dashboard</li>
              <li>AI Optimization Suggestions</li>
              <li>Export to PDF + JSON</li>
            </ul>
            <button 
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 px-4 py-2 text-sm font-semibold text-black hover:opacity-90 transition"
              data-testid="pro-plan-cta"
            >
              Upgrade to Pro
            </button>
          </div>

          {/* GEO (de-emphasized vs Pro) */}
          <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
            <h3 className="text-lg font-semibold text-white">SAGE GEO</h3>
            <p className="mt-1 text-xs text-neutral-400">SEO + AEO + GEO</p>
            <div className="mt-6 text-4xl font-extrabold text-white">$299<span className="text-sm font-semibold text-neutral-400">/mo</span></div>
            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
              <li>Multi-location GEO signals</li>
              <li>Local Rank Tracking</li>
              <li>GMB/NAP Sync</li>
              <li>Priority Support</li>
            </ul>
            <button 
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white/90 hover:opacity-90 transition"
              data-testid="geo-plan-cta"
            >
              Automate My Visibility
            </button>
          </div>

          {/* Agency — INCLUDED */}
          <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-6 shadow-lg backdrop-blur">
            <h3 className="text-lg font-semibold text-white">Agency</h3>
            <p className="mt-1 text-xs text-neutral-400">Multi-location • White Label</p>
            <div className="mt-6 text-4xl font-extrabold text-white">Custom</div>
            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
              <li>White-Label Dashboard</li>
              <li>API + Multi-User Access</li>
              <li>Dedicated Account Manager</li>
              <li>Custom Integrations</li>
            </ul>
            <button 
              className="mt-6 w-full rounded-xl border border-emerald-400/40 px-4 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-400/10 transition"
              data-testid="agency-plan-cta"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
