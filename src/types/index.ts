export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type WorkStatus = 'SANCTIONED' | 'IN_PROGRESS' | 'COMPLETED' | 'LANGUISHING' | 'CANCELLED';

export type WorkCategory = 
  | 'Drinking Water'
  | 'Education & Schools'
  | 'Roads & Bridges'
  | 'Healthcare'
  | 'Community Infrastructure'
  | 'Sanitation'
  | 'Irrigation & Flood Control'
  | 'Non-Permissible / Commercial';

export interface WorkItem {
  id: string;
  code: string; // e.g., "MPLADS/2024-25/UP-VAR-0104"
  title: string;
  description: string;
  category: WorkCategory;
  constituencyId: string;
  locationName: string;
  lat: number;
  lng: number;
  demographicZone: 'GENERAL' | 'SC_MANDATED' | 'ST_MANDATED';
  sanctionedAmountLakhs: number; // in Lakhs (INR)
  utilizedAmountLakhs: number;
  sanctionDate: string;
  targetCompletionDate: string;
  actualCompletionDate?: string;
  status: WorkStatus;
  implementingAgency: string;
  contractorName: string;
  contractorGstin: string;
  wiriScore: number; // Work Integrity Risk Index (0 - 100)
  riskLevel: RiskLevel;
  anomaliesCount: number;
  flags: AnomalyFlag[];
  satelliteScanId?: string;
  dprId?: string;
}

export interface AnomalyFlag {
  id: string;
  type: 
    | 'SATELLITE_GHOST_WORK'
    | 'CROSS_SCHEME_COLLISION'
    | 'CARTEL_BID_RIGGING'
    | 'DPR_PRICE_INFLATION'
    | 'NON_PERMISSIBLE_ASSET'
    | 'PHOTO_METADATA_TAMPERING'
    | 'AI_GENERATED_PHOTO_DETECTED'
    | 'HALF_DONE_PREMATURE_COMPLETION'
    | 'FUND_PARKING_STALL';
  severity: 'WARNING' | 'CRITICAL';
  title: string;
  description: string;
  confidence: number; // 0 to 1
  detectedAt: string;
}

export interface Constituency {
  id: string;
  name: string;
  state: string;
  mpName: string;
  mpHouse: 'Lok Sabha' | 'Rajya Sabha';
  party: string;
  termYears: string;
  centerLat: number;
  centerLng: number;
  totalEntitlementCr: number; // in Crores
  totalSanctionedCr: number;
  totalExpenditureCr: number;
  scAllocationPercent: number; // Target: >= 15%
  stAllocationPercent: number; // Target: >= 7.5%
  totalWorks: number;
  highRiskWorks: number;
  flaggedFundsLakhs: number;
}

export interface SatelliteScan {
  id: string;
  workId: string;
  sanctionDateImage: string; // optical satellite capture
  completionDateImage: string; // optical / SAR capture
  sarBackscatterChangeDb: number; // Radar delta (dB)
  ndbiChangePercent: number; // Normalized Difference Built-up Index
  detectedGroundChangePercent: number; // 0% means no change (ghost work)
  claimedProgressPercent: number;
  verificationVerdict: 'VERIFIED_PHYSICAL_CHANGE' | 'GHOST_WORK_SUSPECTED' | 'PARTIAL_CONSTRUCTION' | 'SURFACE_MISMATCH';
  groundPhotoUrl: string;
  groundPhotoExif: {
    cameraModel: string;
    timestamp: string;
    gpsLat: number;
    gpsLng: number;
    gpsDeviationMeters: number;
    isSpoofed: boolean;
    errorLevelAnalysisScore: number; // 0 - 100 (high = edited/tampered)
    perceptualHashMatchFound: boolean;
    duplicateMatchedWorkCode?: string;
    // Feature 1: AI-Generated / Deepfake Photo Detection
    isAiGeneratedPhoto?: boolean;
    aiGenerationConfidencePercent?: number; // e.g. 98.4%
    aiGeneratorToolDetected?: string; // e.g. "Stable Diffusion / Midjourney Diffusion Artifacts"
    alertSentToVigilanceMembers?: boolean;
    // Feature 2: Half-Done / Partial Construction Vision Scanner
    physicalStageDetectedPercent?: number; // e.g. 40%
    claimedStagePercent?: number; // e.g. 100%
    missingComponents?: string[]; // e.g. ["Water Tank Dome Missing", "Pipeline Not Connected"]
    completionVerdict?: 'COMPLETELY_DONE' | 'HALF_DONE_STALLED' | 'PREMATURE_COMPLETION_CLAIM';
  };
}

