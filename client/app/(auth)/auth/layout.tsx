import Image from "next/image";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { Shield, Sparkles, Zap, Users, Building2, Award } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="page-shell min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Side - Branding & Visual */}
        <aside className="relative hidden h-screen overflow-hidden lg:sticky lg:top-0 lg:grid">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-blue)] via-[var(--color-green)] to-[var(--color-yellow)] opacity-90" />
          
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-32 right-32 w-48 h-48 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 flex flex-col justify-between h-full p-8 lg:p-12">
            {/* Top Section */}
            <div className="space-y-8 animate-slide-in-left">
              <BrandLockup
                logoSize={64}
                subtitle="Housing Allocation Portal"
                subtitleClassName="text-white/90"
                titleClassName="text-white text-3xl lg:text-4xl font-bold"
              />
              
              {/* Feature Cards */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-[var(--transition-normal)]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-white font-semibold">Secure Access</h3>
                  </div>
                  <p className="text-white/80 text-sm">security with multi-factor authentication</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-[var(--transition-normal)]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-white/80 text-sm">Quick allocation and real-time status updates</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-[var(--transition-normal)]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-white font-semibold">User-Friendly</h3>
                  </div>
                  <p className="text-white/80 text-sm">Intuitive interface designed for all users</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-[var(--transition-normal)]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-white font-semibold">Fair Allocation</h3>
                  </div>
                  <p className="text-white/80 text-sm">Transparent scoring system for housing distribution</p>
                </div>
              </div>
            </div>

            {/* Bottom Section - Stats */}
            <div className="space-y-6 animate-slide-in-up">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Portal Statistics
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">500+</div>
                    <div className="text-white/80 text-xs">Active Users</div>
                  </div>
                 
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">24/7</div>
                    <div className="text-white/80 text-xs">Support</div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-white/70 text-sm">
                  © 2026 Gondar University - Empowering academic housing solutions
                </p>
              </div>
            </div>
          </div>
        </aside>
        <main className="grid min-h-screen items-center">
          <div className="w-full px-6 py-10 lg:px-12">
            <div className="mb-8 lg:max-w-xl">
              <BrandLockup logoSize={56} subtitle="House Allocation Portal" />
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
