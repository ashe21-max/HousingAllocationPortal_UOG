"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: role === 'LECTURER' 
        ? 'Hello! I\'m your AI housing assistant for University of Gondar lecturers. I can help you with housing applications, eligibility criteria, document requirements, and application status tracking. How can I assist you today?'
        : role === 'OFFICER'
        ? 'Hello! I\'m your AI housing assistant for University of Gondar housing officers. I can help you with housing unit management, application processing, allocation decisions, and availability updates. How can I assist you today?'
        : role === 'COMMITTEE'
        ? 'Hello! I\'m your AI housing assistant for University of Gondar committee members. I can help you with application reviews, scoring criteria, committee meetings, and allocation decisions. How can I assist you today?'
        : role === 'ADMIN'
        ? 'Hello! I\'m your AI housing assistant for University of Gondar administrators. I can help you with system administration, user management, report generation, and system settings. How can I assist you today?'
        : 'Hello! I\'m your AI housing assistant for University of Gondar. How can I assist you today?',
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
        answer: 'Access your dashboard, go to "Housing Allocations" section, view available units, review applicant eligibility scores, and make allocation decisions based on priority and availability.',
        category: 'Allocations'
      },
      {
        id: '2',
        question: 'What are my responsibilities as a housing officer?',
        answer: 'As a housing officer, you are responsible for reviewing applications, managing allocations, maintaining housing unit records, handling tenant requests, and ensuring compliance with university housing policies.',
        category: 'Responsibilities'
      },
      {
        id: '3',
        question: 'How do I update housing availability?',
        answer: 'Navigate to "Housing Management" in your dashboard, select the unit type, update availability status, set occupancy limits, and save changes. The system will automatically notify eligible applicants.',
        category: 'Management'
      }
    ],
    COMMITTEE: [
      {
        id: '1',
        question: 'How do I review housing applications?',
        answer: 'Access the "Application Review" section in your dashboard, view assigned applications, check eligibility criteria, review scoring calculations, and provide recommendations for allocation decisions.',
        category: 'Reviews'
      },
      {
        id: '2',
        question: 'What is the scoring system for housing allocation?',
        answer: 'The scoring system considers: Educational Title (40%), Service Years (35%), University Responsibility (10%), Family Condition (10%), and Special Conditions (5%). Total score determines allocation priority.',
        category: 'Scoring'
      },
      {
        id: '3',
        question: 'How do committee meetings work?',
        answer: 'Committee meetings are scheduled weekly to review applications, discuss allocation decisions, address special cases, and approve final housing allocations. Meeting minutes are recorded and stored in the system.',
        category: 'Meetings'
      }
    ],
    ADMIN: [
      {
        id: '1',
        question: 'How do I manage user accounts?',
        answer: 'Go to "User Management" in your dashboard, view all users, create new accounts, update user roles, reset passwords, and manage permissions. All changes are logged for audit purposes.',
        category: 'User Management'
      },
      {
        id: '2',
        question: 'How do I generate housing reports?',
        answer: 'Access the "Reports" section, select report type (allocation summary, occupancy rates, applicant statistics), set date range, and export reports in PDF or Excel format.',
        category: 'Reports'
      },
      {
        id: '3',
        question: 'What system settings can I configure?',
        answer: 'As admin, you can configure housing policies, scoring criteria, application deadlines, notification settings, user roles, and system backup schedules. All changes require proper authorization.',
        category: 'System Settings'
      }
    ]
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getLocalResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase().trim();
    
    // Greetings - handle these first
    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey') || lowerMessage === 'hii') {
      return 'Hello! I\'m your housing assistant for University of Gondar. How can I help you today? You can ask me about housing applications, eligibility criteria, document requirements, application status, allocation processes, or housing rules.';
    }
    
    // How are you
    if (lowerMessage.includes('how are you') || lowerMessage.includes('how do you do')) {
      return 'I\'m doing great, thank you! I\'m here to help you with any housing-related questions at University of Gondar. What would you like to know about housing applications, eligibility, or any other housing services?';
    }
    
    // Thanks
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return 'You\'re welcome! I\'m happy to help with any housing questions. Is there anything else about University of Gondar housing that I can assist you with?';
    }
    
    // Bye
    if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye') || lowerMessage === 'stpo') {
      return 'Goodbye! Feel free to come back anytime if you have more questions about housing at University of Gondar. Have a great day!';
    }
    
    // Stop
    if (lowerMessage.includes('stop') || lowerMessage.includes('stpo')) {
      return 'I understand. If you need help with anything else regarding University of Gondar housing, just let me know. I\'m here to assist you!';
    }
    
    // Housing applications
    if (lowerMessage.includes('apply') || lowerMessage.includes('application')) {
      return 'To apply for housing at University of Gondar: 1) Complete the housing application form, 2) Submit required documents (academic certificates, proof of employment, marriage certificate if applicable), 3) Submit to the Housing Management Directorate, 4) Wait for committee review and scoring. Applications are accepted three times per year during the first weeks of October, February, and June.';
    }
    
    // Eligibility criteria
    if (lowerMessage.includes('eligible') || lowerMessage.includes('criteria') || lowerMessage.includes('requirement')) {
      return 'Eligibility requirements for University of Gondar housing: 1) Must be a permanent academic staff member (teaching, research, or community service), 2) Must meet the scoring criteria based on educational title, service years, university responsibility, family condition, and educational level. Scoring is competitive and based on a 100-point system.';
    }
    
    // Documents
    if (lowerMessage.includes('document') || lowerMessage.includes('paper') || lowerMessage.includes('certificate')) {
      return 'Required documents for housing application: 1) Completed application form, 2) Academic certificates (highest degree), 3) Proof of employment/academic appointment, 4) Marriage certificate (if applicable), 5) Medical evidence for special conditions (if applicable), 6) Personal condition evidence. All documents must be submitted with the application form.';
    }
    
    // Status checking
    if (lowerMessage.includes('status') || lowerMessage.includes('check') || lowerMessage.includes('progress')) {
      return 'To check your housing application status: 1) Contact the Housing Management Directorate, 2) Check announcement boards on campus, 3) Results are announced after committee review. Successful applicants have 15 working days to accept and sign the housing usage contract.';
    }
    
    // Allocation/scoring
    if (lowerMessage.includes('allocation') || lowerMessage.includes('scoring') || lowerMessage.includes('points')) {
      return 'Housing allocation scoring system (100 points total): Educational Title (40% - Professor: 40pts, Associate Professor: 37pts, Assistant Professor: 34pts, Lecturer: 31pts, Assistant Lecturer: 25pts, Assistant Graduate II: 20pts, Assistant Graduate I: 15pts), Service Years (35% - 15+ years: 35pts, each year at university: 2.33pts), University Responsibility (10% - Deans/Directors: 10pts, Vice Deans: 9pts, Officials: 8pts, Unit Heads: 6pts, Coordinators: 4pts), Family Condition (10% - Married unable to have children: 10pts, Married with children: 8pts, Married without children: 5pts), Educational Level (5% - PhD: 5pts, Masters: 3pts, Bachelor: 1pt). Special additional points: Female teachers (5%), HIV/AIDS positive (3%), Physically disabled (5%).';
    }
    
    // Housing types
    if (lowerMessage.includes('type') || lowerMessage.includes('room') || lowerMessage.includes('studio')) {
      return 'Available housing types at University of Gondar: Studio apartments, 1-Bedroom apartments, 2-Bedroom apartments, Special houses for high-ranking officials, and Guest houses. Allocation is based on the competitive scoring system and availability.';
    }
    
    // Application schedule
    if (lowerMessage.includes('schedule') || lowerMessage.includes('when') || lowerMessage.includes('time')) {
      return 'Housing applications are accepted three times per year during the first week of October, February, and June. The Housing Management Directorate announces vacancies through campus notice boards and email. Registration and document collection typically take 7 working days.';
    }
    
    // Rights and obligations
    if (lowerMessage.includes('right') || lowerMessage.includes('obligation') || lowerMessage.includes('rule') || lowerMessage.includes('responsibility')) {
      return 'Resident rights and obligations: 1) Must sign housing usage contract within 10 working days of allocation, 2) Annual lease renewal is required, 3) Cannot sublet or rent to others, 4) Cannot keep pets in university housing, 5) Cannot make structural changes without permission, 6) Must maintain university property and report damages, 7) Must report extended absences (3-day reporting intervals for 30-day periods), 8) Must vacate when leaving university employment or for education elsewhere.';
    }
    
    // Home allowance
    if (lowerMessage.includes('allowance') || lowerMessage.includes('rent') || lowerMessage.includes('subsidy')) {
      return 'Home allowance is provided to teachers who do not receive university housing. It is paid monthly based on full month calculation. Payment stops when university housing is provided. Teachers going abroad for education may also receive home allowance during their study period.';
    }
    
    // Special conditions
    if (lowerMessage.includes('special') || lowerMessage.includes('disability') || lowerMessage.includes('medical')) {
      return 'Special housing considerations: 1) Physically disabled teachers may be assigned ground floor or first floor housing based on medical needs, 2) Female teachers receive 5% additional points, 3) HIV/AIDS positive teachers receive 3% additional points, 4) Physically disabled teachers receive 5% additional points. Medical evidence must be provided for special condition requests.';
    }
    
    // Contact/help
    if (lowerMessage.includes('contact') || lowerMessage.includes('help') || lowerMessage.includes('office')) {
      return 'For housing assistance: Contact the Housing Management Directorate, Public and International Relations: (+251) 588 940 290, Email: info@uog.edu.et, Address: Maraki Street, Gondar, Ethiopia.';
    }
    
    // Role-specific default responses
    const roleDefaults = {
      LECTURER: 'I can help you with housing applications, eligibility criteria, document requirements, allocation scoring, housing rules, rights and obligations, and contact information for University of Gondar housing. Ask me about applications, scoring criteria, housing types, or any housing-related topic.',
      OFFICER: 'I can assist you with housing unit management, application processing, allocation decisions, availability updates, and housing operations. For detailed procedures, refer to your dashboard or contact the Housing Management Directorate.',
      COMMITTEE: 'I can help with application reviews, scoring criteria, committee meetings, allocation decisions, and evaluation processes. For committee-specific procedures, check your dashboard or contact the committee chair.',
      ADMIN: 'I can assist with system administration, user management, report generation, system settings, and administrative workflows. For technical support, contact IT or check the admin documentation.'
    };
    
    return roleDefaults[role] || 'I can help you with housing applications, eligibility criteria, document requirements, allocation scoring, housing rules, rights and obligations, and contact information for University of Gondar housing. Ask me about applications, scoring criteria, housing types, or any housing-related topic.';
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Use local response directly
    const response = getLocalResponse(messageText);
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: response,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredFAQs = faqsByRole[role].filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Image
                  src="/ashuman.png"
                  alt="University of Gondar logo"
                  width={80}
                  height={50}
                  className="object-contain flex-shrink-0"
                  priority
                />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Housing Support Center</h1>
                  <p className="text-gray-600">Get comprehensive support for University of Gondar housing services</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">24/7</div>
                  <div className="text-sm text-gray-500">AI Support Available</div>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-2 border border-gray-200">
            <div className="flex gap-2">
              {[
                { id: 'chat', label: 'AI Assistant', icon: Bot, color: 'blue' },
                { id: 'faq', label: 'FAQ', icon: HelpCircle, color: 'green' },
                { id: 'contact', label: 'Contact', icon: Phone, color: 'purple' },
                ...(role === 'ADMIN' ? [{ id: 'reports', label: 'Allocation Reports', icon: FileText, color: 'orange' }] : []),
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* AI Chat Tab */}
            {activeTab === 'chat' && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                  <div className="flex items-center gap-3">
                    <Bot className="w-6 h-6" />
                    <h2 className="text-xl font-semibold">AI Housing Assistant</h2>
                    <div className="ml-auto flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">Online</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-[500px] flex flex-col">
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.type === 'ai' && (
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <div
                            className={`max-w-[80%] rounded-2xl p-4 ${
                              message.type === 'user'
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                : 'bg-gray-100 text-gray-900 border border-gray-200'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <p className={`text-xs mt-2 ${
                              message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                          {message.type === 'user' && (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-gray-600" />
                            </div>
                          )}
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex gap-3 justify-start">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-gray-100 rounded-2xl p-4 border border-gray-200">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                              </div>
                              <span className="text-sm text-gray-600">AI is thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 p-6">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about housing applications, eligibility, or any housing-related questions..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div className="space-y-6">
                {/* Search */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      label=""
                      placeholder="Search frequently asked questions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 py-3 border-gray-300 rounded-xl"
                    />
                  </div>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                  {filteredFAQs.length > 0 ? (
                    filteredFAQs.map((faq) => (
                      <div key={faq.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                  {faq.category}
                                </Badge>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                              
                              {expandedFAQ === faq.id && (
                                <div className="space-y-4">
                                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                                </div>
                              )}
                            </div>
                            
                            <button
                              onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                              className="ml-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              {expandedFAQ === faq.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No FAQs found</h3>
                      <p className="text-gray-600">
                        {searchQuery.trim() 
                          ? `No FAQs match "${searchQuery}". Try different keywords.` 
                          : "No FAQs available at the moment."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* University of Gondar Official Contacts */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-8 border border-blue-200 md:col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">University of Gondar Official Contacts</h3>
                      <p className="text-gray-600">Public and International Relations</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-white rounded-lg border border-blue-200">
                      <p className="font-medium text-gray-900 mb-2">Phone</p>
                      <p className="text-lg text-blue-600">(+251) 588 940 290</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-blue-200">
                      <p className="font-medium text-gray-900 mb-2">Email</p>
                      <p className="text-blue-600">info@uog.edu.et</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
                    <p className="font-medium text-gray-900 mb-2">Address</p>
                    <p className="text-gray-700">Maraki Street, Gondar, Ethiopia 196</p>
                  </div>
                  <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
                    <p className="font-medium text-gray-900 mb-4">Follow University of Gondar</p>
                    <div className="flex flex-wrap gap-4">
                      <a
                        href="https://web.facebook.com/TheUniversityofGondar?_rdc=1&_rdr#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Facebook className="w-5 h-5" />
                        <span>Facebook</span>
                      </a>
                      <a
                        href="https://www.youtube.com/channel/UCHCIpD0Qc7PRWUKpdb6A5yw"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Youtube className="w-5 h-5" />
                        <span>YouTube</span>
                      </a>
                      <a
                        href="https://x.com/UnivOfGondar"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <Globe className="w-5 h-5" />
                        <span>X (Twitter)</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reports Tab - Admin Only */}
            {activeTab === 'reports' && role === 'ADMIN' && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6" />
                    <h2 className="text-xl font-semibold">Allocation Reports</h2>
                  </div>
                </div>

                {reportsQuery.isLoading ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600">Loading reports...</p>
                  </div>
                ) : reportsQuery.isError ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-gray-600">Failed to load reports.</p>
                  </div>
                ) : !reportsQuery.data || reportsQuery.data.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Found</h3>
                    <p className="text-gray-600">No allocation reports have been submitted yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600">Round Name</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600">Status</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600">Allocations</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600">Sent By</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600">Sent At</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {reportsQuery.data.map((report) => (
                          <tr key={report.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="font-semibold text-gray-900">{report.roundName}</div>
                              <div className="text-sm text-gray-500">{report.roundStatus}</div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge
                                variant="secondary"
                                className={
                                  report.status === 'PENDING'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : report.status === 'APPROVED'
                                    ? 'bg-green-100 text-green-800'
                                    : report.status === 'REJECTED'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                }
                              >
                                {report.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{report.allocationCount}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{report.sentByUserId}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date(report.sentAt).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => {
                                    const blob = new Blob([JSON.stringify(report.reportData, null, 2)], {
                                      type: 'application/json',
                                    });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `allocation-report-${report.roundName.replace(/\s+/g, '-')}-${new Date(report.sentAt).toISOString().split('T')[0]}.json`;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                    URL.revokeObjectURL(url);
                                  }}
                                  className="gap-1"
                                >
                                  <Download className="w-4 h-4" />
                                  Download
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => deleteReportMutation.mutate(report.id)}
                                  busy={deleteReportMutation.isPending}
                                  className="gap-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Common Topics */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Topics</h3>
              <div className="space-y-2">
                {(() => {
                  const topics = 
                    role === 'LECTURER' ? [
                      'How to apply for housing',
                      'Eligibility requirements',
                      'Document checklist',
                      'Application status tracking',
                      'Allocation timeline'
                    ] :
                    role === 'OFFICER' ? [
                      'How to manage allocations',
                      'Update housing availability',
                      'Application processing',
                      'Unit assignment process',
                      'Occupancy reporting'
                    ] :
                    role === 'COMMITTEE' ? [
                      'Application review process',
                      'Scoring criteria',
                      'Committee meetings',
                      'Allocation decisions',
                      'Evaluation guidelines'
                    ] :
                    role === 'ADMIN' ? [
                      'User management',
                      'Report generation',
                      'System settings',
                      'Policy configuration',
                      'Audit procedures'
                    ] :
                    [
                      'Housing applications',
                      'Eligibility requirements',
                      'Document requirements',
                      'Allocation processes',
                      'Contact information'
                    ];
                  
                  return topics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setInputMessage(topic)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {topic}
                    </button>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

