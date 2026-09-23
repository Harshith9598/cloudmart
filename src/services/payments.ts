import { apiClient } from './client';
import type { Payment, CreatePaymentRequest } from '@/types';

export const paymentsService = {
  async create(req: CreatePaymentRequest): Promise<Payment> {
    return apiClient.post<Payment>('/payments', req);
  },

  async get(id: string): Promise<Payment> {
    return apiClient.get<Payment>(`/payments/${id}`);
  },

  async getByOrder(orderId: string): Promise<Payment> {
    return apiClient.get<Payment>(`/payments/order/${orderId}`);
  },
};
