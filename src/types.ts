/**
 * LıkırLoop Types & Data Contracts
 */

export type BottleOptionId = 'steel_flask' | 'tritan_sports' | 'single_use_pet' | 'open_cup';

export interface BottleOption {
  id: BottleOptionId;
  name: string;
  volumeMl: number;
  typeLabel: string;
  isAllowed: boolean;
  confidenceScore: number;
  statusTitle: string;
  statusMessage: string;
  statusLevel: 'success' | 'danger' | 'warning';
  materialTag: string;
  heightMm: number;
  mouthWidthMm: number;
}

export interface StudentProfile {
  studentId: string;
  fullName: string;
  dormitory: string;
  dormBlock: string;
  roomNumber: string;
  university: string;
  points: number;
  carbonCreditsGrams: number;
  registeredBottleType: string;
  registeredBottleVolume: number; // 500 or 750
  dailyWaterGoalLiters: number; // e.g. 2.0 L
  todayDrunkLiters: number;
  totalFillsLifetime: number;
  totalSavedTl: number;
  totalPetPrevented: number;
  streakDays: number;
  avatarSeed: string;
}

export type ValveSignalStatus = 'LOCKED_DISALLOWED' | 'LOCKED_UNCERTAIN' | 'SCANNING' | 'READY_GREEN' | 'DISPENSING';


export interface CampusTelemetryData {
  preventedPetBottles: number;
  targetBottles: number;
  studentSavingsTl: number;
  preventedCarbonGrams: number;
  systemHealthPercent: number;
  activeStations: number;
  totalDispensedLiters: number;
  tdsValuePpm: number;
  waterTempCelsius: number;
  filterRoHealthPercent: number;
  mineralBalanceScore: number;
  uvcSterilizationStatus: 'Active - %99.999' | 'Standby' | 'Maintenance';
}

export interface RewardPerk {
  id: string;
  title: string;
  category: 'Kantin' | 'Yurt Hizmeti' | 'Ulaşım' | 'Sürdürülebilirlik';
  pointsCost: number;
  description: string;
  badge: string;
  iconName: string;
  discountValue: string;
}

export interface CampusStationNode {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'busy' | 'standby';
  todayFills: number;
  filterHealth: number;
  tds: number;
  temp: number;
}
