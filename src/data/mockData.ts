import { 
  Constituency, 
  WorkItem, 
  SatelliteScan, 
  DoubleDippingAlert, 
  CartelNode, 
  CartelEdge, 
  CartelCluster, 
  DPRDocument, 
  CitizenReport 
} from '../types';

export const CONSTITUENCIES: Constituency[] = [
  {
    id: 'VARANASI',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    mpName: 'Narendra Modi',
    mpHouse: 'Lok Sabha',
    party: 'BJP',
    termYears: '2024-2029',
    centerLat: 25.3176,
    centerLng: 82.9739,
    totalEntitlementCr: 25.0,
    totalSanctionedCr: 23.4,
    totalExpenditureCr: 18.2,
    scAllocationPercent: 16.4, // Meets >= 15% quota
    stAllocationPercent: 3.2,  // Below 7.5% quota (alert)
    totalWorks: 34,
    highRiskWorks: 6,
    flaggedFundsLakhs: 412.5,
  },
  {
    id: 'WAYANAD',
    name: 'Wayanad',
    state: 'Kerala',
    mpName: 'Priyanka Gandhi Vadra',
    mpHouse: 'Lok Sabha',
    party: 'INC',
    termYears: '2024-2029',
    centerLat: 11.6854,
    centerLng: 76.1320,
    totalEntitlementCr: 25.0,
    totalSanctionedCr: 21.8,
    totalExpenditureCr: 15.6,
    scAllocationPercent: 12.1, // Below 15% quota
    stAllocationPercent: 18.5, // Exceeds 7.5% quota
    totalWorks: 28,
    highRiskWorks: 4,
    flaggedFundsLakhs: 285.0,
  },
  {
    id: 'BLR_SOUTH',
    name: 'Bangalore South',
    state: 'Karnataka',
    mpName: 'Tejasvi Surya',
    mpHouse: 'Lok Sabha',
    party: 'BJP',
    termYears: '2024-2029',
    centerLat: 12.9249,
    centerLng: 77.5838,
    totalEntitlementCr: 25.0,
    totalSanctionedCr: 24.1,
    totalExpenditureCr: 19.8,
    scAllocationPercent: 15.8,
    stAllocationPercent: 8.1,
    totalWorks: 42,
    highRiskWorks: 5,
    flaggedFundsLakhs: 340.0,
  },
  {
    id: 'BARAMATI',
    name: 'Baramati',
    state: 'Maharashtra',
    mpName: 'Supriya Sule',
    mpHouse: 'Lok Sabha',
    party: 'NCP(SP)',
    termYears: '2024-2029',
    centerLat: 18.1517,
    centerLng: 74.5775,
    totalEntitlementCr: 25.0,
    totalSanctionedCr: 22.9,
    totalExpenditureCr: 16.4,
    scAllocationPercent: 17.2,
    stAllocationPercent: 7.8,
    totalWorks: 31,
    highRiskWorks: 3,
    flaggedFundsLakhs: 195.0,
  },
  {
    id: 'PATNA_SAHIB',
    name: 'Patna Sahib',
    state: 'Bihar',
    mpName: 'Ravi Shankar Prasad',
    mpHouse: 'Lok Sabha',
    party: 'BJP',
    termYears: '2024-2029',
    centerLat: 25.5941,
    centerLng: 85.1376,
    totalEntitlementCr: 25.0,
    totalSanctionedCr: 20.5,
    totalExpenditureCr: 14.2,
    scAllocationPercent: 18.9,
    stAllocationPercent: 2.1,
    totalWorks: 26,
    highRiskWorks: 7,
    flaggedFundsLakhs: 520.0,
  }
];

