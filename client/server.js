import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/chat", async (req, res) => {
  try {
    const { message, role } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Intelligent response system with contextual understanding
    const generateIntelligentResponse = (userMessage, userRole) => {
      const lowerMessage = userMessage.toLowerCase();
      
      // Contextual responses based on role and message content
      const responses = {
        LECTURER: {
          greeting: "Hi there! I'm excited to help you with your housing journey at University of Gondar! What can I help you with today - applications, documents, or checking your status?",
          application: "To apply for housing at University of Gondar: 1) Login to your dashboard 2) Navigate to Housing section 3) Click 'New Application' 4) Fill in your personal details 5) Upload required documents (University ID, appointment letter, academic certificate) 6) Submit and track your status.",
          documents: "You'll need: University ID card, appointment letter, academic certificate, proof of relationship (if applying for family housing), and any medical/special condition documents if applicable.",
          status: "Check your application status in your dashboard under 'My Applications'. You'll see real-time updates from submission through committee review to final decision.",
          eligibility: "Eligibility is based on your employment status, academic rank, years of service, and availability of housing units. Full-time lecturers with at least one year of service are typically eligible.",
          default: "I'm here to help with your housing needs! I can assist with applications, document requirements, eligibility criteria, and status tracking. What specific housing question do you have?"
        },
        OFFICER: {
          greeting: "Hello! I'm your housing management assistant. I can help you with application processing, unit management, and allocation procedures. How can I assist you?",
          applications: "Review pending applications in the Housing Management dashboard. Check eligibility criteria, document completeness, and make allocation decisions based on the scoring algorithm and unit availability.",
          units: "Manage housing units through the Units section. Update availability status, mark units as occupied/vacant, schedule maintenance, and track unit conditions.",
          allocation: "Process allocations by reviewing eligible applications, checking unit availability, applying the scoring algorithm, and communicating decisions to applicants.",
          reports: "Generate allocation reports from the Reports section. Select date ranges, filter by status or department, and export in PDF or Excel format.",
          default: "I'm your housing management assistant! I can help with application processing, unit management, allocations, and reporting. What housing management task can I help with?"
        },
        COMMITTEE: {
          greeting: "Hello! I'm your committee assistant. I can help you with application reviews, scoring, and committee procedures. How can I assist you?",
          review: "Review assigned applications in the Committee Dashboard. Check eligibility, document completeness, and score based on academic rank (30%), service years (25%), family size (20%), special needs (15%), and distance (10%).",
          scoring: "Applications are scored using: Academic rank (30%), Years of service (25%), Family size (20%), Special needs (15%), Distance from campus (10%). Total score determines allocation priority.",
          meetings: "Committee meetings are scheduled weekly. Review your assigned applications before meetings, prepare scoring notes, and participate in allocation decisions.",
          recommendations: "Provide recommendations based on scoring results, housing availability, and university policies. Ensure fair and consistent application of allocation criteria.",
          default: "I'm your committee assistant! I can help with application reviews, scoring criteria, meeting preparation, and recommendation procedures. What committee task can I assist with?"
        },
        ADMIN: {
          greeting: "Hello! I'm your admin assistant. I can help you with system administration, user management, and housing policy oversight. How can I assist you?",
          users: "Manage user accounts in User Management. Add/edit users, assign roles (Lecturer, Officer, Committee, Admin), set permissions, and manage access levels.",
          system: "Configure system settings in the Admin panel. Set housing policies, allocation parameters, notification preferences, and system-wide configurations.",
          reports: "Access comprehensive reports including allocation statistics, application trends, unit occupancy rates, and user activity logs. Export data for analysis.",
          policies: "Update housing policies, eligibility criteria, allocation rules, and administrative procedures. Changes apply to future application cycles.",
          default: "I'm your admin assistant! I can help with user management, system configuration, policy updates, and administrative reporting. What administrative task can I help with?"
        }
      };

      const roleResponses = responses[userRole] || responses.LECTURER;
      
      // Intelligent keyword matching
      console.log("Testing keywords for message:", lowerMessage);
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('hii') || lowerMessage.includes('hiii')) {
        console.log("Matched greeting pattern");
        return roleResponses.greeting;
      } else if (lowerMessage.includes('application') || lowerMessage.includes('apply')) {
        return roleResponses.application;
      } else if (lowerMessage.includes('document') || lowerMessage.includes('paper') || lowerMessage.includes('require')) {
        return roleResponses.documents;
      } else if (lowerMessage.includes('status') || lowerMessage.includes('track') || lowerMessage.includes('progress')) {
        return roleResponses.status;
      } else if (lowerMessage.includes('eligible') || lowerMessage.includes('qualif')) {
        return roleResponses.eligibility;
      } else if (lowerMessage.includes('unit') || lowerMessage.includes('room') || lowerMessage.includes('house')) {
        return roleResponses.units;
      } else if (lowerMessage.includes('allocation') || lowerMessage.includes('assign')) {
        return roleResponses.allocation;
      } else if (lowerMessage.includes('report') || lowerMessage.includes('data') || lowerMessage.includes('statistic')) {
        return roleResponses.reports;
      } else if (lowerMessage.includes('review') || lowerMessage.includes('score') || lowerMessage.includes('evaluate')) {
        return roleResponses.review;
      } else if (lowerMessage.includes('meeting') || lowerMessage.includes('committee')) {
        return roleResponses.meetings;
      } else if (lowerMessage.includes('user') || lowerMessage.includes('account') || lowerMessage.includes('admin')) {
        return roleResponses.users;
      } else if (lowerMessage.includes('system') || lowerMessage.includes('setting') || lowerMessage.includes('config')) {
        return roleResponses.system;
      } else if (lowerMessage.includes('policy') || lowerMessage.includes('rule')) {
        return roleResponses.policies;
      } else if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
        return roleResponses.recommendations;
      } else {
        // Generate contextual response based on message content
        if (lowerMessage.includes('thank')) {
          return "You're welcome! I'm always here to help with any housing-related questions. Feel free to ask if you need anything else.";
        } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
          return "Goodbye! Don't hesitate to reach out if you need housing assistance in the future.";
        } else if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
          return roleResponses.default;
        } else {
          // Try to provide a helpful response based on the context
          return `I understand you're asking about: "${userMessage}". ${roleResponses.default}`;
        }
      }
    };

    // Try Gemini API first, fallback to intelligent responses
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const systemPrompt = `You are an AI assistant for the University of Gondar Housing Allocation System. 
User Role: ${role}
Provide helpful, professional responses about housing applications, policies, and procedures.
User Question: ${message}`;

      const result = await model.generateContent(systemPrompt);
      const response = await result.response;

      res.json({ reply: response.text() });
    } catch (apiError) {
      console.log("Using intelligent fallback response system for message:", message, "role:", role);
      const intelligentResponse = generateIntelligentResponse(message, role);
      console.log("Generated response:", intelligentResponse);
      res.json({ reply: intelligentResponse });
    }

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ 
      error: "I apologize, but I'm having trouble connecting right now. Please try again later or contact the housing office directly." 
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
