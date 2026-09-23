import { apiClient } from './client';
import type {
  Product,
  PaginatedResponse,
  ProductListParams,
  CreateProductRequest,
  UpdateProductRequest,
} from '@/types';

function buildQuery(params?: ProductListParams): string {
  if (!params) return '';
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== '',
  );
  if (entries.length === 0) return '';
  const search = new URLSearchParams();
  for (const [k, v] of entries) search.append(k, String(v));
  return `?${search.toString()}`;
}

export const productsService = {
  async list(params?: ProductListParams): Promise<PaginatedResponse<Product>> {
    return apiClient.get<PaginatedResponse<Product>>(`/products${buildQuery(params)}`);
  },

  async get(idOrSlug: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${idOrSlug}`);
  },

  async create(req: CreateProductRequest): Promise<Product> {
    return apiClient.post<Product>('/products', req);
  },

  async update(id: string, req: UpdateProductRequest): Promise<Product> {
    return apiClient.put<Product>(`/products/${id}`, req);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete<void>(`/products/${id}`);
  },

  async getFeatured(): Promise<Product[]> {
    return apiClient.get<Product[]>('/products/featured');
  },

  async getByCategory(categoryId: string, params?: Omit<ProductListParams, 'categoryId'>): Promise<PaginatedResponse<Product>> {
    return apiClient.get<PaginatedResponse<Product>>(`/products${buildQuery({ ...params, categoryId })}`);
  },

  async getBySeller(sellerId: string, params?: Omit<ProductListParams, 'sellerId'>): Promise<PaginatedResponse<Product>> {
    return apiClient.get<PaginatedResponse<Product>>(`/products${buildQuery({ ...params, sellerId })}`);
  },

  async search(query: string, params?: Omit<ProductListParams, 'search'>): Promise<PaginatedResponse<Product>> {
    return apiClient.get<PaginatedResponse<Product>>(`/products${buildQuery({ ...params, search: query })}`);
  },
};
