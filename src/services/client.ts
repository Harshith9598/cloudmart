import type {
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from '@/types';

const TOKEN_KEY = 'cloudmart_access_token';
const REFRESH_KEY = 'cloudmart_refresh_token';

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(tokens: AuthTokens): void {
  localStorage.setItem(TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string>;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const data: AuthTokens = await res.json();
    setTokens(data);
    return true;
  } catch {
    return false;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (res.status === 401 && token && !isRefreshing) {
    isRefreshing = true;
    refreshPromise = refreshTokens();
    const refreshed = await refreshPromise;
    isRefreshing = false;
    refreshPromise = null;

    if (refreshed) {
      const newToken = getAccessToken();
      if (newToken) headers['Authorization'] = `Bearer ${newToken}`;
      const retryRes = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
      if (!retryRes.ok) {
        throw await parseError(retryRes);
      }
      return await parseBody<T>(retryRes);
    } else {
      clearTokens();
      throw { message: 'Session expired. Please sign in again.', status: 401 } as ApiError;
    }
  }

  if (!res.ok) throw await parseError(res);
  return await parseBody<T>(res);
}

async function parseBody<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

async function parseError(res: Response): Promise<ApiError> {
  try {
    const body = await res.json();
    return {
      message: body.message || body.error || 'Request failed',
      status: res.status,
      errors: body.errors,
    };
  } catch {
    return { message: `Request failed with status ${res.status}`, status: res.status };
  }
}

export const apiClient = {
  get: <T>(endpoint: string) => apiFetch<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown) =>
    apiFetch<T>(endpoint, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  put: <T>(endpoint: string, body?: unknown) =>
    apiFetch<T>(endpoint, { method: 'PUT', body: JSON.stringify(body ?? {}) }),
  patch: <T>(endpoint: string, body?: unknown) =>
    apiFetch<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body ?? {}) }),
  delete: <T>(endpoint: string) => apiFetch<T>(endpoint, { method: 'DELETE' }),
};

// ============ Auth Service ============
export const authService = {
  async login(req: LoginRequest): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/login', req);
    setTokens(res.tokens);
    return res;
  },

  async register(req: RegisterRequest): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/register', req);
    setTokens(res.tokens);
    return res;
  },

  async me(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post<void>('/auth/logout');
    } finally {
      clearTokens();
    }
  },

  isAuthenticated(): boolean {
    return !!getAccessToken();
  },
};
