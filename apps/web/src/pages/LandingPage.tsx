import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { WebsitePreview } from '../components/builder/WebsitePreview';
import {
  Sparkles,
  Check,
  Smartphone,
  Users,
  TrendingUp,
  Shield,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">

      {/* HEADER / NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600">
                CraftConnect
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/login" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition-all transform hover:-translate-y-0.5"
              >
                Get Started Free
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-orange-600 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-orange-100 p-4 shadow-lg absolute w-full">
            <div className="flex flex-col gap-4">
              <Link to="/login" className="text-gray-600 font-medium p-2 hover:bg-orange-50 rounded-lg">
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-center px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-sm"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </nav>
      <WebsitePreview />
      {/* HERO SECTION */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
            Your Digital Presence, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600">
              Simplified & Automated
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Built for local service professionals. No tech skills needed. <br className="hidden md:block" />
            Website + lead management + growth in one platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/register"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-lg font-bold shadow-lg hover:shadow-xl hover:opacity-90 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Start Your Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-4 rounded-full border-2 border-amber-500 text-amber-700 text-lg font-bold hover:bg-amber-50 transition-colors">
              Watch Demo
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm md:text-base font-medium text-gray-600">
            {['No credit card required', 'Setup in 5 minutes', 'Cancel anytime'].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-3 h-3 text-green-600" strokeWidth={3} />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-24 bg-white/80 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for Service Professionals Like You
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stop struggling with complicated tools. We solve the daily challenges that hold your business back.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: "😓",
                title: "No Digital Presence",
                desc: "Customers can't find you online, so you lose jobs to competitors who have websites."
              },
              {
                icon: "📱",
                title: "Too Technical",
                desc: "Website builders are complicated, confusing, and take time you don't have."
              },
              {
                icon: "💸",
                title: "Expensive Solutions",
                desc: "Agencies charge thousands for a simple site. We give you more for less."
              },
              {
                icon: "📞",
                title: "Lost Follow-ups",
                desc: "Missed calls and forgotten messages mean lost revenue. Never miss a lead again."
              }
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl border border-red-100 shadow-sm hover:border-red-300 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Simple Platform
            </h2>
            <p className="text-lg text-gray-600">
              Powerful tools designed to be incredibly easy to use.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl border border-amber-100 shadow-lg hover:shadow-xl hover:border-amber-300 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 text-white shadow-md group-hover:scale-110 transition-transform">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Website</h3>
              <p className="text-gray-600 mb-6">
                Instantly generated, mobile-friendly website that looks great on any device.
              </p>
              <ul className="space-y-3">
                {['Custom domain included', 'Beautiful photo gallery', 'Client testimonials'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <Check className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl border border-amber-100 shadow-lg hover:shadow-xl hover:border-amber-300 transition-all duration-300 group relative md:-mt-8">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-t-2xl"></div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 text-white shadow-md group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Lead Management</h3>
              <p className="text-gray-600 mb-6">
                Keep track of every potential customer in one simple, organized dashboard.
              </p>
              <ul className="space-y-3">
                {['Organized lead status', 'One-tap calls & WhatsApp', 'Track lead sources'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <Check className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl border border-amber-100 shadow-lg hover:shadow-xl hover:border-amber-300 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 text-white shadow-md group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Auto Marketing</h3>
              <p className="text-gray-600 mb-6">
                Grow your business on autopilot with automated follow-ups and reviews.
              </p>
              <ul className="space-y-3">
                {['WhatsApp auto-responses', 'Review request automation', 'Social media scheduling'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <Check className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / SOCIAL PROOF */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Shield className="w-16 h-16 text-amber-200 opacity-80" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Trusted by 10,000+ Service Professionals
          </h2>
          <p className="text-xl text-amber-100 mb-16 max-w-2xl mx-auto">
            From carpenters to interior designers, local pros rely on CraftConnect to grow.
          </p>

          <div className="grid md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-amber-400/30">
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-bold mb-2">10k+</div>
              <div className="text-amber-100 font-medium">Active Users</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-bold mb-2">50k+</div>
              <div className="text-amber-100 font-medium">Leads Generated</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-bold mb-2">4.9/5</div>
              <div className="text-amber-100 font-medium">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 to-orange-600"></div>
          <div className="p-12 md:p-20 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Start Growing Your Business Today
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Join thousands of professionals who have simplified their digital presence. <br />
              Get set up in just 5 minutes.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xl font-bold shadow-xl hover:shadow-2xl hover:opacity-90 transition-all transform hover:-translate-y-1"
            >
              Get Started Free <ArrowRight className="w-6 h-6" />
            </Link>
            <p className="mt-6 text-sm text-gray-500 font-medium">
              No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6 opacity-75 grayscale hover:grayscale-0 transition-all">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">
              CraftConnect
            </span>
          </div>
          <p className="text-gray-500 text-sm text-center">
            &copy; 2026 CraftConnect. Built with ❤️ for local service professionals.
          </p>
        </div>
      </footer>

    </div>
  );
};
