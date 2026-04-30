"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowRight, KeyRound, Shield, Users, Sparkles, Building2, Mail, Phone, Award } from "lucide-react";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 scroll-smooth">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="#home" className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">
            <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-[rgb(59,130,246)] bg-[rgb(59,130,246)]/10">
              <Image src="/ashuman.png" alt="University of Gondar logo" fill className="object-cover" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[rgb(59,130,246)]">University of Gondar</p>
              <p className="text-base font-semibold">Housing Portal</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#home" className="transition duration-300 hover:text-[rgb(59,130,246)]">Home</a>
            <a href="#about" className="transition duration-300 hover:text-[rgb(59,130,246)]">About Us</a>
            <a href="#services" className="transition duration-300 hover:text-[rgb(59,130,246)]">Services</a>
            <a href="#contact" className="transition duration-300 hover:text-[rgb(59,130,246)]">Contact Us</a>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 rounded-full bg-[rgb(59,130,246)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[rgba(59,130,246,0.25)] transition duration-300 hover:-translate-y-0.5 hover:bg-[rgb(37,99,235)]"
            >
              <KeyRound className="h-4 w-4" />
              Open Portal
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:border-[rgb(59,130,246)] hover:text-[rgb(59,130,246)] md:hidden"
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-sm md:hidden">
            <div className="space-y-2">
              {['home', 'about', 'services', 'contact'].map((section) => (
                <a
                  key={section}
                  href={`#${section}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
                >
                  {section.replace(/^[a-z]/, (m) => m.toUpperCase())}
                </a>
              ))}
              <Link
                href="/auth/login"
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-2xl bg-[rgb(59,130,246)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[rgb(37,99,235)]"
              >
                Open Portal
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        <section id="home" className="relative overflow-hidden bg-[rgb(239,246,255)] px-4 py-24 sm:px-6 lg:px-8">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
            style={{
              background: 'radial-gradient(circle at top, rgba(59, 130, 246, 0.18), transparent 45%)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
            style={{
              background: 'radial-gradient(circle at bottom, rgba(16, 185, 129, 0.14), transparent 50%)',
            }}
          />
          <div className="relative mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="space-y-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-[rgb(59,130,246)] shadow-sm transition">
                  <Sparkles className="h-4 w-4 text-[rgb(59,130,246)]" />
                  Secure Access
                </span>

                <div className="space-y-6">
                  <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                    University of Gondar
                    <span className="block bg-gradient-to-r from-[rgb(59,130,246)] via-[rgb(16,185,129)] to-[rgb(245,158,11)] bg-clip-text text-transparent">
                      Housing Allocation Portal
                    </span>
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                    Bright, clean, and easy-to-use housing portal access for University of Gondar staff.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  
                    <KeyRound className="h-5 w-5" />
                    Open Portal<Link
                    href="/auth/login"
                    className="inline-flex items-center justify-center gap-2 rounded-3xl bg-[rgb(59,130,246)] px-8 py-4 text-base font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[rgb(37,99,235)] shadow-lg shadow-[rgba(59,130,246,0.25)]"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="#about"
                    className="inline-flex items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-900 transition duration-300 hover:border-[rgb(59,130,246)] hover:bg-slate-50"
                  >
                    Learn More
                  </a>
                </div>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl transition hover:-translate-y-1">
                <div
                  className="absolute -right-10 top-8 h-24 w-24 rounded-full blur-3xl"
                  style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}
                />
                <div
                  className="absolute left-6 top-20 h-16 w-16 rounded-full blur-2xl"
                  style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)' }}
                />
                <div className="relative grid gap-6 rounded-[1.75rem] border border-slate-200 bg-[rgb(248,250,255)] px-6 py-10 shadow-xl">
                  <div className="space-y-3">
                    <p className="text-sm uppercase tracking-[0.2em] text-[rgb(59,130,246)]">Secure Access</p>
                    <h2 className="text-3xl font-semibold text-slate-950">Security with multi-factor authentication</h2>
                    <p className="text-slate-600">
                      Quick allocation and real-time status updates, built for usability and trust.
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                      <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgb(59,130,246)] text-white shadow-md shadow-[rgba(59,130,246,0.25)]">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <p className="text-sm text-slate-600">University-branded portal design</p>
                    </div>
                    <div className="rounded-3xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                      <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgb(16,185,129)] text-white shadow-md shadow-[rgba(16,185,129,0.25)]">
                        <Shield className="h-5 w-5" />
                      </div>
                      <p className="text-sm text-slate-600">Transparent, fair allocation scoring</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.95fr_0.95fr] lg:items-center">
              <div className="space-y-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[rgb(59,130,246)]">About the portal</p>
                <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">Responsive, simple, and professional.</h2>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  The homepage is built for the University of Gondar housing portal: bright, clean, and easy to use on every screen.
                </p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgb(245,158,11)] text-white shadow-md shadow-[rgba(245,158,11,0.25)]">
                      <Award className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-950">User-Friendly</h3>
                    <p className="mt-2 text-slate-600">Intuitive interface designed for all users.</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgb(16,185,129)] text-white shadow-md shadow-[rgba(16,185,129,0.25)]">
                      <Users className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-950">Fair Allocation</h3>
                    <p className="mt-2 text-slate-600">Transparent scoring system for housing distribution.</p>
                  </div>
                </div>
              </div>

              
            </div>
          </div>
        </section>

        <section id="services" className="bg-[rgb(248,251,255)] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[rgb(16,185,129)]">Core services</p>
              <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">Professional housing portal capabilities.</h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-600 leading-8">
                The landing page is built for first-time visitors, matching the portal brand with bright accent colors and user-friendly sections.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl transition hover:-translate-y-1 hover:border-[rgb(59,130,246)]/30">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[rgb(59,130,246)] text-white shadow-lg shadow-[rgba(59,130,246,0.25)]">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-950">Verified onboarding</h3>
                <p className="mt-3 text-slate-600 leading-7">Secure email verification and OTP flow before login.</p>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl transition hover:-translate-y-1 hover:border-[rgb(16,185,129)]/30">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[rgb(16,185,129)] text-white shadow-lg shadow-[rgba(16,185,129,0.25)]">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-950">Role-based routing</h3>
                <p className="mt-3 text-slate-600 leading-7">Users are placed into the right dashboard based on role.</p>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl transition hover:-translate-y-1 hover:border-[rgb(245,158,11)]/30">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[rgb(245,158,11)] text-white shadow-lg shadow-[rgba(245,158,11,0.25)]">
                  <ArrowRight className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-950">Quick allocation</h3>
                <p className="mt-3 text-slate-600 leading-7">Real-time update cards and fast portal performance.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_0.9fr] lg:items-center">
              <div className="space-y-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[rgb(59,130,246)]">Contact</p>
                <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">Need assistance with the portal?</h2>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  The portal is built responsively for desktop and phone, with polished hover effects and bright visuals.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-[rgb(239,246,255)] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[rgb(59,130,246)] text-white shadow-md shadow-[rgba(59,130,246,0.25)]">
                      <Mail className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-base font-semibold text-slate-950">Email support</p>
                    <p className="mt-2 text-slate-600">gondar@UOG.edu.et</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-[rgb(255,249,230)] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[rgb(16,185,129)] text-white shadow-md shadow-[rgba(16,185,129,0.25)]">
                      <Phone className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-base font-semibold text-slate-950">24/7 Support</p>
                    <p className="mt-2 text-slate-600">Always available</p>
                  </div>
                </div>
              </div>

              
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-[rgb(248,250,252)] px-4 py-10 text-slate-600 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[rgb(59,130,246)]">Gondar University</p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
              © 2026 Gondar University - Empowering academic housing solutions.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm sm:text-right">
            <p>24/7 Support</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
