'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { calculateCompleteScore } from '@/lib/housing-scoring';
import { apiRequest } from '@/lib/api/client';

interface ApplicationFormData {
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
  const [existingApplication, setExistingApplication] = useState<any>(null);

  useEffect(() => {
    loadApplicationData();
    loadActiveRounds();
  }, []);

  const loadActiveRounds = async () => {
    try {
      const response = await apiRequest<any>('/applications/options');
      console.log('Rounds response:', response); // Debug log
      
      // Extract rounds from the response object
      const rounds = response?.rounds || [];
      setActiveRounds(Array.isArray(rounds) ? rounds : []);
      if (Array.isArray(rounds) && rounds.length > 0) {
        setSelectedRound(rounds[0].id);
      }
    } catch (error) {
      console.error('Error loading rounds:', error);
      setActiveRounds([]); // Ensure it's always an array
    }
  };

  const loadApplicationData = async () => {
    try {
      // Load existing application
      const appData = await apiRequest<any[]>('/applications/me');
      if (appData && appData.length > 0) {
        const latestApp = appData[0];
        setExistingApplication(latestApp);
        if (latestApp.roundId) {
          setSelectedRound(latestApp.roundId);
        }
        
        // Parse notes if it contains form data
        if (latestApp.notes) {
          try {
            const parsedData = JSON.parse(latestApp.notes);
            setFormData(prev => ({ ...prev, ...parsedData }));
          } catch (e) {
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

  const calculateScore = async () => {
    if (!formData.fullName || !formData.staffId || !formData.email || !formData.phoneNumber || !formData.college || !formData.department || !formData.educationalTitle || !formData.educationalLevel || !formData.startDateAtUog || !formData.responsibility || !formData.familyStatus) {
      toast.error('Please fill in all required fields (*)');
      return;
    }

    const score = calculateCompleteScore({
      educationalTitle: formData.educationalTitle as any,
      educationalLevel: formData.educationalLevel as any,
      startDateAtUog: new Date(formData.startDateAtUog),
      responsibility: formData.responsibility as any,
      familyStatus: formData.familyStatus as any,
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

    // Validate required fields
    const requiredFields = ['fullName', 'staffId', 'email', 'phoneNumber', 'college', 'department', 'educationalTitle', 'educationalLevel', 'startDateAtUog', 'responsibility', 'familyStatus'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof ApplicationFormData]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in required fields (*): ${missingFields.join(', ')}`);
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

      const result = await apiRequest<any>('/applications/draft', {
        method: 'POST',
        body: applicationData,
      });
      
      if (action === 'submit') {
        // Submit application
        await apiRequest(`/applications/${result.id}/submit`, {
          method: 'POST'
        });
        toast.success('Application submitted successfully!');
      } else {
        toast.success('Application saved as draft!');
        setExistingApplication(result);
      }

    } catch (error) {
      console.error('Save error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              🏠 Lecturer Housing Application Form (Rule-Based Scoring)
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Instructions: Please complete all required fields (*). Your priority score will be automatically calculated based on official UOG rule. 
              Critical attributes (Academic Rank, Service Years, etc.........) cannot be edited by admins to ensure fairness.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Application Round Selection */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Application Round Selection</h2>
            </div>
            <div className="px-6 py-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Application Round*</label>
                <select
                  value={selectedRound}
                  onChange={(e) => setSelectedRound(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select an application round</option>
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
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">1. Personal Information</h2>
            </div>
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name*</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="_________________________"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Staff ID / GUR ID*</label>
                  <input
                    type="text"
                    value={formData.staffId}
                    onChange={(e) => handleInputChange('staffId', e.target.value)}
                    placeholder="_________________________ (e.g., GUR/02264/15)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address*</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="_________________________ (@uog.edu.et)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number*</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="_________________________"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">College / Institute*</label>
                  <select
                    value={formData.college}
                    onChange={(e) => handleInputChange('college', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select college</option>
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department*</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder="_________________________"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                              </div>
            </div>
          </div>

          {/* 2. Academic & Employment Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">2. Academic & Employment Information (Critical Attributes - 45% total)</h2>
            </div>
            <div className="px-6 py-6">
              <div className="space-y-6">
                {/* A. Educational Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">A. Educational Title (Weight: 40%)</label>
                  <select
                    value={formData.educationalTitle}
                    onChange={(e) => handleInputChange('educationalTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">B. Highest Educational Level (Weight: 5%)*</label>
                  <select
                    value={formData.educationalLevel}
                    onChange={(e) => handleInputChange('educationalLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select level</option>
                    <option value="PHD">PhD (5 points)</option>
                    <option value="MSC">MSc / MA (3 points)</option>
                    <option value="BSC">BSc / BA (1 point)</option>
                  </select>
                </div>

                {/* C. Years of Service at UOG */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">C. Years of Service at UOG (Weight: Part of 35%)</label>
                  <p className="text-sm text-gray-600 mb-2">Calculated automatically from start date</p>
                  <input
                    type="date"
                    value={formData.startDateAtUog}
                    onChange={(e) => handleInputChange('startDateAtUog', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">System calculates: 2.33 points per completed year (max 35 points after 15 years)</p>
                </div>

                {/* Service at other institutions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service at other Ethiopian Public Universities (Max 90% weight):</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.otherServiceInstitution}
                        onChange={(e) => handleInputChange('otherServiceInstitution', e.target.value)}
                        placeholder="Institution Name: _________________"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={formData.otherServiceDuration}
                        onChange={(e) => handleInputChange('otherServiceDuration', e.target.value)}
                        placeholder="Duration (Years): _____"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service at Research Institutions/Colleges (Max 75% weight):</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.researchInstitution}
                        onChange={(e) => handleInputChange('researchInstitution', e.target.value)}
                        placeholder="Institution Name: _________________"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={formData.researchDuration}
                        onChange={(e) => handleInputChange('researchDuration', e.target.value)}
                        placeholder="Duration (Years): _____"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service as Teacher at Other Gov/Private (Max 70% weight):</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.teachingInstitution}
                        onChange={(e) => handleInputChange('teachingInstitution', e.target.value)}
                        placeholder="Institution Name: _________________"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={formData.teachingDuration}
                        onChange={(e) => handleInputChange('teachingDuration', e.target.value)}
                        placeholder="Duration (Years): _____"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. University Responsibility */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">3. University Responsibility (Weight: 10%)</h2>
            </div>
            <div className="px-6 py-6">
              <select
                value={formData.responsibility}
                onChange={(e) => handleInputChange('responsibility', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">4. Family & Marital Status (Weight: 10%)</h2>
            </div>
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Family & Marital Status (Weight: 10%)</label>
                  <select
                    value={formData.familyStatus}
                    onChange={(e) => handleInputChange('familyStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select status</option>
                    <option value="MARRIED_WITH_CHILDREN">Married with biological/adopted child(ren) (10 points)</option>
                    <option value="MARRIED_WITHOUT_CHILDREN">Married without children (8 points)</option>
                    <option value="SINGLE_DIVORCED_WITH_CHILDREN">Single / Divorced / Widowed with children(5 points)</option>
                    <option value="SINGLE_WITHOUT_CHILDREN">Single without children (0 points)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Dependents (children/disabled elders):</label>
                  <input
                    type="text"
                    value={formData.numberOfDependents}
                    onChange={(e) => handleInputChange('numberOfDependents', e.target.value)}
                    placeholder="_____"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {(formData.familyStatus === 'MARRIED_WITH_CHILDREN' || formData.familyStatus === 'SINGLE_DIVORCED_WITH_CHILDREN') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Name:</label>
                      <input
                        type="text"
                        value={formData.spouseName}
                        onChange={(e) => handleInputChange('spouseName', e.target.value)}
                        placeholder="_________________"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Staff ID:</label>
                      <input
                        type="text"
                        value={formData.spouseStaffId}
                        onChange={(e) => handleInputChange('spouseStaffId', e.target.value)}
                        placeholder="_________________"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </>
                )}

                {formData.familyStatus === 'MARRIED_WITH_CHILDREN' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">If married to another UOG Lecturer:</label>
                    <select
                      value={formData.hasSpouseAtUog.toString()}
                      onChange={(e) => handleInputChange('hasSpouseAtUog', e.target.value === 'true')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">5. Special Conditions (Additional Points)</h2>
            </div>
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Female Lecturer (+5% of total score)</label>
                  <select
                    value={formData.isFemale.toString()}
                    onChange={(e) => handleInputChange('isFemale', e.target.value === 'true')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes (+5% of total score)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Person with Disability (certified - +5% of total score)</label>
                  <select
                    value={formData.isDisabled.toString()}
                    onChange={(e) => handleInputChange('isDisabled', e.target.value === 'true')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes (+5% of total score)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">HIV / Chronic Illness (Cancer, etc.) (certified - +3% of total score)</label>
                  <select
                    value={formData.hasChronicIllness.toString()}
                    onChange={(e) => handleInputChange('hasChronicIllness', e.target.value === 'true')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes (+3% of total score)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Note: For Disability or Chronic Illness, you must upload medical certification below.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Document Upload */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">6. Document Upload (Supporting Documents)</h2>
            </div>
            <div className="px-6 py-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-700 mb-2">📄 Document Upload</p>
                  <p className="text-sm text-gray-600 mb-4">Upload supporting documents for your housing application</p>
                </div>
                
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-400 rounded p-4 bg-white">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Supporting Documents</label>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.doc,.docx,.jpg,.jpeg,.png"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="text-xs text-gray-500 mt-2">
                      Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Application Summary */}
          {scoreBreakdown && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">APPLICATION SUMMARY</h2>
              </div>
              <div className="px-6 py-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criteria</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Points</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Educational Title</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">40%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scoreBreakdown.educationalTitle}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{scoreBreakdown.educationalTitle}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Educational Level</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scoreBreakdown.educationalLevel}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{scoreBreakdown.educationalLevel}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Service Years</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">35%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scoreBreakdown.serviceYears}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{scoreBreakdown.serviceYears}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Responsibility</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scoreBreakdown.responsibility}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{scoreBreakdown.responsibility}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Family Status</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scoreBreakdown.familyStatus}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{scoreBreakdown.familyStatus}</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Base Total</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">100%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scoreBreakdown.baseTotal}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{scoreBreakdown.baseTotal}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Female (+5%)</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Bonus</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+{scoreBreakdown.femaleBonus}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">+{scoreBreakdown.femaleBonus}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Disability (+5%)</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Bonus</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+{scoreBreakdown.disabilityBonus}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">+{scoreBreakdown.disabilityBonus}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">HIV/Illness (+3%)</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Bonus</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+{scoreBreakdown.chronicIllnessBonus}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">+{scoreBreakdown.chronicIllnessBonus}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Spouse Bonus (+5%)</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Bonus</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+{scoreBreakdown.spouseBonus}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">+{scoreBreakdown.spouseBonus}</td>
                      </tr>
                      <tr className="bg-blue-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">FINAL SCORE</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scoreBreakdown.final}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-blue-600">{scoreBreakdown.final}/100</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">FORM ACTIONS</h2>
            </div>
            <div className="px-6 py-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => handleSubmit('edit')}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-3"
                >
                  💾 EDIT when needs
                </Button>
                
                <Button
                  onClick={() => calculateScore()}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 px-6 py-3"
                >
                  📊 PREVIEW SCORE
                </Button>
                
                <Button
                  onClick={() => handleSubmit('submit')}
                  disabled={isLoading || !scoreBreakdown}
                  className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 px-6 py-3"
                >
                  📤 SUBMIT APPLICATION
                </Button>
                
                <Button
                  onClick={() => handleSubmit('clear')}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 px-6 py-3"
                >
                  🗑 CLEAR FORM
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
function setHousingUnits(availableHouses: any) {
  throw new Error('Function not implemented.');
}