export const WORK_ITEMS: WorkItem[] = [
  {
    id: 'W001',
    code: 'MPLADS/2024-25/UP-VAR-0104',
    title: 'Construction of CC Road from Rohania Canal to Primary Health Centre',
    description: '1.2 km cement concrete road for rural connectivity and ambulance access.',
    category: 'Roads & Bridges',
    constituencyId: 'VARANASI',
    locationName: 'Rohania Block, Varanasi',
    lat: 25.2650,
    lng: 82.9120,
    demographicZone: 'GENERAL',
    sanctionedAmountLakhs: 85.0,
    utilizedAmountLakhs: 85.0,
    sanctionDate: '2024-03-15',
    targetCompletionDate: '2024-09-30',
    actualCompletionDate: '2024-10-12',
    status: 'COMPLETED',
    implementingAgency: 'Rural Engineering Department (RED), Varanasi',
    contractorName: 'Shiva Buildtech Infrastructure Ltd',
    contractorGstin: '09AABCS8891J1Z2',
    wiriScore: 92, // CRITICAL RISK
    riskLevel: 'CRITICAL',
    anomaliesCount: 3,
    flags: [
      {
        id: 'F101',
        type: 'SATELLITE_GHOST_WORK',
        severity: 'CRITICAL',
        title: 'Sentinel-2 & SAR Satellite: Zero Surface Terrain Change Detected',
        description: 'ESA Sentinel-1 SAR backscatter shows 0.04 dB delta between March & October 2024. Physical ground road construction not detected.',
        confidence: 0.96,
        detectedAt: '2024-10-15'
      },
      {
        id: 'F102',
        type: 'PHOTO_METADATA_TAMPERING',
        severity: 'CRITICAL',
        title: 'EXIF Metadata Tampering & Duplicate Photo Hash in Database',
        description: 'Uploaded completion photo pHash matched 99.4% with a 2022 completed project in Mirzapur. GPS coordinates were artificially injected.',
        confidence: 0.99,
        detectedAt: '2024-10-14'
      },
      {
        id: 'F103',
        type: 'CARTEL_BID_RIGGING',
        severity: 'WARNING',
        title: 'Rotational Tender Ring with 2 Subsidiary Bidders',
        description: 'Shiva Buildtech co-bid with Om Infra & Maa Ganga Projects. All 3 companies share Director PAN and registered address.',
        confidence: 0.88,
        detectedAt: '2024-04-02'
      }
    ],
    satelliteScanId: 'SAT-001',
    dprId: 'DPR-001'
  },
  {
    id: 'W002',
    code: 'MPLADS/2024-25/UP-VAR-0108',
    title: 'Installation of Solar High-Mast High-Capacity Tube Well & Water Kiosk',
    description: 'Solar powered deep tube well with multi-tap drinking water purification kiosk.',
    category: 'Drinking Water',
    constituencyId: 'VARANASI',
    locationName: 'Kashi Vidyapith Block, Ward 14',
    lat: 25.3210,
    lng: 82.9810,
    demographicZone: 'SC_MANDATED',
    sanctionedAmountLakhs: 42.0,
    utilizedAmountLakhs: 42.0,
    sanctionDate: '2024-05-10',
    targetCompletionDate: '2024-11-15',
    actualCompletionDate: '2024-11-20',
    status: 'COMPLETED',
    implementingAgency: 'UP Jal Nigam (Urban)',
    contractorName: 'Om Aqua Infrastructure Pvt Ltd',
    contractorGstin: '09AACCO4412K1Z9',
    wiriScore: 84, // HIGH RISK
    riskLevel: 'HIGH',
    anomaliesCount: 2,
    flags: [
      {
        id: 'F201',
        type: 'CROSS_SCHEME_COLLISION',
        severity: 'CRITICAL',
        title: 'Cross-Scheme Double-Dipping: 8-Meter Proximity to PM-KUSUM Borewell',
        description: 'Spatial collision engine identified an existing active PM-KUSUM Solar Pump installed in Dec 2023 at same coordinates. ₹42 Lakhs billed twice.',
        confidence: 0.94,
        detectedAt: '2024-11-22'
      },
      {
        id: 'F202',
        type: 'CARTEL_BID_RIGGING',
        severity: 'WARNING',
        title: 'Director Nexus with Shiva Buildtech',
        description: 'Managing Director is common with Shiva Buildtech (Tender Ring Cluster #1).',
        confidence: 0.91,
        detectedAt: '2024-05-20'
      }
    ],
    satelliteScanId: 'SAT-002',
    dprId: 'DPR-002'
  },
  {
    id: 'W003',
    code: 'MPLADS/2024-25/UP-VAR-0112',
    title: 'Construction of Multipurpose Community Hall at Shivpur SC Habitation',
    description: 'Community center with library room, sanitation block and solar lighting.',
    category: 'Community Infrastructure',
    constituencyId: 'VARANASI',
    locationName: 'Shivpur, Varanasi',
    lat: 25.3620,
    lng: 82.9640,
    demographicZone: 'SC_MANDATED',
    sanctionedAmountLakhs: 68.0,
    utilizedAmountLakhs: 55.0,
    sanctionDate: '2024-01-20',
    targetCompletionDate: '2024-10-31',
    status: 'IN_PROGRESS',
    implementingAgency: 'PWD Division 1, Varanasi',
    contractorName: 'Purvanchal Nirman Nigam',
    contractorGstin: '09AAGCP1120M1Z4',
    wiriScore: 18, // LOW RISK / HEALTHY
    riskLevel: 'LOW',
    anomaliesCount: 0,
    flags: [],
    satelliteScanId: 'SAT-003',
    dprId: 'DPR-003'
  },
  {
    id: 'W004',
    code: 'MPLADS/2024-25/UP-VAR-0119',
    title: 'Renovation & Granite Flooring of Mahant Bhavan Trust Complex',
    description: 'Refurbishment of banquet hall, marble flooring and ornamental lighting in private trust grounds.',
    category: 'Non-Permissible / Commercial',
    constituencyId: 'VARANASI',
    locationName: 'Assi Ghat Environs, Varanasi',
    lat: 25.2890,
    lng: 83.0060,
    demographicZone: 'GENERAL',
    sanctionedAmountLakhs: 55.0,
    utilizedAmountLakhs: 20.0,
    sanctionDate: '2024-06-01',
    targetCompletionDate: '2024-12-31',
    status: 'IN_PROGRESS',
    implementingAgency: 'Municipal Corporation Varanasi',
    contractorName: 'Kashi Heritage Builders',
    contractorGstin: '09AAKHK7821B1Z3',
    wiriScore: 79, // HIGH RISK
    riskLevel: 'HIGH',
    anomaliesCount: 2,
    flags: [
      {
        id: 'F401',
        type: 'NON_PERMISSIBLE_ASSET',
        severity: 'CRITICAL',
        title: 'Violation of MPLADS Guideline Rule 5.2 (Prohibited Non-Public Asset)',
        description: 'Land record cadastral check reveals property belongs to a Registered Private Religious Trust. MPLADS funds strictly forbidden for private/religious properties.',
        confidence: 0.98,
        detectedAt: '2024-06-10'
      },
      {
        id: 'F402',
        type: 'DPR_PRICE_INFLATION',
        severity: 'WARNING',
        title: 'Overpriced Luxury Items not sanctioned under CPWD DSR',
        description: 'DPR includes Italian marble and decorative chandeliers marked 65% above permissible Schedule of Rates.',
        confidence: 0.89,
        detectedAt: '2024-06-12'
      }
    ],
    dprId: 'DPR-004'
  },
  {
    id: 'W005',
    code: 'MPLADS/2023-24/UP-VAR-0088',
    title: 'Installation of 500 Deep Borewell Handpumps in Cholapur Block',
    description: 'Distributed drinking water handpumps in rural wards.',
    category: 'Drinking Water',
    constituencyId: 'VARANASI',
    locationName: 'Cholapur, Varanasi',
    lat: 25.4410,
    lng: 83.0320,
    demographicZone: 'GENERAL',
    sanctionedAmountLakhs: 110.0,
    utilizedAmountLakhs: 45.0,
    sanctionDate: '2023-08-15',
    targetCompletionDate: '2024-02-28',
    status: 'LANGUISHING',
    implementingAgency: 'Rural Engineering Department (RED)',
    contractorName: 'Shiva Buildtech Infrastructure Ltd',
    contractorGstin: '09AABCS8891J1Z2',
    wiriScore: 76,
    riskLevel: 'HIGH',
    anomaliesCount: 2,
    flags: [
      {
        id: 'F501',
        type: 'FUND_PARKING_STALL',
        severity: 'CRITICAL',
        title: 'Fund Parking & Languishing Milestone: 14 Months Overdue',
        description: '₹65 Lakhs lying idle in un-monitored bank account. Only 18 out of 500 handpumps completed on ground.',
        confidence: 0.92,
        detectedAt: '2024-07-01'
      }
    ]
  },
  // Wayanad Works
  {
    id: 'W006',
    code: 'MPLADS/2024-25/KL-WAY-0041',
    title: 'Construction of Tribal Skill Development Center at Meppadi ST Colony',
    description: 'Vocational training lab and craft center for tribal youth.',
    category: 'Education & Schools',
    constituencyId: 'WAYANAD',
    locationName: 'Meppadi, Wayanad',
    lat: 11.5510,
    lng: 76.1280,
    demographicZone: 'ST_MANDATED',
    sanctionedAmountLakhs: 75.0,
    utilizedAmountLakhs: 75.0,
    sanctionDate: '2024-02-10',
    targetCompletionDate: '2024-08-30',
    actualCompletionDate: '2024-09-05',
    status: 'COMPLETED',
    implementingAgency: 'Kerala PWD Buildings, Kalpetta',
    contractorName: 'Malabar Infrastructure Co-op',
    contractorGstin: '32AABCM9012P1Z6',
    wiriScore: 12,
    riskLevel: 'LOW',
    anomaliesCount: 0,
    flags: []
  },
  {
    id: 'W007',
    code: 'MPLADS/2024-25/KL-WAY-0048',
    title: 'Installation of River Flood Early Warning System & Solar Siren Mast',
    description: 'River level telemetry sensor and multi-point siren masts along Kabini basin.',
    category: 'Irrigation & Flood Control',
    constituencyId: 'WAYANAD',
    locationName: 'Mananthavady, Wayanad',
    lat: 11.8020,
    lng: 76.0030,
    demographicZone: 'GENERAL',
    sanctionedAmountLakhs: 60.0,
    utilizedAmountLakhs: 60.0,
    sanctionDate: '2024-04-18',
    targetCompletionDate: '2024-10-15',
    actualCompletionDate: '2024-10-28',
    status: 'COMPLETED',
    implementingAgency: 'Irrigation Dept, Wayanad',
    contractorName: 'Western Ghats Tech Solutions',
    contractorGstin: '32AAXCW7712E1Z8',
    wiriScore: 82,
    riskLevel: 'HIGH',
    anomaliesCount: 2,
    flags: [
      {
        id: 'F701',
        type: 'CROSS_SCHEME_COLLISION',
        severity: 'CRITICAL',
        title: 'Collision with SDMA State Disaster Management Project',
        description: 'Sensors installed were funded under World Bank KDRP Project in 2023. Billed again under MPLADS.',
        confidence: 0.95,
        detectedAt: '2024-11-01'
      }
    ]
  },
  // Bangalore South Works
  {
    id: 'W008',
    code: 'MPLADS/2024-25/KA-BLR-0201',
    title: 'High-Tech Digital Classroom & Robotic Lab in Jayanagar Govt PU College',
    description: '30 Smart interactive panels, STEM robotics kits and Wi-Fi networking.',
    category: 'Education & Schools',
    constituencyId: 'BLR_SOUTH',
    locationName: 'Jayanagar 4th Block, Bangalore',
    lat: 12.9290,
    lng: 77.5830,
    demographicZone: 'GENERAL',
    sanctionedAmountLakhs: 95.0,
    utilizedAmountLakhs: 95.0,
    sanctionDate: '2024-01-15',
    targetCompletionDate: '2024-06-30',
    actualCompletionDate: '2024-07-02',
    status: 'COMPLETED',
    implementingAgency: 'BBMP Education Cell',
    contractorName: 'CyberEd Systems Pvt Ltd',
    contractorGstin: '29AABCC4510D1Z1',
    wiriScore: 78,
    riskLevel: 'HIGH',
    anomaliesCount: 2,
    flags: [
      {
        id: 'F801',
        type: 'DPR_PRICE_INFLATION',
        severity: 'CRITICAL',
        title: 'DPR Hardware Pricing 52% Above GeM (Government e-Marketplace) Rates',
        description: 'Interactive LED flat panels billed at ₹2.85 Lakhs per unit vs GeM CPWD rate of ₹1.35 Lakhs.',
        confidence: 0.97,
        detectedAt: '2024-07-10'
      }
    ]
  },
  {
    id: 'W009',
    code: 'MPLADS/2024-25/KA-BLR-0210',
    title: 'Rainwater Harvesting & Lake Rejuvenation Bio-Filter at Yediyur Lake',
    description: 'Desilting, bio-remediation floating wetlands and percolation trenches.',
    category: 'Irrigation & Flood Control',
    constituencyId: 'BLR_SOUTH',
    locationName: 'Yediyur, Bangalore',
    lat: 12.9320,
    lng: 77.5750,
    demographicZone: 'GENERAL',
    sanctionedAmountLakhs: 120.0,
    utilizedAmountLakhs: 118.0,
    sanctionDate: '2024-03-01',
    targetCompletionDate: '2024-09-30',
    actualCompletionDate: '2024-10-05',
    status: 'COMPLETED',
    implementingAgency: 'BBMP Lakes Division',
    contractorName: 'EcoSustain Engineering LLP',
    contractorGstin: '29AABFE9901M1Z8',
    wiriScore: 22,
    riskLevel: 'LOW',
    anomaliesCount: 0,
    flags: []
  },
  // Patna Sahib Works
  {
    id: 'W010',
    code: 'MPLADS/2024-25/BR-PAT-0015',
    title: 'Construction of Drainage Network and Paver Block Road at Gulzarbagh',
    description: 'Covered RCC drain with interlocking concrete tiles over 2.4 km stretch.',
    category: 'Sanitation',
    constituencyId: 'PATNA_SAHIB',
    locationName: 'Gulzarbagh, Patna',
    lat: 25.5920,
    lng: 85.1950,
    demographicZone: 'GENERAL',
    sanctionedAmountLakhs: 145.0,
    utilizedAmountLakhs: 145.0,
    sanctionDate: '2024-02-01',
    targetCompletionDate: '2024-08-31',
    actualCompletionDate: '2024-09-18',
    status: 'COMPLETED',
    implementingAgency: 'Patna Municipal Corporation (PMC)',
    contractorName: 'Magadh Infra Projects Pvt Ltd',
    contractorGstin: '10AABCM3312N1Z7',
    wiriScore: 94,
    riskLevel: 'CRITICAL',
    anomaliesCount: 4,
    flags: [
      {
        id: 'F901',
        type: 'SATELLITE_GHOST_WORK',
        severity: 'CRITICAL',
        title: 'Sentinel-2 Optical & Thermal Delta: Zero Road Paving Evident',
        description: 'Satellite optical multi-spectral reflectance shows unpaved muddy road across both pre and post sanction periods.',
        confidence: 0.98,
        detectedAt: '2024-09-25'
      },
      {
        id: 'F902',
        type: 'CROSS_SCHEME_COLLISION',
        severity: 'CRITICAL',
        title: 'Collision with Smart City Patna Drain Project #SC-PAT-091',
        description: 'Duplicate sanction on identical chainage (Ch. 0+000 to 2+400) funded under Smart Cities Mission in 2023.',
        confidence: 0.96,
        detectedAt: '2024-09-28'
      },
      {
        id: 'F903',
        type: 'CARTEL_BID_RIGGING',
        severity: 'WARNING',
        title: 'Single-Bidder Cartel disguised as 3 tenders',
        description: 'Magadh Infra, Patliputra Const, and Ganga Valley share identical IFSC bank branch & IP address during e-tender submission.',
        confidence: 0.94,
        detectedAt: '2024-03-01'
      }
    ]
  }
];

