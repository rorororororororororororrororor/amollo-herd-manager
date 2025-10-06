import { API_BASE_URL, getAuthToken, removeAuthToken, removeCurrentUser } from '@/config/api';
import type * as Types from '@/types';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    removeAuthToken();
    removeCurrentUser();
    window.location.href = '/login';
    throw new ApiError(401, 'Unauthorized');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new ApiError(response.status, error.message || 'An error occurred');
  }

  return response.json();
}

// Authentication API
export const authApi = {
  login: (credentials: Types.LoginCredentials) =>
    fetchApi<Types.AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  logout: () =>
    fetchApi('/auth/logout', { method: 'POST' }),
};

// User API
export const userApi = {
  getProfile: () =>
    fetchApi<Types.User>('/users/profile'),

  updateProfile: (data: Partial<Types.User>) =>
    fetchApi<Types.User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updatePassword: (oldPassword: string, newPassword: string) =>
    fetchApi('/users/password', {
      method: 'PUT',
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    }),

  listUsers: (farmId: string) =>
    fetchApi<Types.User[]>(`/users?farm_id=${farmId}`),

  createUser: (data: Omit<Types.User, 'id' | 'created_at'> & { password?: string }) =>
    fetchApi<Types.User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteUser: (userId: string) =>
    fetchApi(`/users/${userId}`, { method: 'DELETE' }),

  updateUserAccess: (userId: string, canAccessExpenses: boolean) =>
    fetchApi(`/users/${userId}/access`, {
      method: 'PUT',
      body: JSON.stringify({ can_access_expenses: canAccessExpenses }),
    }),
};

// Farm API
export const farmApi = {
  list: () =>
    fetchApi<Types.Farm[]>('/farms'),

  get: (id: string) =>
    fetchApi<Types.Farm>(`/farms/${id}`),

  create: (data: Omit<Types.Farm, 'id' | 'created_at'>) =>
    fetchApi<Types.Farm>('/farms', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Types.Farm>) =>
    fetchApi<Types.Farm>(`/farms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Animal API
export const animalApi = {
  list: (farmId: string) =>
    fetchApi<Types.Animal[]>(`/animals?farm_id=${farmId}`),

  get: (id: string) =>
    fetchApi<Types.Animal>(`/animals/${id}`),

  create: (data: FormData) =>
    fetchApi<Types.Animal>('/animals', {
      method: 'POST',
      headers: {},
      body: data,
    }),

  update: (id: string, data: FormData) =>
    fetchApi<Types.Animal>(`/animals/${id}`, {
      method: 'PUT',
      headers: {},
      body: data,
    }),

  delete: (id: string) =>
    fetchApi(`/animals/${id}`, { method: 'DELETE' }),
};

// Milk Production API
export const milkApi = {
  listRecords: (farmId: string, params?: { start_date?: string; end_date?: string; animal_id?: string }) => {
    const query = new URLSearchParams({ farm_id: farmId, ...params as any });
    return fetchApi<Types.MilkRecord[]>(`/milk/records?${query}`);
  },

  createRecord: (data: Omit<Types.MilkRecord, 'id' | 'created_at' | 'total_yield'>) =>
    fetchApi<Types.MilkRecord>('/milk/records', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getDailyStats: (farmId: string, date: string) =>
    fetchApi<Types.DailyMilkStats>(`/milk/daily-stats?farm_id=${farmId}&date=${date}`),

  getDashboardStats: (farmId: string) =>
    fetchApi<Types.DashboardStats>(`/milk/dashboard-stats?farm_id=${farmId}`),

  createCalfAllocation: (data: Omit<Types.CalfAllocation, 'id' | 'created_at'>) =>
    fetchApi<Types.CalfAllocation>('/milk/calf-allocation', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  listCalfAllocations: (farmId: string) =>
    fetchApi<Types.CalfAllocation[]>(`/milk/calf-allocation?farm_id=${farmId}`),
};

// Health API
export const healthApi = {
  listDiseaseRecords: (farmId: string, params?: { animal_id?: string; start_date?: string; end_date?: string }) => {
    const query = new URLSearchParams({ farm_id: farmId, ...params as any });
    return fetchApi<Types.DiseaseRecord[]>(`/health/disease?${query}`);
  },

  createDiseaseRecord: (data: Omit<Types.DiseaseRecord, 'id' | 'created_at'>) =>
    fetchApi<Types.DiseaseRecord>('/health/disease', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  listPreventiveRecords: (farmId: string, params?: { animal_id?: string; procedure?: string }) => {
    const query = new URLSearchParams({ farm_id: farmId, ...params as any });
    return fetchApi<Types.PreventiveHealthRecord[]>(`/health/preventive?${query}`);
  },

  createPreventiveRecord: (data: Omit<Types.PreventiveHealthRecord, 'id' | 'created_at'>) =>
    fetchApi<Types.PreventiveHealthRecord>('/health/preventive', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  listProcedures: (farmId: string) =>
    fetchApi<Types.PreventiveProcedureTemplate[]>(`/health/procedures?farm_id=${farmId}`),

  createProcedure: (data: Omit<Types.PreventiveProcedureTemplate, 'id'>) =>
    fetchApi<Types.PreventiveProcedureTemplate>('/health/procedures', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Breeding API
export const breedingApi = {
  listRecords: (farmId: string, animalId?: string) => {
    const query = animalId ? `?farm_id=${farmId}&animal_id=${animalId}` : `?farm_id=${farmId}`;
    return fetchApi<Types.BreedingRecord[]>(`/breeding/records${query}`);
  },

  createRecord: (data: Omit<Types.BreedingRecord, 'id' | 'created_at'>) =>
    fetchApi<Types.BreedingRecord>('/breeding/records', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateRecord: (id: string, data: Partial<Types.BreedingRecord>) =>
    fetchApi<Types.BreedingRecord>(`/breeding/records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  listSires: (farmId: string) =>
    fetchApi<Types.Sire[]>(`/breeding/sires?farm_id=${farmId}`),

  createSire: (data: Omit<Types.Sire, 'id' | 'created_at'>) =>
    fetchApi<Types.Sire>('/breeding/sires', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Expense API
export const expenseApi = {
  list: (farmId: string, params?: { start_date?: string; end_date?: string; category?: string }) => {
    const query = new URLSearchParams({ farm_id: farmId, ...params as any });
    return fetchApi<Types.Expense[]>(`/expenses?${query}`);
  },

  create: (data: Omit<Types.Expense, 'id' | 'created_at'>) =>
    fetchApi<Types.Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Types.Expense>) =>
    fetchApi<Types.Expense>(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi(`/expenses/${id}`, { method: 'DELETE' }),

  getTotal: (farmId: string, params?: { start_date?: string; end_date?: string }) => {
    const query = new URLSearchParams({ farm_id: farmId, ...params as any });
    return fetchApi<{ total: number }>(`/expenses/total?${query}`);
  },
};

export { ApiError };