export interface DoubleDippingAlert {
  id: string;
  mpladsWorkId: string;
  mpladsWorkTitle: string;
  mpladsAmountLakhs: number;
  collidingScheme: 'PMGSY' | 'MLALADS' | 'PMAY' | 'Smart Cities Mission' | 'Urban Local Body (ULB) Grant';
  collidingProjectCode: string;
  collidingProjectTitle: string;
  collidingAmountLakhs: number;
  collidingAgency: string;
  distanceMeters: number;
  semanticSimilarityPercent: number;
  overlapProbabilityPercent: number;
  estimatedDuplicateLossLakhs: number;
  locationName: string;
}

export interface CartelNode {
  id: string;
  name: string;
  type: 'CONTRACTOR' | 'DIRECTOR' | 'GSTIN' | 'IMPLEMENTING_AGENCY' | 'BANK_BRANCH' | 'SHARED_PHONE';
  isFlagged: boolean;
  totalContractsWon: number;
  totalValueCrores: number;
  riskScore: number;
}

export interface CartelEdge {
  source: string;
  target: string;
  relationship: 'DIRECTOR_OF' | 'SHARED_ADDRESS' | 'SHARED_GSTIN_PAN' | 'CO_BIDDER' | 'AWARDED_TO' | 'SHARED_CONTACT';
  coBidFrequency?: number;
  weight: number;
}

export interface CartelCluster {
  id: string;
  name: string;
  ringType: 'ROTATIONAL_COVER_BIDDING' | 'SHELL_COMPANY_NEXUS' | 'FAMILY_DIRECTOR_RING' | 'OFFICIAL_COLLUSION';
  entitiesCount: number;
  totalWorksMonopolized: number;
  totalValueCrores: number;
  cartelConfidence: number;
  keyEntities: string[];
}

export interface DPRLineItem {
  id: string;
  itemDescription: string;
  unit: string;
  quantity: number;
  claimedRateInr: number;
  cpwdDsrRateInr: number;
  claimedTotalInr: number;
  permissibleTotalInr: number;
  rateInflationPercent: number;
  isFlagged: boolean;
  reason?: string;
}

export interface DPRDocument {
  id: string;
  workId: string;
  workTitle: string;
  fileName: string;
  submittedAgency: string;
  submissionDate: string;
  totalClaimedCostLakhs: number;
  permissibleCostLakhs: number;
  totalInflationLakhs: number;
  overallMarkupPercent: number;
  guidelineCompliance: {
    isPermissibleAsset: boolean;
    landOwnershipType: 'GOVERNMENT' | 'PANCHAYAT' | 'PRIVATE_TRUST' | 'COMMERCIAL';
    scStQuotaEligible: boolean;
    mandatoryDisplayBoardIncluded: boolean;
    violationsFound: string[];
  };
  lineItems: DPRLineItem[];
}

export interface CitizenReport {
  id: string;
  workId: string;
  workTitle: string;
  citizenName: string;
  phoneMasked: string;
  submissionDate: string;
  lat: number;
  lng: number;
  distanceFromAssetMeters: number;
  photoUrl: string;
  voiceNoteTranscript?: string;
  language: string;
  aiDefectTags: string[];
  citizenRating: 1 | 2 | 3 | 4 | 5;
  status: 'PENDING_REVIEW' | 'INVESTIGATION_ORDERED' | 'DISMISSED';
}

export interface WIRIBreakdown {
  workId: string;
  finalScore: number;
  riskCategory: RiskLevel;
  contributions: {
    satelliteDiscrepancy: { weight: number; rawValue: number; contribution: number; explanation: string };
    cartelBidRigging: { weight: number; rawValue: number; contribution: number; explanation: string };
    dprOverpricing: { weight: number; rawValue: number; contribution: number; explanation: string };
    spatialDoubleDipping: { weight: number; rawValue: number; contribution: number; explanation: string };
    imageTampering: { weight: number; rawValue: number; contribution: number; explanation: string };
    fundLanguishingVelocity: { weight: number; rawValue: number; contribution: number; explanation: string };
  };
  auditRecommendations: string[];
}