export const SATELLITE_SCANS: Record<string, SatelliteScan> = {
  'SAT-001': {
    id: 'SAT-001',
    workId: 'W001',
    // Realistic SVG visual mockups simulating satellite optical / SAR and ground imagery
    sanctionDateImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80', // Unpaved dirt ground
    completionDateImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80', // Still dirt ground (GHOST WORK)
    sarBackscatterChangeDb: 0.04, // No structural radar change
    ndbiChangePercent: 0.02, // No concrete/built-up increase
    detectedGroundChangePercent: 3.1, // Near zero
    claimedProgressPercent: 100.0,
    verificationVerdict: 'GHOST_WORK_SUSPECTED',
    groundPhotoUrl: 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?w=800&auto=format&fit=crop&q=80',
    groundPhotoExif: {
      cameraModel: 'iPhone 13 Pro (Forged metadata)',
      timestamp: '2024-10-12 14:22:18 IST',
      gpsLat: 25.2650,
      gpsLng: 82.9120,
      gpsDeviationMeters: 41200, // Actually taken 41 km away in Mirzapur!
      isSpoofed: true,
      errorLevelAnalysisScore: 88, // Tampered lighting/overlay
      perceptualHashMatchFound: true,
      duplicateMatchedWorkCode: 'MPLADS/2022-23/UP-MIR-0054'
    }
  },
  'SAT-002': {
    id: 'SAT-002',
    workId: 'W002',
    sanctionDateImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    completionDateImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    sarBackscatterChangeDb: 0.12,
    ndbiChangePercent: 1.1,
    detectedGroundChangePercent: 4.5,
    claimedProgressPercent: 100.0,
    verificationVerdict: 'SURFACE_MISMATCH',
    groundPhotoUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop&q=80',
    groundPhotoExif: {
      cameraModel: 'Samsung Galaxy A53',
      timestamp: '2024-11-20 11:05:40 IST',
      gpsLat: 25.3210,
      gpsLng: 82.9810,
      gpsDeviationMeters: 12,
      isSpoofed: false,
      errorLevelAnalysisScore: 24,
      perceptualHashMatchFound: true,
      duplicateMatchedWorkCode: 'PM-KUSUM/2023/UP-VAR-K091'
    }
  },
  'SAT-003': {
    id: 'SAT-003',
    workId: 'W003',
    sanctionDateImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    completionDateImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=800&auto=format&fit=crop&q=80',
    sarBackscatterChangeDb: 3.85, // Clear radar reflection from concrete roof
    ndbiChangePercent: 42.6, // Heavy built-up increase
    detectedGroundChangePercent: 82.4, // Real progress matches ground
    claimedProgressPercent: 80.0,
    verificationVerdict: 'VERIFIED_PHYSICAL_CHANGE',
    groundPhotoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=800&auto=format&fit=crop&q=80',
    groundPhotoExif: {
      cameraModel: 'OnePlus Nord CE 3',
      timestamp: '2024-10-25 16:40:12 IST',
      gpsLat: 25.3620,
      gpsLng: 82.9640,
      gpsDeviationMeters: 4,
      isSpoofed: false,
      errorLevelAnalysisScore: 12,
      perceptualHashMatchFound: false
    }
  }
};

