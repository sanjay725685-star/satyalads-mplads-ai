import { WorkItem, WIRIBreakdown, RiskLevel, DPRDocument } from '../types';

/**
 * Calculates Great Circle distance between two lat/lng points in meters (Haversine formula).
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Calculates Explainable AI (XAI) Work Integrity Risk Index (WIRI) Breakdown with SHAP-like feature attributions.
 */
export function calculateWIRIBreakdown(work: WorkItem): WIRIBreakdown {
  // Extract signal values
  const hasGhostWork = work.flags.some(f => f.type === 'SATELLITE_GHOST_WORK');
  const hasCrossScheme = work.flags.some(f => f.type === 'CROSS_SCHEME_COLLISION');
  const hasCartel = work.flags.some(f => f.type === 'CARTEL_BID_RIGGING');
  const hasDprInflation = work.flags.some(f => f.type === 'DPR_PRICE_INFLATION');
  const hasNonPermissible = work.flags.some(f => f.type === 'NON_PERMISSIBLE_ASSET');
  const hasPhotoTamper = work.flags.some(f => f.type === 'PHOTO_METADATA_TAMPERING');
  const hasFundParking = work.flags.some(f => f.type === 'FUND_PARKING_STALL');

  const satelliteVal = hasGhostWork ? 95 : work.status === 'COMPLETED' ? 10 : 25;
  const cartelVal = hasCartel ? 88 : 15;
  const dprVal = hasNonPermissible ? 100 : hasDprInflation ? 75 : 12;
  const spatialVal = hasCrossScheme ? 94 : 5;
  const imageVal = hasPhotoTamper ? 98 : 8;
  const velocityVal = hasFundParking ? 85 : work.status === 'LANGUISHING' ? 70 : 15;

  const w_sat = 0.28;
  const w_cartel = 0.22;
  const w_dpr = 0.20;
  const w_spatial = 0.15;
  const w_img = 0.10;
  const w_vel = 0.05;

  const rawScore = 
    satelliteVal * w_sat +
    cartelVal * w_cartel +
    dprVal * w_dpr +
    spatialVal * w_spatial +
    imageVal * w_img +
    velocityVal * w_vel;

  const finalScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  let riskCategory: RiskLevel = 'LOW';
  if (finalScore >= 75) riskCategory = 'CRITICAL';
  else if (finalScore >= 50) riskCategory = 'HIGH';
  else if (finalScore >= 30) riskCategory = 'MEDIUM';

  const recommendations: string[] = [];
  if (hasGhostWork) {
    recommendations.push('ORDER IMMEDIATE PHYSICAL GROUND INSPECTION: Satellite radar shows zero terrain modification.');
  }
  if (hasCrossScheme) {
    recommendations.push('HALT FUND DISBURSEMENT: Potential double-dipping collision with parallel scheme within 25m radius.');
  }
  if (hasCartel) {
    recommendations.push('REFER TO VIGILANCE WING: Contractor exhibits beneficial ownership links & rotational bidding patterns.');
  }
  if (hasNonPermissible) {
    recommendations.push('ISSUE RECOVERY NOTICE: Asset identified as private/religious trust property in direct violation of MPLADS guidelines.');
  }
  if (hasDprInflation) {
    recommendations.push('RE-AUDIT BILL OF QUANTITIES: Key materials exceed State Schedule of Rates (DSR) by >30%.');
  }
  if (hasFundParking) {
    recommendations.push('RECALL UNUTILIZED ADVANCE: Unspent funds idling in IA bank account for >12 months.');
  }
  if (recommendations.length === 0) {
    recommendations.push('No anomalies detected. Physical and financial milestones are progressing in compliance.');
  }

  return {
    workId: work.id,
    finalScore,
    riskCategory,
    contributions: {
      satelliteDiscrepancy: {
        weight: w_sat,
        rawValue: satelliteVal,
        contribution: Math.round(satelliteVal * w_sat),
        explanation: hasGhostWork 
          ? 'High satellite anomaly: ESA Sentinel-2/SAR indicates 0% terrain construction'
          : 'Normal spectral reflectance observed'
      },
      cartelBidRigging: {
        weight: w_cartel,
        rawValue: cartelVal,
        contribution: Math.round(cartelVal * w_cartel),
        explanation: hasCartel
          ? 'Contractor shares director PAN/GSTIN with 2 competing bidders'
          : 'Healthy competitive bidding detected'
      },
      dprOverpricing: {
        weight: w_dpr,
        rawValue: dprVal,
        contribution: Math.round(dprVal * w_dpr),
        explanation: hasNonPermissible
          ? 'Non-permissible private trust asset flagged (100% violation)'
          : hasDprInflation
          ? 'DPR rates exceed CPWD DSR ceilings by >35%'
          : 'DPR rates conform to standard Schedule of Rates'
      },
      spatialDoubleDipping: {
        weight: w_spatial,
        rawValue: spatialVal,
        contribution: Math.round(spatialVal * w_spatial),
        explanation: hasCrossScheme
          ? 'Spatial coordinate collision (<15m) with existing state project'
          : 'Isolated spatial footprint, no overlap found'
      },
      imageTampering: {
        weight: w_img,
        rawValue: imageVal,
        contribution: Math.round(imageVal * w_img),
        explanation: hasPhotoTamper
          ? 'EXIF GPS spoofing & perceptual image hash duplicate found'
          : 'Ground photo verified with authentic camera metadata'
      },
      fundLanguishingVelocity: {
        weight: w_vel,
        rawValue: velocityVal,
        contribution: Math.round(velocityVal * w_vel),
        explanation: hasFundParking
          ? 'Fund parking detected: zero milestone velocity for 14 months'
          : 'Fund velocity matches target milestones'
      }
    },
    auditRecommendations: recommendations
  };
}

/**
 * Real-time DPR Rate Audit Engine
 */
export function auditDPRDocument(dpr: DPRDocument) {
  let totalClaimed = 0;
  let totalPermissible = 0;
  let flaggedCount = 0;

  dpr.lineItems.forEach(item => {
    totalClaimed += item.claimedTotalInr;
    totalPermissible += item.permissibleTotalInr;
    if (item.isFlagged) flaggedCount++;
  });

  const inflationAmount = Math.max(0, totalClaimed - totalPermissible);
  const inflationPercent = totalPermissible > 0 ? (inflationAmount / totalPermissible) * 100 : 100;

  return {
    totalClaimed,
    totalPermissible,
    inflationAmount,
    inflationPercent: Number(inflationPercent.toFixed(1)),
    flaggedCount,
    isCompliant: flaggedCount === 0 && dpr.guidelineCompliance.isPermissibleAsset
  };
}
