export interface Affiliate {
  id: string;
  personalInfo: PersonalInfo;
  contactInfo: ContactInfo;
  politicalInfo: PoliticalInfo;
  verificationStatus: VerificationStatus;
  membershipInfo: MembershipInfo;
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  identificationType: 'cedula' | 'passport' | 'other';
  identificationNumber: string;
  occupation: string;
  education: EducationLevel;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  children?: number;
}

export interface ContactInfo {
  primaryPhone: string;
  secondaryPhone?: string;
  email: string;
  address: Address;
  emergencyContact?: EmergencyContact;
}

export interface Address {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface PoliticalInfo {
  politicalExperience: PoliticalExperience[];
  previousAffiliations?: string[];
  interests: string[];
  skills: string[];
  availability: AvailabilityInfo;
  motivation: string;
}

export interface PoliticalExperience {
  position: string;
  organization: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

export interface AvailabilityInfo {
  timeSlots: string[];
  daysAvailable: string[];
  volunteerAreas: string[];
  canTravel: boolean;
  maxDistance?: number;
}

export interface VerificationStatus {
  isVerified: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;
  documentsVerified: boolean;
  backgroundCheck: boolean;
  interviewCompleted: boolean;
  referencesChecked: boolean;
  notes?: string;
}

export interface MembershipInfo {
  membershipNumber: string;
  joinDate: Date;
  membershipType: MembershipType;
  duesStatus: 'current' | 'overdue' | 'exempt';
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
  benefits: string[];
}

export interface Document {
  id: string;
  type: DocumentType;
  name: string;
  url: string;
  uploadedAt: Date;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
}

export interface DocumentType {
  name: string;
  required: boolean;
  description: string;
}

export type EducationLevel = 
  | 'primary' 
  | 'secondary' 
  | 'technical' 
  | 'university' 
  | 'postgraduate' 
  | 'other';

export type MembershipType = 
  | 'basic' 
  | 'active' 
  | 'vip' 
  | 'founder' 
  | 'honorary';

export interface AffiliateFilters {
  search?: string;
  status?: 'all' | 'verified' | 'pending' | 'rejected';
  membershipType?: MembershipType;
  city?: string;
  joinDateFrom?: Date;
  joinDateTo?: Date;
  ageRange?: {
    min: number;
    max: number;
  };
  education?: EducationLevel[];
  skills?: string[];
}

export interface AffiliateStats {
  total: number;
  verified: number;
  pending: number;
  rejected: number;
  newThisMonth: number;
  newThisWeek: number;
  byMembershipType: { [key in MembershipType]: number };
  byEducation: { [key in EducationLevel]: number };
  byCity: { [city: string]: number };
  averageAge: number;
}

export interface AffiliateSearchResult {
  affiliates: Affiliate[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