export const DOUBLE_DIPPING_ALERTS: DoubleDippingAlert[] = [
  {
    id: 'DD-001',
    mpladsWorkId: 'W002',
    mpladsWorkTitle: 'Installation of Solar High-Mast High-Capacity Tube Well & Water Kiosk',
    mpladsAmountLakhs: 42.0,
    collidingScheme: 'PMGSY',
    collidingProjectCode: 'PM-KUSUM/2023/UP-VAR-K091',
    collidingProjectTitle: 'Installation of Community Solar Pump and RO Water Filter Unit',
    collidingAmountLakhs: 38.5,
    collidingAgency: 'UP New and Renewable Energy Development Agency (UPNEDA)',
    distanceMeters: 8.4,
    semanticSimilarityPercent: 88.6,
    overlapProbabilityPercent: 96.2,
    estimatedDuplicateLossLakhs: 42.0,
    locationName: 'Kashi Vidyapith Block, Ward 14, Varanasi'
  },
  {
    id: 'DD-002',
    mpladsWorkId: 'W010',
    mpladsWorkTitle: 'Construction of Drainage Network and Paver Block Road at Gulzarbagh',
    mpladsAmountLakhs: 145.0,
    collidingScheme: 'Smart Cities Mission',
    collidingProjectCode: 'SC-PAT-091/2023-DRAIN',
    collidingProjectTitle: 'Smart Stormwater Drainage & Solid Paving in Gulzarbagh Industrial Zone',
    collidingAmountLakhs: 210.0,
    collidingAgency: 'Patna Smart City Development Ltd (PSCDL)',
    distanceMeters: 14.2,
    semanticSimilarityPercent: 91.4,
    overlapProbabilityPercent: 98.5,
    estimatedDuplicateLossLakhs: 145.0,
    locationName: 'Gulzarbagh, Patna'
  },
  {
    id: 'DD-003',
    mpladsWorkId: 'W007',
    mpladsWorkTitle: 'Installation of River Flood Early Warning System & Solar Siren Mast',
    mpladsAmountLakhs: 60.0,
    collidingScheme: 'Urban Local Body (ULB) Grant',
    collidingProjectCode: 'SDMA-KDRP/2023/FL-014',
    collidingProjectTitle: 'Telemetry Hydrological Siren & Water Level Gauge Station',
    collidingAmountLakhs: 55.0,
    collidingAgency: 'State Disaster Management Authority (SDMA), Kerala',
    distanceMeters: 22.1,
    semanticSimilarityPercent: 84.2,
    overlapProbabilityPercent: 92.0,
    estimatedDuplicateLossLakhs: 60.0,
    locationName: 'Mananthavady, Wayanad'
  }
];

