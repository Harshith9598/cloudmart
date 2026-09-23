import { apiClient } from './client';
import type { User, AdminUser, PaginatedResponse } from '@/types';

export interface UserListParams {
  page?: number;
  size?: number;
  search?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

function buildQuery(params?: Record<string, unknown> | object): string {
  if (!params) return '';
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== '',
  );
  if (entries.length === 0) return '';
  const search = new URLSearchParams();
  for (const [k, v] of entries) search.append(k, String(v));
  return `?${search.toString()}`;
}

export const usersService = {
  async getProfile(): Promise<User> {
    return apiClient.get<User>('/users/me');
  },

  async updateProfile(req: UpdateUserRequest): Promise<User> {
    return apiClient.put<User>('/users/me', req);
  },

  async changePassword(req: ChangePasswordRequest): Promise<void> {
    await apiClient.post<void>('/users/me/password', req);
  },

  async listUsers(params?: UserListParams): Promise<PaginatedResponse<AdminUser>> {
    const query = buildQuery(params);
    return apiClient.get<PaginatedResponse<AdminUser>>(`/users${query}`);
  },

  async getUser(id: string): Promise<AdminUser> {
    return apiClient.get<AdminUser>(`/users/${id}`);
  },

  async deactivateUser(id: string): Promise<void> {
    await apiClient.patch<void>(`/users/${id}/deactivate`);
  },

  async activateUser(id: string): Promise<void> {
    await apiClient.patch<void>(`/users/${id}/activate`);
  },
};
