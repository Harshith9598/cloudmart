import { apiClient } from './client';
import type { Cart, AddToCartRequest, UpdateCartItemRequest } from '@/types';

export const cartService = {
  async get(): Promise<Cart> {
    return apiClient.get<Cart>('/cart');
  },

  async addItem(req: AddToCartRequest): Promise<Cart> {
    return apiClient.post<Cart>('/cart/items', req);
  },

  async updateItem(itemId: string, req: UpdateCartItemRequest): Promise<Cart> {
    return apiClient.put<Cart>(`/cart/items/${itemId}`, req);
  },

  async removeItem(itemId: string): Promise<Cart> {
    return apiClient.delete<Cart>(`/cart/items/${itemId}`);
  },

  async clear(): Promise<void> {
    await apiClient.delete<void>('/cart');
  },
};