export const CARTEL_NODES: CartelNode[] = [
  { id: 'C1', name: 'Shiva Buildtech Infrastructure Ltd', type: 'CONTRACTOR', isFlagged: true, totalContractsWon: 14, totalValueCrores: 12.8, riskScore: 94 },
  { id: 'C2', name: 'Om Aqua & Infra Projects', type: 'CONTRACTOR', isFlagged: true, totalContractsWon: 9, totalValueCrores: 7.2, riskScore: 88 },
  { id: 'C3', name: 'Maa Ganga Civil Works Pvt Ltd', type: 'CONTRACTOR', isFlagged: true, totalContractsWon: 7, totalValueCrores: 5.4, riskScore: 82 },
  { id: 'C4', name: 'Purvanchal Nirman Nigam', type: 'CONTRACTOR', isFlagged: false, totalContractsWon: 4, totalValueCrores: 3.1, riskScore: 18 },
  { id: 'D1', name: 'Rakesh Kumar Singh (Director)', type: 'DIRECTOR', isFlagged: true, totalContractsWon: 0, totalValueCrores: 0, riskScore: 95 },
  { id: 'D2', name: 'Sunita Devi Singh (Director/Spouse)', type: 'DIRECTOR', isFlagged: true, totalContractsWon: 0, totalValueCrores: 0, riskScore: 90 },
  { id: 'G1', name: 'Shared PAN: AABCS8891J', type: 'GSTIN', isFlagged: true, totalContractsWon: 0, totalValueCrores: 0, riskScore: 92 },
  { id: 'A1', name: 'Office 402, Kashi Commercial Complex', type: 'SHARED_PHONE', isFlagged: true, totalContractsWon: 0, totalValueCrores: 0, riskScore: 89 },
  { id: 'IA1', name: 'Executive Engineer - RED Varanasi', type: 'IMPLEMENTING_AGENCY', isFlagged: true, totalContractsWon: 0, totalValueCrores: 0, riskScore: 85 },
  { id: 'B1', name: 'SBI Sigra Branch (A/C: 981244001)', type: 'BANK_BRANCH', isFlagged: true, totalContractsWon: 0, totalValueCrores: 0, riskScore: 78 }
];

