"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Send,
  Bot,
  User,
  HelpCircle,
  Search,
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  FileText,
  CheckCircle,
  AlertCircle,
  Zap,
  Facebook,
  Youtube,
  Globe,
  Download,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { getAllocationReports, updateAllocationReportStatus, deleteAllocationReport, type AllocationReport } from "@/lib/api/admin";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SupportPanelProps {
  role?: 'LECTURER' | 'OFFICER' | 'COMMITTEE' | 'ADMIN';
}

export function SupportPanel({ role = 'LECTURER' }: SupportPanelProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'faq' | 'contact' | 'reports'>('chat');
  const queryClient = useQueryClient();

  const reportsQuery = useQuery({
    queryKey: ["allocation-reports"],
    queryFn: getAllocationReports,
    enabled: role === "ADMIN",
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, adminNotes }: { id: string; status: string; adminNotes?: string }) =>
      updateAllocationReportStatus(id, status, adminNotes),
    onSuccess: () => {
      toast.success("Report status updated.");
      queryClient.invalidateQueries({ queryKey: ["allocation-reports"] });
    },
    onError: (error) => {
      toast.error("Failed to update report status.");
    },
  });

  const deleteReportMutation = useMutation({
    mutationFn: deleteAllocationReport,
    onSuccess: () => {
      toast.success("Report deleted.");
      queryClient.invalidateQueries({ queryKey: ["allocation-reports"] });
    },
    onError: (error) => {
      toast.error("Failed to delete report.");
    },
  });

  // Gemini Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: role === 'LECTURER' 
        ? 'Hello! I\'m here to help you with housing at University of Gondar. Ask me anything about applications, documents, or housing status!'
        : role === 'OFFICER'
        ? 'Hello! I\'m your housing management assistant. How can I help you today with applications, units, or allocations?'
        : role === 'COMMITTEE'
        ? 'Hello! I\'m here to help with committee work. What do you need assistance with today?'
        : role === 'ADMIN'
        ? 'Hello! I\'m your admin assistant. How can I help you manage the housing system today?'
        : 'Hello! I\'m your housing assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const roleLabelMap = {
    LECTURER: 'Lecturer',
    OFFICER: 'Officer',
    COMMITTEE: 'Committee',
    ADMIN: 'Admin'
  } as const;

  const roleDescriptionMap = {
    LECTURER: 'Get support for housing applications, documents, status checks, and campus housing policies.',
    OFFICER: 'Get support for housing unit management, allocations, availability updates, and operations.',
    COMMITTEE: 'Get support for application review, scoring, committee assignments, and allocation decisions.',
    ADMIN: 'Get support for system administration, user management, housing policies, and admin workflows.'
  } as const;

  const faqsByRole: Record<string, FAQItem[]> = {
    LECTURER: [
      {
        id: '1',
        question: 'How do I apply for housing at University of Gondar?',
        answer: 'Login to your dashboard, go to the housing section, start a new application, fill in your details, upload required documents, and submit. You can track the status from the same dashboard page.',
        category: 'Applications'
      },
      {
        id: '2',
        question: 'What documents do I need for my housing application?',
        answer: 'Required documents include your University ID, appointment letter, academic certificate, proof of relationship if applicable, and any supporting medical or special condition documents.',
        category: 'Documents'
      },
      {
        id: '3',
        question: 'How can I check my application status?',
        answer: 'Open your dashboard and navigate to "My Applications" to view your current application status. You can see real-time updates on your application progress, from submission to committee review to final decision.',
        category: 'Applications'
      }
    ],
    OFFICER: [
      {
        id: '1',
        question: 'How do I manage housing unit allocations?',
        answer: 'Navigate to the Housing Management section, view available units, review pending applications, and make allocation decisions based on eligibility criteria and availability.',
        category: 'Management'
      },
      {
        id: '2',
        question: 'How do I update housing availability?',
        answer: 'Go to Housing Units > Availability, update unit status, mark units as occupied/vacant, and set maintenance schedules. Changes are reflected immediately in the system.',
        category: 'Operations'
      }
    ],
    COMMITTEE: [
      {
        id: '1',
        question: 'How do I review applications for committee decisions?',
        answer: 'Access the Committee Dashboard, review assigned applications, check scoring criteria, and submit your recommendations. All reviews are tracked and logged.',
        category: 'Review Process'
      },
      {
        id: '2',
        question: 'What are the scoring criteria for housing allocations?',
        answer: 'Scoring is based on academic rank, years of service, family size, special needs, and distance from campus. Each category has specific weightings in the allocation algorithm.',
        category: 'Scoring'
      }
    ],
    ADMIN: [
      {
        id: '1',
        question: 'How do I manage user accounts and permissions?',
        answer: 'Go to User Management, add/edit users, assign roles (Lecturer, Officer, Committee, Admin), and set access permissions. All changes are logged for audit purposes.',
        category: 'User Management'
      },
      {
        id: '2',
        question: 'How do I generate housing allocation reports?',
        answer: 'Navigate to Reports > Allocation Reports, select date range and criteria, choose report format (PDF/Excel), and download. Reports include allocation statistics and trends.',
        category: 'Reports'
      }
    ]
  };

  const contactInfo = {
    LECTURER: {
      email: 'housing.lecturer@uog.edu.et',
      phone: '+251 581 110 123',
      office: 'Housing Office, Main Campus, Building A',
      hours: 'Mon-Fri: 8:00 AM - 5:00 PM'
    },
    OFFICER: {
      email: 'housing.officer@uog.edu.et',
      phone: '+251 581 110 124',
      office: 'Housing Management Office, Main Campus, Building B',
      hours: 'Mon-Fri: 7:30 AM - 6:00 PM'
    },
    COMMITTEE: {
      email: 'housing.committee@uog.edu.et',
      phone: '+251 581 110 125',
      office: 'Committee Office, Main Campus, Building C',
      hours: 'Tue-Thu: 9:00 AM - 4:00 PM'
    },
    ADMIN: {
      email: 'housing.admin@uog.edu.et',
      phone: '+251 581 110 126',
      office: 'Admin Office, Main Campus, Building D',
      hours: 'Mon-Fri: 8:00 AM - 5:00 PM'
    }
  };

  // Gemini API Chat Function
  const sendMessageToGemini = async (message: string): Promise<string> => {
    try {
      const systemPrompt = `You are an AI assistant for the University of Gondar Housing Allocation System. 
      Your role: ${role}
      
      Guidelines:
      - Only answer questions related to housing, university policies, and system usage
      - Be helpful, professional, and concise
      - If you don't know something, admit it and suggest contacting the housing office
      - Provide specific information about University of Gondar housing procedures
      - Keep responses under 150 words when possible
      
      User question: ${message}`;

      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: systemPrompt,
          role: role
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error('Gemini API Error:', error);
      return 'I apologize, but I\'m having trouble connecting right now. Please try again later or contact the housing office directly.';
    }
  };

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToGemini(inputMessage);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filter FAQs based on search
  const filteredFAQs = faqsByRole[role]?.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="page-shell">
      <div className="container animate-fade-in">
        {/* Header */}
        <Card variant="elevated" className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-green)] to-[var(--color-green-dark)] rounded-xl flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle size="lg" className="text-[var(--foreground)]">Support Center</CardTitle>
                <CardDescription>{roleDescriptionMap[role]}</CardDescription>
              </div>
            </div>
            
            {/* Role Badge */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-[var(--color-green)]/20 text-[var(--color-green)]">
                {roleLabelMap[role]} Support
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'chat', label: 'AI Chat', icon: Bot },
            { id: 'faq', label: 'FAQ', icon: HelpCircle },
            { id: 'contact', label: 'Contact', icon: Phone },
            ...(role === 'ADMIN' ? [{ id: 'reports', label: 'Reports', icon: FileText }] : [])
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'ghost'}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            {/* AI Chat Tab */}
            {activeTab === 'chat' && (
              <Card variant="default" className="animate-slide-in-right">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--color-blue)]/10 rounded-lg flex items-center justify-center">
                      <Bot className="w-5 h-5 text-[var(--color-blue)]" />
                    </div>
                    <div>
                      <CardTitle>AI Assistant</CardTitle>
                      <CardDescription>Get instant help with housing questions</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Chat Messages */}
                  <div className="h-96 overflow-y-auto border border-[var(--border)] rounded-lg p-4 mb-4 bg-[var(--background)]">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                            <div className={`flex items-start gap-2 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                message.type === 'user' 
                                  ? 'bg-[var(--color-blue)] text-white' 
                                  : 'bg-[var(--color-green)] text-white'
                              }`}>
                                {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                              </div>
                              <div className={`rounded-lg p-3 ${
                                message.type === 'user'
                                  ? 'bg-[var(--color-blue)] text-white'
                                  : 'bg-[var(--surface)] border border-[var(--border)]'
                              }`}>
                                <p className="text-sm">{message.content}</p>
                                <p className={`text-xs mt-1 ${
                                  message.type === 'user' ? 'text-blue-100' : 'text-[var(--foreground-tertiary)]'
                                }`}>
                                  {message.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-green)] text-white flex items-center justify-center">
                              <Bot className="w-4 h-4" />
                            </div>
                            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-[var(--color-green)] rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-[var(--color-green)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-[var(--color-green)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <Input
                      label="Support message"
                      placeholder="Ask about housing applications, eligibility, or system help..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputMessage.trim()}
                      className="flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <Card variant="default" className="animate-slide-in-right">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--color-yellow)]/10 rounded-lg flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-[var(--color-yellow)]" />
                    </div>
                    <div>
                      <CardTitle>Frequently Asked Questions</CardTitle>
                      <CardDescription>Quick answers to common housing questions</CardDescription>
                    </div>
                  </div>
                  
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--foreground-tertiary)] w-4 h-4" />
                    <Input
                      label="Search FAQs"
                      placeholder="Search FAQs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredFAQs.map((faq) => (
                      <div key={faq.id} className="border border-[var(--border)] rounded-lg">
                        <button
                          onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[var(--surface-muted)] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                              {faq.category}
                            </Badge>
                            <span className="font-medium">{faq.question}</span>
                          </div>
                          {expandedFAQ === faq.id ? (
                            <ChevronUp className="w-4 h-4 text-[var(--foreground-tertiary)]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[var(--foreground-tertiary)]" />
                          )}
                        </button>
                        {expandedFAQ === faq.id && (
                          <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--surface)]">
                            <p className="text-[var(--foreground-secondary)]">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    {filteredFAQs.length === 0 && (
                      <div className="text-center py-8 text-[var(--foreground-tertiary)]">
                        <HelpCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No FAQs found matching your search.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <Card variant="default" className="animate-slide-in-right">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--color-purple)]/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-[var(--color-purple)]" />
                    </div>
                    <div>
                      <CardTitle>Contact Information</CardTitle>
                      <CardDescription>Get in touch with the housing team</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[var(--color-blue)]/10 rounded-lg flex items-center justify-center">
                            <Mail className="w-5 h-5 text-[var(--color-blue)]" />
                          </div>
                          <div>
                            <p className="font-medium">Email</p>
                            <p className="text-[var(--foreground-secondary)]">{contactInfo[role].email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[var(--color-green)]/10 rounded-lg flex items-center justify-center">
                            <Phone className="w-5 h-5 text-[var(--color-green)]" />
                          </div>
                          <div>
                            <p className="font-medium">Phone</p>
                            <p className="text-[var(--foreground-secondary)]">{contactInfo[role].phone}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[var(--color-yellow)]/10 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-[var(--color-yellow)]" />
                          </div>
                          <div>
                            <p className="font-medium">Office</p>
                            <p className="text-[var(--foreground-secondary)]">{contactInfo[role].office}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[var(--color-purple)]/10 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-[var(--color-purple)]" />
                          </div>
                          <div>
                            <p className="font-medium">Office Hours</p>
                            <p className="text-[var(--foreground-secondary)]">{contactInfo[role].hours}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="border-t border-[var(--border)] pt-6">
                      <p className="font-medium mb-4">Quick Actions</p>
                      <div className="flex flex-wrap gap-3">
                        <Button variant="outline" className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Send Email
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Call Office
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Request Form
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reports Tab (Admin Only) */}
            {activeTab === 'reports' && role === 'ADMIN' && (
              <Card variant="default" className="animate-slide-in-right">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--color-red)]/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[var(--color-red)]" />
                    </div>
                    <div>
                      <CardTitle>Allocation Reports</CardTitle>
                      <CardDescription>Manage housing allocation reports</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {reportsQuery.isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-2 border-[var(--color-blue)] border-t-transparent rounded-full mx-auto"></div>
                      <p className="mt-2 text-[var(--foreground-secondary)]">Loading reports...</p>
                    </div>
                  ) : reportsQuery.data?.length === 0 ? (
                    <div className="text-center py-8 text-[var(--foreground-tertiary)]">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No allocation reports found.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reportsQuery.data?.map((report: AllocationReport) => (
                        <div key={report.id} className="border border-[var(--border)] rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={report.status === 'resolved' ? 'success' : 'warning'}>
                                  {report.status}
                                </Badge>
                                <span className="text-sm text-[var(--foreground-tertiary)]">
                                  {new Date(report.sentAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="font-medium mb-1">{report.roundName}</p>
                              <p className="text-[var(--foreground-secondary)] text-sm mb-2">
                                Round status: {report.roundStatus} • Committee: {report.committeeRankingStatus} • Allocations: {report.allocationCount}
                              </p>
                              <p className="text-xs text-[var(--foreground-tertiary)]">
                                Sent by user: {report.sentByUserId}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              {report.status !== 'resolved' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateStatusMutation.mutate({
                                    id: report.id,
                                    status: 'resolved'
                                  })}
                                  disabled={updateStatusMutation.isPending}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Resolve
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteReportMutation.mutate(report.id)}
                                disabled={deleteReportMutation.isPending}
                                className="text-[var(--color-red)]"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1">
            <Card variant="default" className="sticky top-8">
              <CardHeader>
                <CardTitle size="sm">Quick Help</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  <div className="p-4 border-b border-[var(--border)]">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="w-5 h-5 text-[var(--color-yellow)]" />
                      <span className="font-medium">Need immediate help?</span>
                    </div>
                    <p className="text-sm text-[var(--foreground-secondary)] mb-3">
                      Our AI assistant is available 24/7 to answer your questions.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('chat')}
                      className="w-full"
                    >
                      Start Chat
                    </Button>
                  </div>
                  
                  <div className="p-4 border-b border-[var(--border)]">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-[var(--color-purple)]" />
                      <span className="font-medium">Office Hours</span>
                    </div>
                    <p className="text-sm text-[var(--foreground-secondary)]">
                      {contactInfo[role].hours}
                    </p>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-[var(--color-green)]" />
                      <span className="font-medium">Support Team</span>
                    </div>
                    <p className="text-sm text-[var(--foreground-secondary)] mb-3">
                      Dedicated support for {roleLabelMap[role].toLowerCase()}s
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('contact')}
                      className="w-full"
                    >
                      Contact Team
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
