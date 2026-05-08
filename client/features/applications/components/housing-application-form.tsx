'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { calculateCompleteScore } from '@/lib/housing-scoring';
import { apiRequest } from '@/lib/api/client';
import { getStoredSession } from '@/lib/auth/session-storage';
import { uploadDocument } from '@/lib/api/documents';

// Validation helper functions
const validatePhoneNumber = (phone: string): boolean => {
  // Must start with 09 and be 10 digits total
  const phoneRegex = /^09\d{8}$/;
  return phoneRegex.test(phone);
};

const validateStaffId = (staffId: string): boolean => {
  // Must be GUR/XXXXX/YY where XXXXX is 5 digits and YY > 20
  const staffIdRegex = /^GUR\/\d{5}\/(2[1-9]|[3-9]\d)$/;
  return staffIdRegex.test(staffId);
};

const validateEmail = (email: string): boolean => {
  // Must be a valid email ending with @uog.edu.et OR @gmail.com
  const emailRegex = /^[^\s@]+@(uog\.edu\.et|gmail\.com)$/i;
  return emailRegex.test(email);
};

const getCollegeFromDepartment = (department: string): string => {
  // Map department to college - in this system, departments are colleges
  const collegeMap: Record<string, string> = {
    'College of Medicine and Health Sciences': 'College of Medicine and Health Sciences',
    'College of Business and Economics': 'College of Business and Economics',
    'College of Natural and Computational Sciences': 'College of Natural and Computational Sciences',
    'College of Social Sciences and Humanities': 'College of Social Sciences and Humanities',
    'College of Agriculture and Environmental Sciences': 'College of Agriculture and Environmental Sciences',
    'College of Veterinary Medicine and Animal Sciences': 'College of Veterinary Medicine and Animal Sciences',
    'College of Education': 'College of Education',
    'College of Informatics': 'College of Informatics',
    'Institute of Technology': 'Institute of Technology',
    'Institute of Biotechnology': 'Institute of Biotechnology',
    'School of Law': 'School of Law',
  };
  return collegeMap[department] || department;
};

export interface ApplicationFormData {
  // Personal Information
  fullName: string;
  staffId: string;
  email: string;
  phoneNumber: string;
  college: string;
  department: string;

  // Academic & Employment Information
  educationalTitle: string;
  educationalLevel: string;
  startDateAtUog: string;
  otherServiceInstitution?: string;
  otherServiceDuration?: string;
  researchInstitution?: string;
  researchDuration?: string;
  teachingInstitution?: string;
  teachingDuration?: string;

  // Family Information
  responsibility: string;
  familyStatus: string;
  spouseName?: string;
  spouseStaffId?: string;
  numberOfDependents?: string;
  hasSpouseAtUog: boolean;

  // Special Conditions
  isFemale: boolean;
  isDisabled: boolean;
  hasChronicIllness: boolean;
}

interface ScoreBreakdown {
  educationalTitle: number;
  educationalLevel: number;
  serviceYears: number;
  responsibility: number;
  familyStatus: number;
  baseTotal: number;
  femaleBonus: number;
  disabilityBonus: number;
  chronicIllnessBonus: number;
  spouseBonus: number;
  final: number;
}

interface ApplicationRound {
  id: string;
  name: string;
  status: string;
  startsAt: string;
  endsAt: string;
}

interface Application {
  id: string;
  roundId?: string;
  notes?: string;
}