export const CARTEL_EDGES: CartelEdge[] = [
  { source: 'D1', target: 'C1', relationship: 'DIRECTOR_OF', weight: 1.0 },
  { source: 'D1', target: 'C2', relationship: 'DIRECTOR_OF', weight: 1.0 },
  { source: 'D2', target: 'C3', relationship: 'DIRECTOR_OF', weight: 1.0 },
  { source: 'C1', target: 'G1', relationship: 'SHARED_GSTIN_PAN', weight: 0.9 },
  { source: 'C2', target: 'G1', relationship: 'SHARED_GSTIN_PAN', weight: 0.9 },
  { source: 'C1', target: 'A1', relationship: 'SHARED_ADDRESS', weight: 0.95 },
  { source: 'C2', target: 'A1', relationship: 'SHARED_ADDRESS', weight: 0.95 },
  { source: 'C3', target: 'A1', relationship: 'SHARED_ADDRESS', weight: 0.95 },
  { source: 'C1', target: 'C2', relationship: 'CO_BIDDER', coBidFrequency: 18, weight: 0.98 },
  { source: 'C2', target: 'C3', relationship: 'CO_BIDDER', coBidFrequency: 14, weight: 0.92 },
  { source: 'C1', target: 'C3', relationship: 'CO_BIDDER', coBidFrequency: 16, weight: 0.95 },
  { source: 'IA1', target: 'C1', relationship: 'AWARDED_TO', weight: 0.85 },
  { source: 'C1', target: 'B1', relationship: 'SHARED_CONTACT', weight: 0.75 },
  { source: 'C2', target: 'B1', relationship: 'SHARED_CONTACT', weight: 0.75 }
];