// --- SATYALADS FULL-STACK 320-PROJECT AUDIT SENTINEL TYPES ---
export type WorkflowStatus = 'UNDER_REVIEW' | 'FLAGGED' | 'ESCALATED' | 'CLEARED';
export type UserRole = 'auditor' | 'nodal_officer' | 'admin';
export type Language = 
  | 'en'   // English
  | 'hi'   // हिन्दी (Hindi)
  | 'bn'   // বাংলা (Bengali)
  | 'te'   // తెలుగు (Telugu)
  | 'mr'   // मराठी (Marathi)
  | 'ta'   // தமிழ் (Tamil)
  | 'ur'   // اردو (Urdu)
  | 'gu'   // ગુજરાતી (Gujarati)
  | 'kn'   // ಕನ್ನಡ (Kannada)
  | 'ml'   // മലയാളം (Malayalam)
  | 'or'   // ଓଡ଼ିଆ (Odia)
  | 'pa'   // ਪੰਜਾਬੀ (Punjabi)
  | 'as'   // অসমীয়া (Assamese)
  | 'mai'  // मैथिली (Maithili)
  | 'bho'  // भोजपुरी (Bhojpuri)
  | 'sa'   // संस्कृतम् (Sanskrit)
  | 'ks'   // कॉशुर (Kashmiri)
  | 'ne'   // नेपाली (Nepali)
  | 'kok'  // कोंकणी (Konkani)
  | 'sd'   // सिंधी (Sindhi)
  | 'doi'  // डोगरी (Dogri)
  | 'mni'  // মৈতৈলোন্ (Manipuri)
  | 'brx'  // बड़ो (Bodo)
  | 'sat'; // ᱥᱟᱱᱛᱟᱲᱤ (Santali)


export interface DetectionFlag {
  module: string;
  type?: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number;
  title: string;
  description: string;
  metric_cited: string;
  conflicting_work_id?: string;
  conflicting_work_code?: string;
  distance_meters?: number;
  photo_coordinates?: { lat: number; lng: number };
  claimed_coordinates?: { lat: number; lng: number };
  gfr_citation?: string;
  z_score?: number;
  category_median_lakhs?: number;
  cartel_members?: string[];
  shared_attributes?: string[];
  [key: string]: any;
}

export interface PhotoVerification {
  project_id?: string;
  has_gps: boolean;
  photo_lat: number | null;
  photo_lng: number | null;
  photo_timestamp: string | null;
  distance_meters: number | null;
  is_verified: boolean;
  flags: DetectionFlag[];
  [key: string]: any;
}

export interface ProjectRecord {
  id: string;
  work_code: string;
  title: string;
  category: string;
  constituency_id: string;
  constituency_name: string;
  state: string;
  district: string;
  mp_name: string;
  sanctioned_cost_lakhs: number;
  expenditure_lakhs: number;
  latitude: number;
  longitude: number;
  sanction_date: string;
  target_completion_date: string;
  contractor_name: string;
  contractor_pan: string;
  contractor_gstin: string;
  contractor_phone: string;
  contractor_address: string;
  site_photo_url: string;
  photo_exif_lat?: number | null;
  photo_exif_lng?: number | null;
  photo_exif_timestamp?: string | null;
  workflow_status: WorkflowStatus;
  seed_type?: string;
  risk_score: number;
  risk_band: RiskLevel;
  flags: DetectionFlag[];
  photo_verification?: PhotoVerification;
  [key: string]: any;
}

export interface DashboardStats {
  total_projects: number;
  total_sanctioned_cr: number;
  total_flagged_projects: number;
  flagged_risk_cr: number;
  roi_saved_metric: string;
  risk_distribution: { band: string; count: number; color: string }[];
  category_breakdown: {
    category: string;
    total: number;
    flagged: number;
    clean: number;
    total_cost_lakhs: number;
  }[];
  [key: string]: any;
}

export interface NotificationItem {
  id: string;
  project_id: string;
  work_code: string;
  title: string;
  category: string;
  severity: string;
  description: string;
  timestamp: string;
  [key: string]: any;
}

export interface UserSession {
  username: string;
  role: UserRole;
  title: string;
  state_jurisdiction: string;
  token: string;
}