export function HousingApplicationForm() {
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: '',
    staffId: '',
    email: '',
    phoneNumber: '',
    college: '',
    department: '',
    educationalTitle: '',
    educationalLevel: '',
    startDateAtUog: '',
    otherServiceInstitution: '',
    otherServiceDuration: '',
    researchInstitution: '',
    researchDuration: '',
    teachingInstitution: '',
    teachingDuration: '',
    responsibility: '',
    familyStatus: '',
    spouseName: '',
    spouseStaffId: '',
    numberOfDependents: '',
    hasSpouseAtUog: false,
    isFemale: false,
    isDisabled: false,
    hasChronicIllness: false,
  });

  const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdown | null>(null);
  const [activeRounds, setActiveRounds] = useState<ApplicationRound[]>([]);
  const [selectedRound, setSelectedRound] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<{id: string; fileName: string}[]>([]);

  useEffect(() => {
    loadApplicationData();
    loadActiveRounds();
  }, []);

  const loadActiveRounds = async () => {
    try {
      const response = await apiRequest<{ rounds: ApplicationRound[] }>('/applications/options');
      console.log('Rounds response:', response); // Debug log
      
      // Extract rounds from the response object
      const rounds = response?.rounds || [];
      setActiveRounds(Array.isArray(rounds) ? rounds : []);
      // Don't auto-select any round - let user choose (default stays as '')
    } catch (error) {
      console.error('Error loading rounds:', error);
      setActiveRounds([]); // Ensure it's always an array
    }
  };

  const loadApplicationData = async () => {
    try {
      // Get user session data to pre-fill form
      const session = getStoredSession();
      if (session) {
        const college = session.department ? getCollegeFromDepartment(session.department) : '';
        setFormData(prev => ({
          ...prev,
          fullName: session.name || '',
          email: session.email || '',
          college: college,
          // Department is pre-filled with college name but can be edited
          department: session.department ? session.department.replace(/^College of |^Institute of |^School of /, '') : '',
        }));
      }

      // Load existing application
      const appData = await apiRequest<Application[]>('/applications/me');
      if (appData && appData.length > 0) {
        const latestApp = appData[0];
        if (latestApp.roundId) {
          setSelectedRound(latestApp.roundId);
        }
        
        // Parse notes if it contains form data - merge with existing data
        if (latestApp.notes) {
          try {
            const parsedData = JSON.parse(latestApp.notes);
            setFormData(prev => ({ ...prev, ...parsedData }));
          } catch {
            console.log('Could not parse existing application data');
          }
        }
      }
    } catch (error) {
      console.error('Error loading application data:', error);
    }
  };

  const handleInputChange = (field: keyof ApplicationFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png'];
      const validSize = file.size <= 5 * 1024 * 1024; // 5MB
      return validTypes.includes(file.type) && validSize;
    });

    if (validFiles.length !== files.length) {
      toast.error('Some files were rejected. Only PDF, DOC, DOCX, JPG, JPEG, PNG files under 5MB are allowed.');
    }

    if (selectedFiles.length + validFiles.length > 5) {
      toast.error('Maximum 5 files allowed');
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const calculateScore = async () => {
    // Check which required fields are missing
    const missingFields: string[] = [];
    if (!formData.fullName) missingFields.push('Full Name');
    if (!formData.staffId) missingFields.push('Staff ID / GUR ID');
    if (!formData.email) missingFields.push('Email Address');
    if (!formData.phoneNumber) missingFields.push('Phone Number');
    if (!formData.college) missingFields.push('College / Institute');
    if (!formData.department) missingFields.push('Unit');
    if (!formData.educationalTitle) missingFields.push('Educational Title');
    if (!formData.educationalLevel) missingFields.push('Educational Level');
    if (!formData.startDateAtUog) missingFields.push('Start Date at UOG');
    if (!formData.responsibility) missingFields.push('Responsibility');
    if (!formData.familyStatus) missingFields.push('Family Status');

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
      toast.error('Email must end with @uog.edu.et or @gmail.com');
      return;
    }

    // Validate phone number format
    if (!validatePhoneNumber(formData.phoneNumber)) {
      toast.error('Phone number must start with 09 and be 10 digits (e.g., 0997278931)');
      return;
    }

    // Validate Staff ID format
    if (!validateStaffId(formData.staffId)) {
      toast.error('Staff ID must be GUR/XXXXX/YY where YY > 20 (e.g., GUR/02264/21)');
      return;
    }

    const score = calculateCompleteScore({
      educationalTitle: formData.educationalTitle,
      educationalLevel: formData.educationalLevel,
      startDateAtUog: new Date(formData.startDateAtUog),
      responsibility: formData.responsibility,
      familyStatus: formData.familyStatus,
      isFemale: formData.isFemale,
      isDisabled: formData.isDisabled,
      hasChronicIllness: formData.hasChronicIllness,
      hasSpouseAtUog: formData.hasSpouseAtUog,
    });

    setScoreBreakdown(score);

    // Save score snapshot to backend
    try {
      // Calculate service years from start date
      const startDate = new Date(formData.startDateAtUog);
      const currentDate = new Date();
      const serviceYears = Math.floor((currentDate.getTime() - startDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

      await apiRequest('/score/save', {
        method: 'POST',
        body: {
          educationalTitle: formData.educationalTitle,
          educationalLevel: formData.educationalLevel,
          serviceYears: Math.max(0, serviceYears), // Ensure non-negative
          responsibility: formData.responsibility,
          familyStatus: formData.familyStatus,
          femaleBonusEligible: formData.isFemale,
          disabilityBonusEligible: formData.isDisabled,
          hivIllnessBonusEligible: formData.hasChronicIllness,
          spouseBonusEligible: formData.hasSpouseAtUog,
        },
      });

      toast.success('Score calculated and saved successfully!');
    } catch (error) {
      console.error('Score save error:', error);
      toast.error('Failed to save score');
    }
  };

  const handleSubmit = async (action: 'save' | 'submit' | 'clear' | 'edit') => {
    if (action === 'clear') {
      setFormData({
        fullName: '',
        staffId: '',
        email: '',
        phoneNumber: '',
        college: '',
        department: '',
        educationalTitle: '',
        educationalLevel: '',
        startDateAtUog: '',
        otherServiceInstitution: '',
        otherServiceDuration: '',
        researchInstitution: '',
        researchDuration: '',
        teachingInstitution: '',
        teachingDuration: '',
        responsibility: '',
        familyStatus: '',
        spouseName: '',
        spouseStaffId: '',
        numberOfDependents: '',
        hasSpouseAtUog: false,
        isFemale: false,
        isDisabled: false,
        hasChronicIllness: false,
      });
      setScoreBreakdown(null);
      toast.success('Form cleared');
      return;
    }

    // Check which required fields are missing
    const missingFields: string[] = [];
    if (!formData.fullName) missingFields.push('Full Name');
    if (!formData.staffId) missingFields.push('Staff ID / GUR ID');
    if (!formData.email) missingFields.push('Email Address');
    if (!formData.phoneNumber) missingFields.push('Phone Number');
    if (!formData.college) missingFields.push('College / Institute');
    if (!formData.department) missingFields.push('Unit');
    if (!formData.educationalTitle) missingFields.push('Educational Title');
    if (!formData.educationalLevel) missingFields.push('Educational Level');
    if (!formData.startDateAtUog) missingFields.push('Start Date at UOG');
    if (!formData.responsibility) missingFields.push('Responsibility');
    if (!formData.familyStatus) missingFields.push('Family Status');
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
      toast.error('Email must end with @uog.edu.et or @gmail.com');
      return;
    }

    // Validate phone number format
    if (!validatePhoneNumber(formData.phoneNumber)) {
      toast.error('Phone number must start with 09 and be 10 digits (e.g., 0997278931)');
      return;
    }

    // Validate Staff ID format
    if (!validateStaffId(formData.staffId)) {
      toast.error('Staff ID must be GUR/XXXXX/YY where YY > 20 (e.g., GUR/02264/21)');
      return;
    }

    if (!selectedRound) {
      toast.error('Please select an application round');
      return;
    }

    setIsLoading(true);
    try {
      const applicationData = {
        roundId: selectedRound,
        preferredHousingUnitId: null,
        notes: JSON.stringify({
          ...formData,
          score: scoreBreakdown,
          submittedAt: new Date().toISOString()
        })
      };

      const result = await apiRequest<{ id: string }>('/applications/draft', {
        method: 'POST',
        body: applicationData,
      });

      // Upload documents if any are selected
      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map(file =>
          uploadDocument({
            purpose: 'OTHER',
            applicationId: result.id,
            notes: 'Supporting document for housing application',
            file
          })
        );
        
        const uploadedResults = await Promise.all(uploadPromises);
        setUploadedDocs(uploadedResults.map(doc => ({ id: doc.id, fileName: doc.originalFileName })));
        toast.success(`${uploadedResults.length} document(s) uploaded successfully!`);
      }

      if (action === 'submit') {
        // Submit application
        await apiRequest(`/applications/${result.id}/submit`, {
          method: 'POST'
        });
        toast.success('Application submitted successfully!');
        setSelectedFiles([]); // Clear selected files after successful submission
      } else {
        toast.success('Application saved as draft!');
      }

    } catch (error) {
      console.error('Save error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-slate-800">
              🏠 Lecturer Housing Application Form
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Please complete all required fields (*). Your priority score will be automatically calculated based on official UOG rules.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Application Round Selection */}
          <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl border border-blue-100">
            <div className="px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
              <h2 className="text-lg font-semibold text-slate-800">Application Round Selection</h2>
            </div>
            <div className="px-6 py-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Application Round*</label>
                <select
                  value={selectedRound}
                  onChange={(e) => setSelectedRound(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">-- Select round --</option>
                  {Array.isArray(activeRounds) && activeRounds.map((round) => (
                    <option key={round.id} value={round.id}>
                      {round.name} ({new Date(round.startsAt).toLocaleDateString()} - {new Date(round.endsAt).toLocaleDateString()}) - {round.status}
                    </option>
                  ))}
                </select>
                {activeRounds.length === 0 && (
                  <p className="text-sm text-red-600 mt-2">No active application rounds available. Please contact the administrator.</p>
                )}
              </div>
            </div>
          </div>

          {/* 1. Personal Information */}
          <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl border border-blue-100">
            <div className="px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
              <h2 className="text-lg font-semibold text-slate-800">1. Personal Information</h2>
            </div>
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name*</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1">Auto-filled from your profile. Edit if needed.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Staff ID / GUR ID*</label>
                  <input
                    type="text"
                    value={formData.staffId}
                    onChange={(e) => handleInputChange('staffId', e.target.value.toUpperCase())}
                    placeholder="GUR/XXXXX/YY (YY must be > 20)"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1">Format: GUR/02264/21 (last 2 digits must be 21 or higher)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address*</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="name@uog.edu.et or name@gmail.com"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1">Must end with @uog.edu.et or @gmail.com. Auto-filled from your profile.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number*</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="09XXXXXXXX (10 digits)"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1">Must start with 09 and be 10 digits (e.g., 0997278931)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">College / Institute*</label>
                  <select
                    value={formData.college}
                    onChange={(e) => handleInputChange('college', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select college</option>
                    <option value="Auto-filled from profile" disabled>-- Auto-filled from your profile --</option>
                    <option value="College of Medicine and Health Sciences">College of Medicine and Health Sciences</option>
                    <option value="College of Business and Economics">College of Business and Economics</option>
                    <option value="College of Natural and Computational Sciences">College of Natural and Computational Sciences</option>
                    <option value="College of Social Sciences and Humanities">College of Social Sciences and Humanities</option>
                    <option value="College of Agriculture and Environmental Sciences">College of Agriculture and Environmental Sciences</option>
                    <option value="College of Veterinary Medicine and Animal Sciences">College of Veterinary Medicine and Animal Sciences</option>
                    <option value="College of Education">College of Education</option>
                    <option value="College of Informatics">College of Informatics</option>
                    <option value="Institute of Technology">Institute of Technology</option>
                    <option value="Institute of Biotechnology">Institute of Biotechnology</option>
                    <option value="School of Law">School of Law</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-1">Auto-filled from your profile. Change if needed.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Unit / Section*</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder="Enter your specific unit or section within the college"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1">Auto-filled from your profile. Edit if needed.</p>
                </div>

                              </div>
            </div>
          </div>

          {/* 2. Academic & Employment Information */}
          <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl border border-blue-100">
            <div className="px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
              <h2 className="text-lg font-semibold text-slate-800">2. Academic & Employment Information</h2>
            </div>
            <div className="px-6 py-6">
              <div className="space-y-6">
                {/* A. Educational Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">A. Educational Title (Weight: 40%)</label>
                  <select
                    value={formData.educationalTitle}
                    onChange={(e) => handleInputChange('educationalTitle', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select title</option>
                    <option value="PROFESSOR">Professor (40 points)</option>
                    <option value="ASSOCIATE_PROFESSOR">Associate Professor (37 points)</option>
                    <option value="ASSISTANT_PROFESSOR">Assistant Professor (34 points)</option>
                    <option value="LECTURER">Lecturer (31 points)</option>
                    <option value="ASSISTANT_LECTURER">Assistant Lecturer (25 points)</option>
                    <option value="GRADUATE_ASSISTANT_II">Graduate Assistant II (20 points)</option>
                    <option value="GRADUATE_ASSISTANT_I">Graduate Assistant I (15 points)</option>
                  </select>
                </div>

                {/* B. Highest Educational Level */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">B. Highest Educational Level (Weight: 5%)*</label>
                  <select
                    value={formData.educationalLevel}
                    onChange={(e) => handleInputChange('educationalLevel', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select level</option>
                    <option value="PHD">PhD (5 points)</option>
                    <option value="MSC">MSc / MA (3 points)</option>
                    <option value="BSC">BSc / BA (1 point)</option>
                  </select>
                </div>

                {/* C. Years of Service at UOG */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">C. Years of Service at UOG (Weight: Part of 35%)</label>
                  <p className="text-sm text-slate-600 mb-2">Calculated automatically from start date</p>
                  <input
                    type="date"
                    value={formData.startDateAtUog}
                    onChange={(e) => handleInputChange('startDateAtUog', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1">System calculates: 2.33 points per completed year (max 35 points after 15 years)</p>
                </div>

                {/* Service at other institutions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Service at other Ethiopian Public Universities (Max 90% weight):</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.otherServiceInstitution}
                        onChange={(e) => handleInputChange('otherServiceInstitution', e.target.value)}
                        placeholder="Institution Name"
                        className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <input
                        type="text"
                        value={formData.otherServiceDuration}
                        onChange={(e) => handleInputChange('otherServiceDuration', e.target.value)}
                        placeholder="Years"
                        className="w-32 px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Service at Research Institutions/Colleges (Max 75% weight):</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.researchInstitution}
                        onChange={(e) => handleInputChange('researchInstitution', e.target.value)}
                        placeholder="Institution Name"
                        className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <input
                        type="text"
                        value={formData.researchDuration}
                        onChange={(e) => handleInputChange('researchDuration', e.target.value)}
                        placeholder="Years"
                        className="w-32 px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Service as Teacher at Other Gov/Private (Max 70% weight):</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.teachingInstitution}
                        onChange={(e) => handleInputChange('teachingInstitution', e.target.value)}
                        placeholder="Institution Name"
                        className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <input
                        type="text"
                        value={formData.teachingDuration}
                        onChange={(e) => handleInputChange('teachingDuration', e.target.value)}
                        placeholder="Years"
                        className="w-32 px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. University Responsibility */}
          <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl border border-blue-100">
            <div className="px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
              <h2 className="text-lg font-semibold text-slate-800">3. University Responsibility (Weight: 10%)</h2>
            </div>
            <div className="px-6 py-6">
              <select
                value={formData.responsibility}
                onChange={(e) => handleInputChange('responsibility', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select responsibility</option>
                <option value="DEAN">Dean, Academic Director, Institute Director (10 points)</option>
                <option value="VICE_DEAN">Vice Dean, Academic Vice Director, Student Affairs Director (9 points)</option>
                <option value="DEPARTMENT_HEAD">Department Head, Associate Registrar, Program Director (8 points)</option>
                <option value="UNIT_HEAD">Unit Head, Center Coordinator (6 points)</option>
                <option value="PROGRAM_COORDINATOR">Program/Module Coordinator (4 points)</option>
                <option value="NONE">No current responsibility (0 points)</option>
              </select>
            </div>
          </div>

          {/* 4. Family & Marital Status */}
          <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl border border-blue-100">
            <div className="px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
              <h2 className="text-lg font-semibold text-slate-800">4. Family & Marital Status (Weight: 10%)</h2>
            </div>
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Family & Marital Status</label>
                  <select
                    value={formData.familyStatus}
                    onChange={(e) => handleInputChange('familyStatus', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select status</option>
                    <option value="MARRIED_WITH_CHILDREN">Married with biological/adopted child(ren) (10 points)</option>
                    <option value="MARRIED_WITHOUT_CHILDREN">Married without children (8 points)</option>
                    <option value="SINGLE_DIVORCED_WITH_CHILDREN">Single / Divorced / Widowed with children(5 points)</option>
                    <option value="SINGLE_WITHOUT_CHILDREN">Single without children (0 points)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Number of Dependents:</label>
                  <input
                    type="text"
                    value={formData.numberOfDependents}
                    onChange={(e) => handleInputChange('numberOfDependents', e.target.value)}
                    placeholder="Enter number"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {(formData.familyStatus === 'MARRIED_WITH_CHILDREN' || formData.familyStatus === 'SINGLE_DIVORCED_WITH_CHILDREN') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Spouse Name:</label>
                      <input
                        type="text"
                        value={formData.spouseName}
                        onChange={(e) => handleInputChange('spouseName', e.target.value)}
                        placeholder="Enter spouse name"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Spouse Staff ID:</label>
                      <input
                        type="text"
                        value={formData.spouseStaffId}
                        onChange={(e) => handleInputChange('spouseStaffId', e.target.value)}
                        placeholder="Enter spouse ID"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </>
                )}

                {formData.familyStatus === 'MARRIED_WITH_CHILDREN' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">If married to another UOG Lecturer:</label>
                    <select
                      value={formData.hasSpouseAtUog.toString()}
                      onChange={(e) => handleInputChange('hasSpouseAtUog', e.target.value === 'true')}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes, my spouse is also a UOG lecturer (+5% increase to total score)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 5. Special Conditions */}
          <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl border border-blue-100">
            <div className="px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
              <h2 className="text-lg font-semibold text-slate-800">5. Special Conditions (Additional Points)</h2>
            </div>
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Female Lecturer (+5% of total score)</label>
                  <select
                    value={formData.isFemale.toString()}
                    onChange={(e) => handleInputChange('isFemale', e.target.value === 'true')}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes (+5% of total score)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Person with Disability (certified - +5%)</label>
                  <select
                    value={formData.isDisabled.toString()}
                    onChange={(e) => handleInputChange('isDisabled', e.target.value === 'true')}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes (+5% of total score)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">HIV / Chronic Illness (certified - +3%)</label>
                  <select
                    value={formData.hasChronicIllness.toString()}
                    onChange={(e) => handleInputChange('hasChronicIllness', e.target.value === 'true')}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes (+3% of total score)</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-1">Note: Medical certification required below.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Document Upload */}
          <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl border border-blue-100">
            <div className="px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
              <h2 className="text-lg font-semibold text-slate-800">6. Document Upload (Supporting Documents)</h2>
            </div>
            <div className="px-6 py-6">
              <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 bg-blue-50/50">
                <div className="text-center">
                  <p className="text-lg font-semibold text-slate-700 mb-2">📄 Document Upload</p>
                  <p className="text-sm text-slate-600 mb-4">Upload supporting documents for your housing application</p>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-blue-300 rounded-xl p-4 bg-white">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Supporting Documents</label>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <div className="text-xs text-slate-500 mt-2">
                      Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max 5MB each, max 5 files)
                    </div>
                  </div>

                  {/* Display selected files */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-slate-700">Selected Files ({selectedFiles.length}/5):</p>
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-700">📎</span>
                            <span className="text-sm text-slate-700">{file.name}</span>
                            <span className="text-xs text-slate-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Display uploaded documents */}
                  {uploadedDocs.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-green-700">✓ Uploaded Documents:</p>
                      {uploadedDocs.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-3">
                          <span className="text-sm text-green-700">✓</span>
                          <span className="text-sm text-green-700">{doc.fileName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Application Summary */}
          {scoreBreakdown && (
            <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl border border-blue-100">
              <div className="px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                <h2 className="text-lg font-semibold text-slate-800">Score Breakdown</h2>
              </div>
              <div className="px-6 py-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-blue-100">
                    <thead className="bg-blue-50/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Score Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Points</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-blue-100">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Base Score</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{scoreBreakdown.baseTotal}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Bonus Score</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">+{scoreBreakdown.femaleBonus + scoreBreakdown.disabilityBonus + scoreBreakdown.chronicIllnessBonus + scoreBreakdown.spouseBonus}</td>
                      </tr>
                      <tr className="bg-blue-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Final Score</td>
                        <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-blue-600">{scoreBreakdown.final}/100</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl border border-blue-100">
            <div className="px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
              <h2 className="text-lg font-semibold text-slate-800">Form Actions</h2>
            </div>
            <div className="px-6 py-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => handleSubmit('edit')}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-slate-600 text-white hover:bg-slate-700 px-6 py-3 rounded-lg font-medium shadow-md transition-all"
                >
                  💾 Save Draft
                </Button>
                
                <Button
                  onClick={() => calculateScore()}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg font-medium shadow-md transition-all"
                >
                  📊 Preview Score
                </Button>
                
                <Button
                  onClick={() => handleSubmit('submit')}
                  disabled={isLoading || !scoreBreakdown}
                  className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 px-6 py-3 rounded-lg font-medium shadow-md transition-all"
                >
                  📤 Submit Application
                </Button>
                
                <Button
                  onClick={() => handleSubmit('clear')}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 px-6 py-3 rounded-lg font-medium shadow-md transition-all"
                >
                  🗑 Clear Form
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