export const CARTEL_CLUSTERS: CartelCluster[] = [
  {
    id: 'RING-01',
    name: 'Purvanchal Cover-Bidding & Front-Company Nexus',
    ringType: 'ROTATIONAL_COVER_BIDDING',
    entitiesCount: 6,
    totalWorksMonopolized: 30,
    totalValueCrores: 25.4,
    cartelConfidence: 0.96,
    keyEntities: ['Shiva Buildtech', 'Om Aqua Infra', 'Maa Ganga Civil', 'Rakesh Kumar Singh']
  }
];

export const SAMPLE_DPRS: Record<string, DPRDocument> = {
  'DPR-001': {
    id: 'DPR-001',
    workId: 'W001',
    workTitle: 'Construction of CC Road from Rohania Canal to PHC',
    fileName: 'DPR_Rohania_CC_Road_2024.pdf',
    submittedAgency: 'Rural Engineering Department (RED), Varanasi',
    submissionDate: '2024-03-05',
    totalClaimedCostLakhs: 85.0,
    permissibleCostLakhs: 58.6,
    totalInflationLakhs: 26.4,
    overallMarkupPercent: 45.05,
    guidelineCompliance: {
      isPermissibleAsset: true,
      landOwnershipType: 'PANCHAYAT',
      scStQuotaEligible: false,
      mandatoryDisplayBoardIncluded: true,
      violationsFound: [
        'Rate of M25 Cement Concrete is inflated 48.2% above CPWD DSR Item 5.1.2',
        'Excavation labor rate exceeds UP PWD Schedule of Rates by 32%'
      ]
    },
    lineItems: [
      {
        id: 'L1',
        itemDescription: 'Earthwork excavation in ordinary soil including dressing and leveling',
        unit: 'cum',
        quantity: 1400,
        claimedRateInr: 340.0,
        cpwdDsrRateInr: 215.0,
        claimedTotalInr: 476000,
        permissibleTotalInr: 301000,
        rateInflationPercent: 58.1,
        isFlagged: true,
        reason: '58% above CPWD DSR 2.8'
      },
      {
        id: 'L2',
        itemDescription: 'Providing and laying Ready Mixed Concrete (RMC) M25 grade for pavement',
        unit: 'cum',
        quantity: 750,
        claimedRateInr: 7850.0,
        cpwdDsrRateInr: 5200.0,
        claimedTotalInr: 5887500,
        permissibleTotalInr: 3900000,
        rateInflationPercent: 50.96,
        isFlagged: true,
        reason: 'Cement concrete severely marked up beyond state ceiling'
      },
      {
        id: 'L3',
        itemDescription: 'Mild steel reinforcement bars Fe500 grade including cutting and bending',
        unit: 'kg',
        quantity: 12500,
        claimedRateInr: 92.0,
        cpwdDsrRateInr: 68.5,
        claimedTotalInr: 1150000,
        permissibleTotalInr: 856250,
        rateInflationPercent: 34.3,
        isFlagged: true,
        reason: 'Steel rate exceeds SAIL wholesale DSR reference'
      },
      {
        id: 'L4',
        itemDescription: 'Mandatory Citizen Information Plaque (Marble / Cast Iron Display Board)',
        unit: 'each',
        quantity: 2,
        claimedRateInr: 25000.0,
        cpwdDsrRateInr: 8500.0,
        claimedTotalInr: 50000,
        permissibleTotalInr: 17000,
        rateInflationPercent: 194.1,
        isFlagged: true,
        reason: 'Signage marked up by ~200%'
      }
    ]
  },
  'DPR-004': {
    id: 'DPR-004',
    workId: 'W004',
    workTitle: 'Renovation & Granite Flooring of Mahant Bhavan Trust Complex',
    fileName: 'DPR_Assi_Bhavan_Renovation.pdf',
    submittedAgency: 'Municipal Corporation Varanasi',
    submissionDate: '2024-05-20',
    totalClaimedCostLakhs: 55.0,
    permissibleCostLakhs: 0.0, // Strictly prohibited
    totalInflationLakhs: 55.0,
    overallMarkupPercent: 100.0,
    guidelineCompliance: {
      isPermissibleAsset: false,
      landOwnershipType: 'PRIVATE_TRUST',
      scStQuotaEligible: false,
      mandatoryDisplayBoardIncluded: false,
      violationsFound: [
        'CRITICAL: Violation of MPLADS Guideline Para 5.2 - Works on assets owned by private religious trusts are strictly prohibited.',
        'Prohibited purchase: Luxury Italian marble and decorative lighting are barred under MPLADS public utility rules.'
      ]
    },
    lineItems: [
      {
        id: 'L201',
        itemDescription: 'Imported Italian Statuario Marble flooring and mirror polish',
        unit: 'sqm',
        quantity: 350,
        claimedRateInr: 6500.0,
        cpwdDsrRateInr: 0.0,
        claimedTotalInr: 2275000,
        permissibleTotalInr: 0,
        rateInflationPercent: 100.0,
        isFlagged: true,
        reason: 'Non-permissible luxury specification under public schemes'
      }
    ]
  }
};

