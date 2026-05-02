"use client";



import Image from "next/image";

import Link from "next/link";

import { useState } from "react";

import { Menu, X, KeyRound, Shield, Users, Sparkles, Mail, Phone, Award } from "lucide-react";



export default function HomePage() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);



  return (

    <div className="min-h-screen bg-[var(--background-secondary)] text-[var(--foreground)] scroll-smooth">

      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-lg">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <Link href="#home" className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">

            <div className="relative h-29 w-44 overflow-hidden rounded-2xl">

              <Image src="/ashuman.png" alt="University of Gondar logo" fill className="object-contain" sizes="100px" />

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-blue)]">University of Gondar</p>

              <p className="text-base font-semibold">Housing Portal</p>

            </div>

          </Link>



          <nav className="hidden items-center gap-8 md:flex">

            <a href="#home" className="relative px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-[var(--color-blue)] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[var(--color-blue)] after:transition-all after:duration-300 hover:after:w-full">Home</a>

            <a href="#about" className="relative px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-[var(--color-blue)] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[var(--color-blue)] after:transition-all after:duration-300 hover:after:w-full">About Us</a>

            <a href="#services" className="relative px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-[var(--color-blue)] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[var(--color-blue)] after:transition-all after:duration-300 hover:after:w-full">Services</a>

            <a href="#contact" className="relative px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-[var(--color-blue)] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[var(--color-blue)] after:transition-all after:duration-300 hover:after:w-full">Contact Us</a>

            <Link

              href="/auth/login"

              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-green)] to-[var(--color-yellow)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[rgba(var(--color-blue-rgb),0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"

            >

              <KeyRound className="h-4 w-4" />

              Open Portal

            </Link>

          </nav>



          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-[var(--background)] text-[var(--foreground)] shadow-md transition-all duration-300 hover:border-[var(--color-blue)] hover:text-[var(--color-blue)] hover:shadow-lg hover:-translate-y-0.5 md:hidden focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)]/50 active:scale-95 touch-manipulation"
            aria-label="Toggle mobile menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            style={{ minHeight: '48px', minWidth: '48px' }}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

        </div>



        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden" 
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />
            
            {/* Mobile Menu */}
            <div id="mobile-menu" className="absolute top-full left-0 right-0 z-50 border-t border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-[var(--background)] px-4 py-4 shadow-lg md:hidden animate-slide-in-down" role="navigation" aria-label="Mobile navigation">

            <div className="space-y-3">

              {[
                { name: 'Home', id: 'home' },
                { name: 'About Us', id: 'about' },
                { name: 'Services', id: 'services' },
                { name: 'Contact Us', id: 'contact' }
              ].map((section) => (

                <button

                  key={section.id}

                  onClick={() => {
                    const element = document.getElementById(section.id);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    setIsMenuOpen(false);
                  }}

                  className="block w-full rounded-xl px-4 py-3 text-base font-medium text-[var(--foreground)] text-left transition-all duration-300 hover:bg-gradient-to-r hover:from-[var(--color-blue)]/10 hover:to-[var(--color-green)]/10 hover:text-[var(--color-blue)] hover:shadow-sm hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)]/50 touch-manipulation"

                  style={{ minHeight: '48px' }}

                >

                  {section.name}

                </button>

              ))}

              <Link

                href="/auth/login"

                onClick={() => setIsMenuOpen(false)}

                className="block w-full rounded-xl bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-green)] to-[var(--color-yellow)] px-4 py-3 text-base font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)]/50 touch-manipulation"

                style={{ minHeight: '52px' }}

              >

                <span className="flex items-center justify-center gap-2">
                  <KeyRound className="h-5 w-5" />
                  Open Portal
                </span>

              </Link>

            </div>

          </div>

          </>
        )}

      </header>



      <main>

        <section id="home" className="relative overflow-hidden bg-[var(--background-secondary)] px-4 py-24 sm:px-6 lg:px-8">

          <div

            className="pointer-events-none absolute inset-x-0 top-0 h-1/2"

            style={{

              background: 'radial-gradient(circle at top, rgba(var(--color-blue-rgb), 0.18), transparent 45%)',

            }}

          />

          <div

            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"

            style={{

              background: 'radial-gradient(circle at bottom, rgba(var(--color-green-rgb), 0.14), transparent 50%)',

            }}

          />

          <div className="relative mx-auto max-w-7xl">

            <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-12 text-center">

              <div className="space-y-8">

                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--surface)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-blue)] shadow-sm transition">

                  <Sparkles className="h-4 w-4 text-[var(--color-blue)]" />

                  Secure Access

                </span>



                <div className="space-y-6">

                    <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">

                      University of Gondar

                      <span className="block bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-green)] to-[var(--color-yellow)] bg-clip-text text-transparent">

                        Housing Allocation Portal

                      </span>

                    </h1>

                    <p className="max-w-2xl text-lg leading-8 text-[var(--foreground-secondary)] sm:text-xl">

                    Bright, clean, and easy-to-use housing portal access for University of Gondar staff.

                  </p>

                </div>



                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">

                  

                  <a

                    href="#about"

                    className="inline-flex items-center justify-center gap-2 rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-8 py-4 text-base font-semibold text-[var(--foreground)] transition duration-300 hover:border-[var(--color-blue)] hover:bg-[var(--background)]"

                  >

                    Learn More

                  </a>

                </div>

              </div>



            </div>

          </div>

        </section>



        <section id="about" className="bg-white px-4 py-20 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-4xl text-center">

            <div className="space-y-12">

              <div className="space-y-6">

                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-blue)]">About the portal</p>

                <h2 className="text-3xl font-bold text-[var(--foreground)] sm:text-4xl">Responsive, simple, and professional.</h2>

                <p className="mx-auto max-w-2xl text-lg leading-8 text-[var(--foreground-secondary)]">

                  The homepage is built for the University of Gondar housing portal: bright, clean, and easy to use on every screen.

                </p>

              </div>

              <div className="grid gap-5 sm:grid-cols-2 place-items-center text-center">

                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-yellow)] text-white shadow-md shadow-[rgba(var(--color-yellow-rgb),0.25)]">

                    <Award className="h-5 w-5" />

                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">User-Friendly</h3>

                  <p className="mt-2 text-[var(--foreground-secondary)]">Intuitive interface designed for all users.</p>

                </div>

                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-green)] text-white shadow-md shadow-[rgba(var(--color-green-rgb),0.25)]">

                    <Users className="h-5 w-5" />

                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Fair Allocation</h3>

                  <p className="mt-2 text-[var(--foreground-secondary)]">Transparent scoring system for housing distribution.</p>

                </div>

              </div>

            </div>

          </div>

        </section>



        <section id="services" className="bg-[var(--background-secondary)] px-4 py-20 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-7xl">

            <div className="text-center">

              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-green)]">Core services</p>

              <h2 className="mt-4 text-3xl font-bold text-[var(--foreground)] sm:text-4xl">Professional housing portal capabilities.</h2>

              <p className="mx-auto mt-4 max-w-2xl text-[var(--foreground-secondary)] leading-8">

                The landing page is built for first-time visitors, matching the portal brand with bright accent colors and user-friendly sections.

              </p>

            </div>



            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xl transition hover:-translate-y-1 hover:border-[var(--color-blue)]/30">

                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[var(--color-blue)] text-white shadow-lg shadow-[rgba(var(--color-blue-rgb),0.25)]">

                  <Shield className="h-6 w-6" />

                </div>

                <h3 className="mt-6 text-xl font-semibold text-[var(--foreground)]">Verified onboarding</h3>

                <p className="mt-3 text-[var(--foreground-secondary)] leading-7">Secure email verification and OTP flow before login.</p>

              </div>

              <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xl transition hover:-translate-y-1 hover:border-[var(--color-green)]/30">

                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[var(--color-green)] text-white shadow-lg shadow-[rgba(var(--color-green-rgb),0.25)]">

                  <Users className="h-6 w-6" />

                </div>

                <h3 className="mt-6 text-xl font-semibold text-[var(--foreground)]">Role-based routing</h3>

                <p className="mt-3 text-[var(--foreground-secondary)] leading-7">Users are placed into the right dashboard based on role.</p>

              </div>

              <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xl transition hover:-translate-y-1 hover:border-[var(--foreground)]/30">

                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[var(--foreground)] text-white shadow-lg shadow-[rgba(var(--color-green-rgb),0.25)]">

                  <Users className="h-6 w-6" />

                </div>

                <h3 className="mt-6 text-xl font-semibold text-[var(--foreground)]">Permanent Storage</h3>

                <p className="mt-3 text-[var(--foreground-secondary)] leading-7">Database permanently saves data</p>

              </div>

            </div>

          </div>

        </section>



        <section id="contact" className="bg-[var(--surface)] px-4 py-20 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-4xl text-center">

            <div className="space-y-12">

              <div className="space-y-6">

                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-blue)]">Contact</p>

                <h2 className="text-3xl font-bold text-[var(--foreground)] sm:text-4xl">Need assistance with the portal?</h2>

                <p className="mx-auto max-w-2xl text-lg leading-8 text-[var(--foreground-secondary)]">

                  The portal is built responsively for desktop and phone, with polished hover effects and bright visuals.

                </p>

              </div>

              <div className="grid gap-4 sm:grid-cols-2 place-items-center text-center">

                <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[var(--color-blue)] text-white shadow-md shadow-[rgba(var(--color-blue-rgb),0.25)]">

                    <Mail className="h-5 w-5" />

                  </div>

                  <p className="mt-4 text-base font-semibold text-[var(--foreground)]">Email support</p>

                  <p className="mt-2 text-[var(--foreground-secondary)]">gondar@UOG.edu.et</p>

                </div>

                <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[var(--color-green)] text-white shadow-md shadow-[rgba(var(--color-green-rgb),0.25)]">

                    <Phone className="h-5 w-5" />

                  </div>

                  <p className="mt-4 text-base font-semibold text-[var(--foreground)]">24/7 Support</p>

                  <p className="mt-2 text-[var(--foreground-secondary)]">Always available</p>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>



      <footer className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-10 text-[var(--foreground-secondary)] sm:px-6 lg:px-8">

        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:justify-center">

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-blue)]">Gondar University</p>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--foreground-tertiary)]">

              © 2026 Gondar University - Empowering academic housing solutions.

            </p>

          </div>

          

        </div>

      </footer>

    </div>

  );

}

