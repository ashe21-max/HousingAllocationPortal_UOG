import type { Request, Response } from "express";
import axios from "axios";

// Simple cache for common responses (optional optimization)
const responseCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute cache

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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

      // Try OpenAI API if key is available
      if (OPENAI_API_KEY) {
        try {
          const openaiResponse = await retryWithBackoff(async () => {
            return await axios.post(
              'https://api.openai.com/v1/chat/completions',
              {
                model: 'gpt-3.5-turbo',
                messages: [
                  {
                    role: 'system',
                    content: 'You are a helpful housing assistant for University of Gondar. Provide accurate, helpful information about housing applications, eligibility criteria, document requirements, application status, allocation processes, and contact information. Be concise and professional.'
                  },
                  {
                    role: 'user',
                    content: message
                  }
                ],
                max_tokens: 500,
                temperature: 0.7
              },
              {
                headers: {
                  'Authorization': `Bearer ${OPENAI_API_KEY}`,
                  'Content-Type': 'application/json'
                }
              }
            );
          });

          const aiResponse = openaiResponse.data.choices[0]?.message?.content || ChatController.getIntelligentResponse(message);
          
          // Cache the response
          setCachedResponse(message, aiResponse);

          return res.status(200).json({
            success: true,
            message: "Chat response successful",
            data: {
              response: aiResponse,
            },
          });
        } catch (openaiError: any) {
          console.error('OpenAI API Error:', openaiError.message);
          // Fall back to local response
        }
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
      return 'Hello! I\'m your housing assistant for University of Gondar. How can I help you today? You can ask me about housing applications, eligibility criteria, document requirements, application status, allocation processes, or housing rules.';
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
    return 'I can help you with housing applications, eligibility criteria, document requirements, allocation scoring, housing rules, rights and obligations, and contact information for University of Gondar housing. Ask me about applications, scoring criteria, housing types, or any housing-related topic.';
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
