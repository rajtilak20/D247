const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Types
export interface Deal {
  id: number;
  title: string;
  slug: string;
  storeId: number;
  shortDescription: string;
  longDescription?: string;
  productImageUrl?: string;
  productUrl?: string;
  affiliateUrl: string;
  couponCode?: string;
  originalPrice: number;
  dealPrice: number;
  currency: string;
  discountPercent: number;
  startsAt?: string;
  expiresAt?: string;
  status: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  store?: Store;
}

export interface Store {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string;
  websiteUrl: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface DealsResponse {
  deals: Deal[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  admin: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

// Helper function
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
};

// Public API
export const getDeals = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  store?: string;
  minDiscount?: number;
  maxPrice?: number;
  q?: string;
}): Promise<DealsResponse> => {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
  }

  const url = `${API_BASE_URL}/deals${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  const response = await fetch(url);
  return handleResponse(response);
};

export const getDealBySlug = async (slug: string): Promise<Deal> => {
  const response = await fetch(`${API_BASE_URL}/deals/${slug}`);
  return handleResponse(response);
};

export const recordDealClick = async (id: number): Promise<{ success: boolean; affiliateUrl: string }> => {
  const response = await fetch(`${API_BASE_URL}/deals/${id}/click`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  return handleResponse(response);
};

export const getStores = async (): Promise<Store[]> => {
  const response = await fetch(`${API_BASE_URL}/stores`);
  return handleResponse(response);
};

// Admin API
export const adminLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const createDeal = async (data: Partial<Deal>): Promise<Deal> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/admin/deals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateDeal = async (id: number, data: Partial<Deal>): Promise<Deal> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/admin/deals/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteDeal = async (id: number): Promise<{ success: boolean }> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/admin/deals/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const createStore = async (data: Partial<Store>): Promise<Store> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/admin/stores`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const createCategory = async (data: Partial<Category>): Promise<Category> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/admin/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const createTag = async (data: Partial<Tag>): Promise<Tag> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/admin/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};
