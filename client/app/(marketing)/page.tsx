import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Sparkles,
  UserCog,
  UserLock,
  Users,
  Home,
  Building2,
  KeyRound,
  Lock,
  MailCheck,
  Zap,
  Award,
  CheckCircle2,
  Star,
  TrendingUp,
  Globe,
  Heart,
  Rocket,
  Target,
  Crown,
  Gem,
  Flame,
  Cloud,
  Sun,
  Moon,
  MapPin,
  Calendar,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Wifi,
  ShieldCheck,
  FileText,
  Database,
  Server,
  Cpu,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Plus,
  Minus,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  UserPlus,
  UserMinus,
  Users2,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MessageSquare,
  Video,
  Image,
  Music,
  Film,
  Book,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Share2,
  HeartHandshake,
  Handshake,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  ChevronLeft,
  MoreVertical,
  MoreHorizontal,
  Copy,
  Scissors,
  Move,
  Maximize2,
  Minimize2,
  Expand,
  Shrink,
  Fullscreen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Diamond,
  Package,
  Box,
  Archive,
  Folder,
  FolderOpen,
  File,
  FilePlus,
  FileMinus,
  FileCheck,
  FileX,
  FileSearch,
  FileLock,
  FileQuestion,
  FileWarning,
  FileHeart,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileSpreadsheet,
  FileInput,
  FileOutput,
} from "lucide-react";

import { SiteNav } from "@/components/site/site-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const highlights = [
  {
    icon: UserCog,
    title: "Admin-led access",
    description: "Admins create every role, including other admins, from one controlled dashboard.",
    features: ["Role Management", "User Creation", "Dashboard Control", "System Settings"]
  },
  {
    icon: UserLock,
    title: "Verified onboarding",
    description: "New users start with email verification, OTP confirmation, and strong password setup.",
    features: ["Email Verification", "OTP Security", "Password Setup", "Account Activation"]
  },
  {
    icon: Users,
    title: "Role-based routing",
    description: "Each user lands in the right workspace immediately after authentication.",
    features: ["Smart Routing", "Role Detection", "Dashboard Access", "Permission Control"]
  },
  
];




