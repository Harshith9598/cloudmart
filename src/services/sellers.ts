import { apiClient } from './client';
import type { SellerProfile, CreateSellerRequest, PaginatedResponse, Product } from '@/types';

export interface SellerListParams {
  page?: number;
  size?: number;
  search?: string;
  verified?: boolean;
}

function buildQuery(params?: SellerListParams): string {
  if (!params) return '';
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== '',
  );
  if (entries.length === 0) return '';
  const search = new URLSearchParams();
  for (const [k, v] of entries) search.append(k, String(v));
  return `?${search.toString()}`;
}

export const sellersService = {
  async list(params?: SellerListParams): Promise<PaginatedResponse<SellerProfile>> {
    return apiClient.get<PaginatedResponse<SellerProfile>>(`/sellers${buildQuery(params)}`);
  },

  async get(idOrSlug: string): Promise<SellerProfile> {
    return apiClient.get<SellerProfile>(`/sellers/${idOrSlug}`);
  },

  async create(req: CreateSellerRequest): Promise<SellerProfile> {
    return apiClient.post<SellerProfile>('/sellers', req);
  },

  async update(req: Partial<CreateSellerRequest>): Promise<SellerProfile> {
    return apiClient.put<SellerProfile>('/sellers/me', req);
  },

  async getMyProducts(params?: { page?: number; size?: number }): Promise<PaginatedResponse<Product>> {
    const query = buildQuery(params as Record<string, unknown> | undefined);
    return apiClient.get<PaginatedResponse<Product>>(`/sellers/me/products${query}`);
  },

  async verify(sellerId: string): Promise<SellerProfile> {
    return apiClient.post<SellerProfile>(`/sellers/${sellerId}/verify`);
  },
};
