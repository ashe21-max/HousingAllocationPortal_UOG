"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  HelpCircle, 
  Search,
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  Zap,
  Sparkles,
  Users,
  Calendar,
  ExternalLink,
  Copy,
  RefreshCw,
  Mic,
  MicOff,
  Paperclip
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  responses: number;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  views: number;
  helpful: number;
  notHelpful: number;
}

export function SupportPanel() {
  const [activeTab, setActiveTab] = useState<'chat' | 'faq' | 'tickets' | 'contact'>('chat');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // FAQ Data
  const [faqs] = useState<FAQItem[]>([
    {
      id: '1',
      question: 'How do I apply for housing?',
      answer: 'To apply for housing, navigate to the Housing Applications section in your dashboard. Click on "New Application" and fill out the required information including your personal details, housing preferences, and supporting documents. Submit the application and wait for committee review.',
      category: 'applications',
      tags: ['housing', 'application', 'process'],
      views: 245,
      helpful: 189,
      notHelpful: 12
    },
    {
      id: '2',
      question: 'What are the eligibility criteria for housing?',
      answer: 'Eligibility criteria include: 1) Must be a permanent employee of Gondar University, 2) Must have completed probation period, 3) Must not have any disciplinary actions, 4) Must meet the minimum service years requirement based on housing type, 5) Must provide all required documentation.',
      category: 'eligibility',
      tags: ['eligibility', 'requirements', 'criteria'],
      views: 189,
      helpful: 167,
      notHelpful: 8
    },
    {
      id: '3',
      question: 'How is housing allocation determined?',
      answer: 'Housing allocation is based on a points system: Educational Title (40%), Service Years (35%), University Responsibility (10%), Family Condition (10%), and Special Conditions (5%). The committee reviews applications and allocates housing based on total points and availability.',
      category: 'allocation',
      tags: ['allocation', 'points', 'scoring'],
      views: 156,
      helpful: 142,
      notHelpful: 5
    }
  ]);

  // Support Tickets Data
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: '1',
      ticketNumber: 'TKT-2024-001',
      subject: 'Application Status Inquiry',
      description: 'I would like to check the status of my housing application submitted last month.',
      category: 'application',
      priority: 'medium',
      status: 'in_progress',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12'),
      responses: 2
    },
    {
      id: '2',
      ticketNumber: 'TKT-2024-002',
      subject: 'Document Upload Issue',
      description: 'I am unable to upload my academic certificates due to file size limitations.',
      category: 'technical',
      priority: 'high',
      status: 'open',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      responses: 1
    }
  ]);

  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: '',
    priority: 'medium' as const
  });

  useEffect(() => {
    // Initialize chat with welcome message
    setChatMessages([
      {
        id: '1',
        type: 'bot',
        content: 'Hello! I\'m your AI assistant. How can I help you today? You can ask me about housing applications, eligibility criteria, or any other questions you might have.',
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom of chat
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateAIResponse(currentMessage),
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('apply') || message.includes('application')) {
      return 'To apply for housing, go to the Housing Applications section in your dashboard. Click "New Application" and fill out all required fields. Make sure you have all necessary documents ready before starting the application process.';
    } else if (message.includes('eligible') || message.includes('criteria')) {
      return 'Eligibility criteria include being a permanent employee, completing probation, having no disciplinary actions, meeting minimum service years, and providing all required documentation.';
    } else if (message.includes('points') || message.includes('scoring')) {
      return 'The scoring system is: Educational Title (40%), Service Years (35%), University Responsibility (10%), Family Condition (10%), and Special Conditions (5%). Total points determine housing allocation priority.';
    } else {
      return 'I understand you have a question. For specific inquiries about your application, please check your dashboard or contact the Housing Committee directly. For general questions about applications, eligibility, documents, or the allocation process, I\'m here to help.';
    }
  };

  const handleFAQHelpful = (faqId: string, helpful: boolean) => {
    console.log(`FAQ ${faqId} marked as ${helpful ? 'helpful' : 'not helpful'}`);
  };

  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.description || !newTicket.category) {
      return;
    }

    const ticket: SupportTicket = {
      id: Date.now().toString(),
      ticketNumber: `TKT-${new Date().getFullYear()}-${String(tickets.length + 1).padStart(3, '0')}`,
      subject: newTicket.subject,
      description: newTicket.description,
      category: newTicket.category,
      priority: newTicket.priority,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      responses: 0
    };

    setTickets(prev => [ticket, ...prev]);
    setNewTicket({ subject: '', description: '', category: '', priority: 'medium' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="page-shell">
      <div className="container animate-fade-in">
        {/* Header */}
        <Card variant="elevated" className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-green)] to-[var(--color-green-dark)] rounded-xl flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle size="lg" className="text-[var(--foreground)]">Support Center</CardTitle>
                  <CardDescription>Get help with housing applications, technical issues, and more</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--foreground)]">24/7</div>
                  <div className="text-sm text-[var(--foreground-secondary)]">Support Available</div>
                </div>
                <div className="relative">
                  <div className="w-12 h-12 bg-[var(--color-green)]/10 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-[var(--color-green)] rounded-full animate-pulse" />
                  </div>
                  <div className="absolute inset-0 bg-[var(--color-green)]/20 rounded-full animate-ping" />
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Navigation */}
        <Card variant="default" className="mb-8">
          <CardContent className="p-0">
            <div className="flex flex-wrap gap-2 p-1">
              {[
                { id: 'chat', label: 'AI Chat', icon: MessageCircle, color: 'blue' },
                { id: 'faq', label: 'FAQ', icon: HelpCircle, color: 'green' },
                { id: 'tickets', label: 'Tickets', icon: Ticket, color: 'yellow' },
                { id: 'contact', label: 'Contact', icon: Phone, color: 'red' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    variant={isActive ? 'primary' : 'ghost'}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-lg)]
                      transition-all duration-[var(--transition-normal)] relative overflow-hidden
                      ${isActive 
                        ? 'bg-[var(--color-' + tab.color + ')] text-white shadow-md' 
                        : 'hover:bg-[var(--color-' + tab.color + ')]/10 hover:text-[var(--color-' + tab.color + ')]'
                      }
                    `}
                  >
                    <tab.icon className={`w-4 h-4 transition-transform duration-[var(--transition-normal)] ${
                      isActive ? 'scale-110' : ''
                    }`} />
                    <span className="font-medium">{tab.label}</span>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                    )}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* AI Chat Tab */}
          {activeTab === 'chat' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chat Area */}
              <div className="lg:col-span-2">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="w-5 h-5 text-blue-600" />
                      AI Assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-0">
                    <div className="flex-1 p-4 overflow-y-auto">
                      <div className="space-y-4">
                        {chatMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            {message.type === 'bot' && (
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Bot className="w-4 h-4 text-blue-600" />
                              </div>
                            )}
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                message.type === 'user'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {formatTime(message.timestamp)}
                              </p>
                            </div>
                            {message.type === 'user' && (
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-600" />
                              </div>
                            )}
                          </div>
                        ))}
                        {isTyping && (
                          <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Bot className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="bg-gray-100 rounded-lg p-3">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>
                    </div>
                    
                    {/* Input Area */}
                    <div className="border-t p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsRecording(!isRecording)}
                          className={isRecording ? 'text-red-600' : ''}
                        >
                          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Paperclip className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 relative">
                          <textarea
                            ref={inputRef}
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="w-full min-h-[40px] p-2 border rounded-lg resize-none"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                        </div>
                        <Button onClick={handleSendMessage} disabled={!currentMessage.trim()}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="ghost" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Application Guide
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Check Eligibility
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Clock className="w-4 h-4 mr-2" />
                      Application Status
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Common Topics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {['How to apply', 'Eligibility criteria', 'Document requirements', 'Application status', 'Housing allocation'].map((topic) => (
                      <Button
                        key={topic}
                        variant="ghost"
                        className="w-full justify-start text-sm"
                        onClick={() => setCurrentMessage(topic)}
                      >
                        {topic}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  label="Search FAQs"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* FAQ Items */}
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <Card key={faq.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{faq.category}</Badge>
                            <div className="flex gap-1">
                              {faq.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                          
                          {expandedFAQ === faq.id ? (
                            <div className="space-y-3">
                              <p className="text-gray-700">{faq.answer}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{faq.views} views</span>
                                <span>{faq.helpful} found helpful</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleFAQHelpful(faq.id, true)}
                                >
                                  <ThumbsUp className="w-4 h-4 mr-1" />
                                  Helpful
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleFAQHelpful(faq.id, false)}
                                >
                                  <ThumbsDown className="w-4 h-4 mr-1" />
                                  Not Helpful
                                </Button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                        >
                          {expandedFAQ === faq.id ? 'Show Less' : 'Show More'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              {/* Create New Ticket */}
              <Card>
                <CardHeader>
                  <CardTitle>Create New Ticket</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Subject"
                      value={newTicket.subject}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Brief description of your issue"
                    />
                    <Input
                      label="Category"
                      value={newTicket.category}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTicket(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Select category"
                    />
                  </div>
                  <div className="mt-4">
                    <Input
                      label="Description"
                      value={newTicket.description}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed description of your issue..."
                    />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={handleCreateTicket}>Create Ticket</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Existing Tickets */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{ticket.ticketNumber}</Badge>
                              <Badge className={getPriorityColor(ticket.priority)}>
                                {ticket.priority}
                              </Badge>
                              <Badge className={getStatusColor(ticket.status)}>
                                {ticket.status}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-lg mb-1">{ticket.subject}</h3>
                            <p className="text-gray-600 mb-2">{ticket.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Created: {formatDate(ticket.createdAt)}</span>
                              <span>Updated: {formatDate(ticket.updatedAt)}</span>
                              <span>{ticket.responses} responses</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-blue-600" />
                    Phone Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">Main Office</p>
                      <p className="text-gray-600">+251 581 140 000</p>
                      <p className="text-sm text-gray-500">Mon-Fri, 8:00 AM - 5:00 PM</p>
                    </div>
                    <div>
                      <p className="font-medium">Emergency</p>
                      <p className="text-gray-600">+251 581 140 001</p>
                      <p className="text-sm text-gray-500">24/7 Available</p>
                    </div>
                    <Button variant="ghost" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    Email Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">General Inquiries</p>
                      <p className="text-gray-600">housing@gondar.edu.et</p>
                      <p className="text-sm text-gray-500">Response within 24 hours</p>
                    </div>
                    <div>
                      <p className="font-medium">Technical Support</p>
                      <p className="text-gray-600">tech@gondar.edu.et</p>
                      <p className="text-sm text-gray-500">Response within 12 hours</p>
                    </div>
                    <Button variant="ghost" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    Live Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">Available Agents</p>
                      <p className="text-2xl font-bold text-green-600">3 Online</p>
                      <p className="text-sm text-gray-500">Average wait: 2 minutes</p>
                    </div>
                    <Button variant="primary" className="w-full">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Start Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Office Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">Housing Office</p>
                      <p className="text-gray-600">Main Campus, Building A</p>
                      <p className="text-gray-600">Gondar, Ethiopia</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Mon-Fri: 8:00 AM - 5:00 PM</span>
                    </div>
                    <Button variant="ghost" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-red-600">Campus Security</p>
                      <p className="text-gray-600">+251 581 140 999</p>
                    </div>
                    <div>
                      <p className="font-medium text-red-600">Medical Emergency</p>
                      <p className="text-gray-600">+251 581 140 888</p>
                    </div>
                    <div>
                      <p className="font-medium text-red-600">Fire Department</p>
                      <p className="text-gray-600">+251 581 140 777</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

