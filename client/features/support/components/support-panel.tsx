"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
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
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
  CheckCircle,
  Zap
} from "lucide-react";
import { toast } from "sonner";

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
  helpful: number;
  views: number;
}

export function SupportPanel() {
  const [activeTab, setActiveTab] = useState<'chat' | 'faq' | 'contact'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI housing assistant for University of Gondar. I can help you with housing applications, eligibility criteria, document requirements, and allocation processes. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Professional FAQ data
  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'How do I apply for housing at University of Gondar?',
      answer: 'To apply for housing: 1) Login to your dashboard, 2) Navigate to "New Application" in the housing section, 3) Fill out all required personal and academic information, 4) Upload necessary documents (ID, academic certificates, proof of employment), 5) Submit your application and wait for committee review. The process typically takes 2-3 weeks.',
      category: 'Applications',
      helpful: 89,
      views: 245
    },
    {
      id: '2',
      question: 'What are the eligibility criteria for housing allocation?',
      answer: 'Eligibility requirements: 1) Must be a permanent employee of University of Gondar, 2) Must have completed the probation period (minimum 6 months), 3) No disciplinary actions in the last 12 months, 4) Must meet minimum service years based on housing type (Studio: 1 year, 1-Bedroom: 2 years, 2-Bedroom: 3 years), 5) All required documentation must be submitted.',
      category: 'Eligibility',
      helpful: 92,
      views: 189
    },
    {
      id: '3',
      question: 'How is the housing allocation scoring system calculated?',
      answer: 'The allocation scoring system uses weighted criteria: Educational Title (40% - PhD: 40pts, Masters: 30pts, Bachelor: 20pts, Diploma: 10pts), Service Years (35% - 1 year: 5pts, 2-5 years: 15pts, 6-10 years: 25pts, 10+ years: 35pts), University Responsibility (10% - Administrative roles: 10pts, Teaching: 7pts, Support: 5pts), Family Condition (10% - Married with children: 10pts, Married: 7pts, Single: 3pts), Special Conditions (5% - Disability: 5pts, Emergency: 3pts).',
      category: 'Allocation',
      helpful: 87,
      views: 156
    },
    {
      id: '4',
      question: 'What documents are required for housing application?',
      answer: 'Required documents: 1) Valid University ID card, 2) Academic certificates (highest degree), 3) Proof of employment (appointment letter), 4) Marriage certificate (if applicable), 5) Birth certificates of dependents (if applicable), 6) Recent passport-sized photograph, 7) Proof of no disciplinary action from HR, 8) Tax clearance certificate. All documents must be clear, recent, and in PDF format.',
      category: 'Documents',
      helpful: 85,
      views: 134
    },
    {
      id: '5',
      question: 'How can I check my application status?',
      answer: 'To check your application status: 1) Login to your dashboard, 2) Go to "My Applications" section, 3) Click on your application to view detailed status, 4) Status updates include: Submitted, Under Review, Committee Evaluation, Approved, Rejected, or Pending Additional Information. You will receive email notifications for any status changes.',
      category: 'Status',
      helpful: 91,
      views: 178
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getLocalResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase().trim();
    
    // Housing applications
    if (lowerMessage.includes('apply') || lowerMessage.includes('application')) {
      return 'To apply for housing at University of Gondar: 1) Login to your dashboard, 2) Navigate to "New Application" in the housing section, 3) Fill out all required personal and academic information, 4) Upload necessary documents (ID, academic certificates, proof of employment), 5) Submit your application and wait for committee review. The process typically takes 2-3 weeks.';
    }
    
    // Eligibility criteria
    if (lowerMessage.includes('eligible') || lowerMessage.includes('criteria') || lowerMessage.includes('requirement')) {
      return 'Eligibility requirements for University of Gondar housing: 1) Must be a permanent employee of University of Gondar, 2) Must have completed probation period (minimum 6 months), 3) No disciplinary actions in the last 12 months, 4) Must meet minimum service years based on housing type (Studio: 1 year, 1-Bedroom: 2 years, 2-Bedroom: 3 years), 5) All required documentation must be submitted.';
    }
    
    // Documents
    if (lowerMessage.includes('document') || lowerMessage.includes('paper') || lowerMessage.includes('certificate')) {
      return 'Required documents for housing application: 1) Valid University ID card, 2) Academic certificates (highest degree), 3) Proof of employment (appointment letter), 4) Marriage certificate (if applicable), 5) Birth certificates of dependents (if applicable), 6) Recent passport-sized photograph, 7) Proof of no disciplinary action from HR, 8) Tax clearance certificate. All documents must be clear, recent, and in PDF format.';
    }
    
    // Status checking
    if (lowerMessage.includes('status') || lowerMessage.includes('check') || lowerMessage.includes('progress')) {
      return 'To check your housing application status: 1) Login to your dashboard, 2) Go to "My Applications" section, 3) Click on your application to view detailed status. Status updates include: Submitted, Under Review, Committee Evaluation, Approved, Rejected, or Pending Additional Information. You will receive email notifications for any status changes.';
    }
    
    // Allocation/scoring
    if (lowerMessage.includes('allocation') || lowerMessage.includes('scoring') || lowerMessage.includes('points')) {
      return 'Housing allocation scoring system: Educational Title (40% - PhD: 40pts, Masters: 30pts, Bachelor: 20pts, Diploma: 10pts), Service Years (35% - 1 year: 5pts, 2-5 years: 15pts, 6-10 years: 25pts, 10+ years: 35pts), University Responsibility (10% - Administrative roles: 10pts, Teaching: 7pts, Support: 5pts), Family Condition (10% - Married with children: 10pts, Married: 7pts, Single: 3pts), Special Conditions (5% - Disability: 5pts, Emergency: 3pts).';
    }
    
    // Housing types
    if (lowerMessage.includes('type') || lowerMessage.includes('room') || lowerMessage.includes('studio')) {
      return 'Available housing types at University of Gondar: Studio apartments (1 year service required), 1-Bedroom apartments (2 years service required), 2-Bedroom apartments (3 years service required). Allocation is based on points system and availability.';
    }
    
    // Contact/help
    if (lowerMessage.includes('contact') || lowerMessage.includes('help') || lowerMessage.includes('office')) {
      return 'For housing assistance: Main Office: +251 581 140 000 (Mon-Fri, 8:00 AM - 5:00 PM), Emergency: +251 581 140 001 (24/7), Email: housing@gondar.edu.et (Response within 24 hours), Office Location: Main Campus, Building A, Gondar, Ethiopia.';
    }
    
    // Default response
    return 'I can help you with housing applications, eligibility criteria, document requirements, application status, allocation processes, and contact information for University of Gondar housing. For specific inquiries about your application, please check your dashboard or contact the housing office at +251 581 140 000.';
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

    try {
      const response = await fetch("/api/chat/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: data.data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.message || 'Failed to get response');
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      
      // Use local fallback if API fails
      const fallbackResponse = getLocalResponse(messageText);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: fallbackResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFAQHelpful = (faqId: string, helpful: boolean) => {
    toast.success(helpful ? 'Thank you for your feedback!' : 'Thank you for helping us improve!');
  };

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
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <HelpCircle className="w-8 h-8 text-white" />
                </div>
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
                { id: 'contact', label: 'Contact', icon: Phone, color: 'purple' }
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
                  {filteredFAQs.map((faq) => (
                    <div key={faq.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                {faq.category}
                              </Badge>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Users className="w-4 h-4" />
                                <span>{faq.views} views</span>
                              </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                            
                            {expandedFAQ === faq.id && (
                              <div className="space-y-4">
                                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                                  <button
                                    onClick={() => handleFAQHelpful(faq.id, true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                  >
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>Helpful ({faq.helpful})</span>
                                  </button>
                                  <button
                                    onClick={() => handleFAQHelpful(faq.id, false)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                  >
                                    <ThumbsDown className="w-4 h-4" />
                                    <span>Not Helpful</span>
                                  </button>
                                </div>
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
                  ))}
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Phone Support</h3>
                      <p className="text-gray-600">Call us for immediate assistance</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">Main Office</p>
                      <p className="text-lg text-blue-600">+251 581 140 000</p>
                      <p className="text-sm text-gray-600">Monday - Friday, 8:00 AM - 5:00 PM</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="font-medium text-red-900">Emergency</p>
                      <p className="text-lg text-red-600">+251 581 140 001</p>
                      <p className="text-sm text-red-600">24/7 Available</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Email Support</h3>
                      <p className="text-gray-600">Send us detailed inquiries</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">General Inquiries</p>
                      <p className="text-blue-600">housing@gondar.edu.et</p>
                      <p className="text-sm text-gray-600">Response within 24 hours</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">Technical Support</p>
                      <p className="text-blue-600">tech@gondar.edu.et</p>
                      <p className="text-sm text-gray-600">Response within 12 hours</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 md:col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Office Location</h3>
                      <p className="text-gray-600">Visit us in person</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900 mb-2">Housing Office</p>
                      <p className="text-gray-700">Main Campus, Building A</p>
                      <p className="text-gray-700">Gondar, Ethiopia</p>
                      <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Mon-Fri: 8:00 AM - 5:00 PM</span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900 mb-2">Emergency Contacts</p>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-red-600">Campus Security:</span>
                          <span className="text-gray-700 ml-2">+251 581 140 999</span>
                        </div>
                        <div>
                          <span className="font-medium text-red-600">Medical:</span>
                          <span className="text-gray-700 ml-2">+251 581 140 888</span>
                        </div>
                        <div>
                          <span className="font-medium text-red-600">Fire:</span>
                          <span className="text-gray-700 ml-2">+251 581 140 777</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  <FileText className="w-5 h-5" />
                  <span>Application Guide</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  <CheckCircle className="w-5 h-5" />
                  <span>Check Eligibility</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  <AlertCircle className="w-5 h-5" />
                  <span>Application Status</span>
                </button>
              </div>
            </div>

            {/* Common Topics */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Topics</h3>
              <div className="space-y-2">
                {[
                  'How to apply for housing',
                  'Eligibility requirements',
                  'Document checklist',
                  'Allocation timeline',
                  'Housing types available'
                ].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setInputMessage(topic)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Support Status */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6" />
                <h3 className="text-lg font-semibold">AI Assistant Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Status</span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-300">Online</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Response Time</span>
                  <span className="text-green-300">&lt; 2 seconds</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Availability</span>
                  <span className="text-green-300">24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