export const CITIZEN_REPORTS: CitizenReport[] = [
  {
    id: 'CR-001',
    workId: 'W001',
    workTitle: 'Construction of CC Road from Rohania Canal to PHC',
    citizenName: 'Manoj Kumar Maurya',
    phoneMasked: '+91 98390 XXXXX',
    submissionDate: '2024-10-18',
    lat: 25.2652,
    lng: 82.9124,
    distanceFromAssetMeters: 28,
    photoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
    voiceNoteTranscript: 'यहां कोई पक्की सड़क नहीं बनी है। ठेकेदार ने बस बोर्ड लगाया और चले गए। बारिश में पूरा कीचड़ भरा है।',
    language: 'Hindi (Bhojpuri dialect)',
    aiDefectTags: ['No Concrete Pavement Found', 'Unpaved Mud Track', 'Ghost Work Indicator'],
    citizenRating: 1,
    status: 'INVESTIGATION_ORDERED'
  },
  {
    id: 'CR-002',
    workId: 'W002',
    workTitle: 'Solar High-Mast Tube Well & Water Kiosk',
    citizenName: 'Pooja Vishwakarma',
    phoneMasked: '+91 87652 XXXXX',
    submissionDate: '2024-11-24',
    lat: 25.3211,
    lng: 82.9813,
    distanceFromAssetMeters: 14,
    photoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    voiceNoteTranscript: 'यह नल तो पुराना कुसुम योजना वाला ही है, उसपर नया MPLADS का स्टीकर चिपका दिया है। पानी का फिल्टर भी खराब है।',
    language: 'Hindi',
    aiDefectTags: ['Relabeled Asset', 'Broken Filter Dispenser', 'Double-Dipping Evidence'],
    citizenRating: 2,
    status: 'INVESTIGATION_ORDERED'
  }
];
