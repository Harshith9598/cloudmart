import { apiClient } from './client';
import type {
  AdminStats,
  AdminUser,
  SellerProfile,
  Product,
  Order,
  AuditLog,
  PaginatedResponse,
  OrderStatus,
} from '@/types';

export interface AdminProductListParams {
  page?: number;
  size?: number;
  active?: boolean;
  search?: string;
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

export const adminService = {
  async getStats(): Promise<AdminStats> {
    return apiClient.get<AdminStats>('/admin/stats');
  },

  async listUsers(params?: { page?: number; size?: number; search?: string }): Promise<PaginatedResponse<AdminUser>> {
    return apiClient.get<PaginatedResponse<AdminUser>>(`/admin/users${buildQuery(params)}`);
  },

  async listSellers(params?: { page?: number; size?: number; verified?: boolean }): Promise<PaginatedResponse<SellerProfile>> {
    return apiClient.get<PaginatedResponse<SellerProfile>>(`/admin/sellers${buildQuery(params)}`);
  },

  async listProducts(params?: AdminProductListParams): Promise<PaginatedResponse<Product>> {
    return apiClient.get<PaginatedResponse<Product>>(`/admin/products${buildQuery(params)}`);
  },

  async listOrders(params?: { page?: number; size?: number; status?: OrderStatus }): Promise<PaginatedResponse<Order>> {
    return apiClient.get<PaginatedResponse<Order>>(`/admin/orders${buildQuery(params)}`);
  },

  async approveProduct(id: string): Promise<Product> {
    return apiClient.patch<Product>(`/admin/products/${id}/approve`);
  },

  async rejectProduct(id: string): Promise<Product> {
    return apiClient.patch<Product>(`/admin/products/${id}/reject`);
  },

  async verifySeller(id: string): Promise<SellerProfile> {
    return apiClient.post<SellerProfile>(`/admin/sellers/${id}/verify`);
  },

  async updateUserRoles(userId: string, roles: string[]): Promise<AdminUser> {
    return apiClient.put<AdminUser>(`/admin/users/${userId}/roles`, { roles });
  },

  async listAuditLogs(params?: { page?: number; size?: number }): Promise<PaginatedResponse<AuditLog>> {
    return apiClient.get<PaginatedResponse<AuditLog>>(`/admin/audit-logs${buildQuery(params)}`);
  },
};
