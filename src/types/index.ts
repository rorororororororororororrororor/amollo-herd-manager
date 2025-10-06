// User and Authentication Types
export type UserRole = 'root' | 'farmhand';

export interface User {
  id: string;
  name: string;
  phone_number: string;
  role: UserRole;
  can_access_expenses?: boolean;
  created_at: string;
}

export interface LoginCredentials {
  phone_number: string;
  password?: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Farm Types
export interface Farm {
  id: string;
  name: string;
  location: string;
  created_at: string;
}

// Animal Types
export type AnimalSex = 'Male' | 'Female';
export type AnimalBreed = 'Friesian' | 'Ayrshire' | 'Jersey' | 'Guernsey' | 'Holstein' | 'Zebu' | 'Crossbreed' | 'Other';
export type AnimalStatus = 'Calf' | 'Weaned Calf' | 'Heifer' | 'In-calf Heifer' | 'Lactating – Open' | 'Lactating – In-calf' | 'Dry – In-calf' | 'Dry – Open' | 'Bull' | 'Sold' | 'Deceased' | 'Cull';
export type BodyConditionScore = 1 | 2 | 3 | 4 | 5;

export interface Animal {
  id: string;
  tag_id: string;
  name: string;
  sex: AnimalSex;
  status: AnimalStatus;
  breed: AnimalBreed;
  date_of_birth: string;
  sire: string;
  dam: string;
  acquisition_date: string;
  acquisition_source: string;
  weight?: number;
  body_condition_score?: BodyConditionScore;
  bcs_recorded_on?: string;
  photo_url?: string;
  farm_id: string;
  created_at: string;
}

// Milk Production Types
export interface MilkRecord {
  id: string;
  animal_id: string;
  date: string;
  morning_yield: number;
  evening_yield: number;
  total_yield: number;
  saleable: number;
  farm_id: string;
  created_at: string;
}

export interface CalfAllocation {
  id: string;
  date: string;
  allocation_amount: number;
  farm_id: string;
  created_at: string;
}

export interface DailyMilkStats {
  date: string;
  total_production: number;
  total_sold: number;
  calf_allocation: number;
}

// Health Types
export type TreatedBy = 'Veterinarian' | 'Farm Employee' | 'Self';

export interface DiseaseRecord {
  id: string;
  animal_id: string;
  date: string;
  condition: string;
  symptoms: string;
  treatment: string;
  treated_by: TreatedBy;
  veterinarian_name?: string;
  milk_withdrawal_days: number;
  meat_withdrawal_days: number;
  remarks?: string;
  treatment_cost?: number;
  cost_description?: string;
  farm_id: string;
  created_at: string;
}

export type PreventiveProcedure = 'Vaccination' | 'Deworming' | 'Hoof Trimming' | 'Spraying' | 'Other';
export type AdministeredBy = 'Veterinarian' | 'Technician' | 'Farm Employee' | 'Self';

export interface PreventiveHealthRecord {
  id: string;
  procedure: PreventiveProcedure;
  date: string;
  product_name: string;
  dose: string;
  administered_by: AdministeredBy;
  remarks?: string;
  animal_ids: string[];
  farm_id: string;
  created_at: string;
}

export interface PreventiveProcedureTemplate {
  id: string;
  name: string;
  interval_days: number;
  farm_id: string;
}

// Breeding Types
export type ServiceType = 'Artificial Insemination' | 'Natural Service';
export type SemenType = 'Conventional' | 'Sexed';
export type BreedingResult = 'Pregnant' | 'Not Pregnant' | 'Pending' | 'Aborted';

export interface BreedingRecord {
  id: string;
  animal_id: string;
  heat_date: string;
  heat_signs: string;
  service_date: string;
  service_type: ServiceType;
  semen_type?: SemenType;
  sire: string;
  breeding_goal: string;
  inseminator: string;
  remarks?: string;
  result?: BreedingResult;
  expected_delivery_date?: string;
  farm_id: string;
  created_at: string;
}

export interface Sire {
  id: string;
  name: string;
  breed: AnimalBreed;
  registration_number?: string;
  source: string;
  farm_id: string;
  created_at: string;
}

// Expense Types
export type ExpenseCategory = 
  | 'Salary' 
  | 'Treatment' 
  | 'Structural Expansion' 
  | 'Feeds' 
  | 'Wages (Day Workers)' 
  | 'Equipment Purchase' 
  | 'Vet Treatment' 
  | 'Forage' 
  | 'Concentrates' 
  | 'Animal Acquisition' 
  | 'Transport' 
  | 'Miscellaneous';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  date: string;
  amount: number;
  description: string;
  animal_id?: string;
  employee_id?: string;
  farm_id: string;
  created_at: string;
}

// Dashboard Stats
export interface DashboardStats {
  herd_size: number;
  daily_production: number;
  daily_sold: number;
  lactating_cows: number;
  avg_daily_yield: number;
  highest_producer: {
    name: string;
    tag_id: string;
    yield: number;
  } | null;
  lowest_producer: {
    name: string;
    tag_id: string;
    yield: number;
  } | null;
  weekly_production: Array<{
    date: string;
    production: number;
    sold: number;
  }>;
}
