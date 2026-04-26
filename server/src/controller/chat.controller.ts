import type { Request, Response } from "express";
import axios from "axios";

// Simple cache for common responses (optional optimization)
const responseCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute cache

function getCachedResponse(message: string): string | null {
  const cacheKey = message.toLowerCase().trim();
  const cached = responseCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.response;
  }
  
  return null;
}

function setCachedResponse(message: string, response: string): void {
  const cacheKey = message.toLowerCase().trim();
  responseCache.set(cacheKey, { response, timestamp: Date.now() });
}

// Retry logic for rate limiting
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      if (error.response?.status === 429 && attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}

export class ChatController {
  static async chatWithAI(req: Request, res: Response) {
    const { message } = req.body;

    try {
      if (!message) {
        return res.status(400).json({
          success: false,
          message: "Message is required",
        });
      }

      // Check cache first
      const cachedResponse = getCachedResponse(message);
      if (cachedResponse) {
        return res.status(200).json({
          success: true,
          message: "Chat response successful (cached)",
          data: {
            response: cachedResponse,
          },
        });
      }

      // Generate intelligent local response
      const localResponse = ChatController.getIntelligentResponse(message);
      
      // Cache the response
      setCachedResponse(message, localResponse);

      return res.status(200).json({
        success: true,
        message: "Chat response successful",
        data: {
          response: localResponse,
        },
      });

    } catch (error: any) {
      console.error("Chat Error:", error);
      
      // Return fallback response
      const fallbackResponse = ChatController.getIntelligentResponse(message);
      return res.status(200).json({
        success: true,
        message: "Chat response successful",
        data: {
          response: fallbackResponse,
        },
      });
    }
  }

  private static getIntelligentResponse(message: string): string {
    const lowerMessage = message.toLowerCase().trim();
    
    // Greetings
    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      return 'Hello! I\'m your housing assistant for University of Gondar. How can I help you today? You can ask me about housing applications, eligibility criteria, document requirements, application status, or allocation processes.';
    }
    
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
    
    // How are you
    if (lowerMessage.includes('how are you') || lowerMessage.includes('how do you do')) {
      return 'I\'m doing great, thank you! I\'m here to help you with any housing-related questions at University of Gondar. What would you like to know about housing applications, eligibility, or any other housing services?';
    }
    
    // Thanks
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return 'You\'re welcome! I\'m happy to help with any housing questions. Is there anything else about University of Gondar housing that I can assist you with?';
    }
    
    // Bye
    if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      return 'Goodbye! Feel free to come back anytime if you have more questions about housing at University of Gondar. Have a great day!';
    }
    
    // Default response
    return 'I can help you with housing applications, eligibility criteria, document requirements, application status, allocation processes, and contact information for University of Gondar housing. For specific inquiries about your application, please check your dashboard or contact the housing office at +251 581 140 000.';
  }

  private static getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('apply') || lowerMessage.includes('application')) {
      return 'To apply for housing at University of Gondar: 1) Login to your dashboard, 2) Navigate to "New Application", 3) Fill out all required information, 4) Upload necessary documents (ID, certificates, employment proof), 5) Submit and wait for committee review (2-3 weeks).';
    }
    
    if (lowerMessage.includes('eligible') || lowerMessage.includes('criteria')) {
      return 'Eligibility requirements: 1) Permanent employee of University of Gondar, 2) Completed probation (6+ months), 3) No disciplinary actions (12 months), 4) Minimum service years based on housing type (Studio: 1 year, 1-Bedroom: 2 years, 2-Bedroom: 3 years), 5) All required documentation.';
    }
    
    if (lowerMessage.includes('document') || lowerMessage.includes('papers')) {
      return 'Required documents: 1) Valid University ID, 2) Academic certificates (highest degree), 3) Proof of employment (appointment letter), 4) Marriage certificate (if applicable), 5) Birth certificates of dependents (if applicable), 6) Recent passport photo, 7) No disciplinary action proof, 8) Tax clearance certificate.';
    }
    
    if (lowerMessage.includes('status') || lowerMessage.includes('check')) {
      return 'To check application status: 1) Login to dashboard, 2) Go to "My Applications", 3) Click on your application to view status. Status updates include: Submitted, Under Review, Committee Evaluation, Approved, Rejected, or Pending Additional Information. Email notifications are sent for status changes.';
    }
    
    if (lowerMessage.includes('allocation') || lowerMessage.includes('scoring')) {
      return 'Housing allocation scoring: Educational Title (40% - PhD: 40pts, Masters: 30pts, Bachelor: 20pts, Diploma: 10pts), Service Years (35% - 1-5 years: 15pts, 6-10 years: 25pts, 10+ years: 35pts), University Responsibility (10% - Administrative: 10pts, Teaching: 7pts, Support: 5pts), Family Condition (10% - Married with children: 10pts, Married: 7pts, Single: 3pts), Special Conditions (5% - Disability: 5pts, Emergency: 3pts).';
    }
    
    return 'I can help you with housing applications, eligibility criteria, document requirements, application status, and allocation processes at University of Gondar. For specific inquiries about your application, please check your dashboard or contact the housing office at +251 581 140 000.';
  }
}