export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--surface)] via-[var(--surface-secondary)] to-[var(--surface-tertiary)]">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[var(--color-blue)]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-40 w-80 h-80 bg-[var(--color-green)]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-[var(--color-yellow)]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-20 w-64 h-64 bg-[var(--color-red)]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <SiteNav />
      
      <main className="relative">
        {/* Hero Section with Large Logos */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-32">
            <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-20 items-center">
              
              {/* Left Content */}
              <div className="space-y-8 animate-slide-in-up">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--color-blue)]/10 to-[var(--color-green)]/10 border border-[var(--color-blue)]/20 rounded-full">
                  <Sparkles className="w-4 h-4 text-[var(--color-blue)]" />
                  <span className="text-sm font-medium text-[var(--color-blue)]">Secure Housing Portal</span>
                </div>

                {/* Main Title */}
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-green)] to-[var(--color-yellow)] bg-clip-text text-transparent">
                      University of Gondar
                    </span>
                    <br />
                    <span className="text-[var(--foreground)]">Housing Access</span>
                  </h1>
                  
                  <p className="text-xl lg:text-2xl text-[var(--foreground-secondary)] leading-relaxed">
                    The House Allocation Portal centralizes admin-led account creation, OTP email verification, strong password setup, and role-based dashboard access without process confusion.
                  </p>
                </div>

                
              </div>

              {/* Right - Large Logo Section */}
              <div className="relative animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                {/* University Logo */}
                <div className="relative mb-12">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-blue)] to-[var(--color-green)] rounded-3xl animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-blue)] to-[var(--color-green)] rounded-3xl animate-ping" />
                  <div className="relative w-full h-64 bg-gradient-to-br from-[var(--color-blue)] to-[var(--color-green)] rounded-3xl flex items-center justify-center shadow-2xl">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <Crown className="w-16 h-16 text-white" />
                      </div>
                      <div className="text-white">
                        <h3 className="text-2xl font-bold">Gondar</h3>
                        <p className="text-sm opacity-90">University</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* House Logo */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-yellow)] to-[var(--color-red)] rounded-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-yellow)] to-[var(--color-red)] rounded-3xl animate-ping" style={{ animationDelay: '1s' }} />
                  <div className="relative w-full h-64 bg-gradient-to-br from-[var(--color-yellow)] to-[var(--color-red)] rounded-3xl flex items-center justify-center shadow-2xl">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <Building2 className="w-16 h-16 text-white" />
                      </div>
                      <div className="text-white">
                        <h3 className="text-2xl font-bold">Housing</h3>
                        <p className="text-sm opacity-90">Portal</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Flow Section */}
        <section className="py-20 bg-[var(--surface)]/50 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[var(--foreground)] mb-4">Seamless Process Flow</h2>
              <p className="text-xl text-[var(--foreground-secondary)]">From account creation to dashboard access in minutes</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { step: "01", title: "Admin Creates Account", icon: UserPlus, color: "blue" },
                { step: "02", title: "Email Verification", icon: MailCheck, color: "green" },
                { step: "03", title: "OTP Confirmation", icon: ShieldCheck, color: "yellow" },
                { step: "04", title: "Dashboard Access", icon: Monitor, color: "red" }
              ].map((item, index) => (
                <div key={item.step} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-${item.color})]/10 to-transparent rounded-2xl transform scale-95 group-hover:scale-100 transition-transform duration-[var(--transition-normal)]" />
                  <div className="relative p-6 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--color-${item.color})]/20 to-[var(--color-${item.color})]/10 rounded-2xl flex items-center justify-center">
                      <item.icon className="w-8 h-8 text-[var(--color-${item.color})]" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-mono text-[var(--color-${item.color})]">{item.step}</div>
                      <h3 className="font-semibold text-[var(--foreground)]">{item.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--color-green)]/10 to-[var(--color-blue)]/10 border border-[var(--color-green)]/20 rounded-full mb-6">
                <Zap className="w-4 h-4 text-[var(--color-green)]" />
                <span className="text-sm font-medium text-[var(--color-green)]">Core Capabilities</span>
              </div>
              <h2 className="text-5xl font-bold text-[var(--foreground)] mb-6">
                Built for Clear Access Flows
              </h2>
              <p className="text-xl text-[var(--foreground-secondary)] max-w-3xl mx-auto">
                Not generic dashboards. Every feature designed specifically for University of Gondar housing management.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {highlights.map(({ icon: Icon, title, description, features }, index) => (
                <Card key={title} variant="glass" className="group hover:scale-[1.02] transition-transform duration-[var(--transition-normal)]">
                  <CardHeader className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-[var(--transition-normal)]">
                      <Icon className="w-8 h-8 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">{title}</CardTitle>
                      <CardDescription>{description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[var(--color-green)]" />
                          <span className="text-sm text-[var(--foreground-secondary)]">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        

        {/* CTA Section */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-blue)]/20 via-[var(--color-green)]/20 to-[var(--color-yellow)]/20 rounded-3xl blur-3xl" />
              <div className="relative p-12 bg-gradient-to-br from-[var(--surface)] to-[var(--surface-secondary)] rounded-3xl border border-[var(--border)]">
                <h2 className="text-4xl font-bold text-[var(--foreground)] mb-6">
                  Ready to Transform Housing Management?
                </h2>
                <p className="text-xl text-[var(--foreground-secondary)] mb-8">
                  Join hundreds of users already benefiting from our streamlined housing allocation system.
                </p>
                <Link href="/auth/login">
                  <Button variant="primary" size="lg" className="relative overflow-hidden group min-w-48">
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started Now <Rocket className="w-4 h-4" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[var(--transition-slow)]" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-8 md:grid-cols-4">
             
            <div>
              <h4 className="font-semibold text-[var(--foreground)] mb-4">Contact</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)]">
                  <Mail className="w-4 h-4" />
                  gondar@UOG.edu.et
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)]">
                  <Phone className="w-4 h-4" />
                  +251 581 123 456
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)]">
                  <MapPin className="w-4 h-4" />
                  Gondar, Ethiopia
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-[var(--border)] text-center">
            <p className="text-sm text-[var(--foreground-tertiary)]">
              © 2026 University of Gondar. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
