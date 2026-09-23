import { apiClient } from './client';
import type { Order, CreateOrderRequest, PaginatedResponse, OrderStatus } from '@/types';

export interface OrderListParams {
  page?: number;
  size?: number;
  status?: OrderStatus;
}

function buildQuery(params?: OrderListParams): string {
  if (!params) return '';
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== '',
  );
  if (entries.length === 0) return '';
  const search = new URLSearchParams();
  for (const [k, v] of entries) search.append(k, String(v));
  return `?${search.toString()}`;
}

export const ordersService = {
  async list(params?: OrderListParams): Promise<PaginatedResponse<Order>> {
    return apiClient.get<PaginatedResponse<Order>>(`/orders${buildQuery(params)}`);
  },

  async get(id: string): Promise<Order> {
    return apiClient.get<Order>(`/orders/${id}`);
  },

  async create(req: CreateOrderRequest): Promise<Order> {
    return apiClient.post<Order>('/orders', req);
  },

  async cancel(id: string): Promise<Order> {
    return apiClient.post<Order>(`/orders/${id}/cancel`);
  },

  async listBySeller(params?: OrderListParams): Promise<PaginatedResponse<Order>> {
    return apiClient.get<PaginatedResponse<Order>>(`/seller/orders${buildQuery(params)}`);
  },
};
