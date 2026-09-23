import { apiClient } from './client';
import type { Category, CreateCategoryRequest } from '@/types';

export const categoriesService = {
  async list(): Promise<Category[]> {
    return apiClient.get<Category[]>('/categories');
  },

  async get(idOrSlug: string): Promise<Category> {
    return apiClient.get<Category>(`/categories/${idOrSlug}`);
  },

  async create(req: CreateCategoryRequest): Promise<Category> {
    return apiClient.post<Category>('/categories', req);
  },

  async update(id: string, req: Partial<CreateCategoryRequest>): Promise<Category> {
    return apiClient.put<Category>(`/categories/${id}`, req);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete<void>(`/categories/${id}`);
  },

  async tree(): Promise<Category[]> {
    return apiClient.get<Category[]>('/categories/tree');
  },
};
