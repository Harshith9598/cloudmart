import { apiClient } from './client';
import type {
  Review,
  CreateReviewRequest,
  ReplyReviewRequest,
  PaginatedResponse,
} from '@/types';

export interface ReviewListParams {
  page?: number;
  size?: number;
  rating?: number;
}

function buildQuery(params?: ReviewListParams): string {
  if (!params) return '';
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== '',
  );
  if (entries.length === 0) return '';
  const search = new URLSearchParams();
  for (const [k, v] of entries) search.append(k, String(v));
  return `?${search.toString()}`;
}

export const reviewsService = {
  async listByProduct(productId: string, params?: ReviewListParams): Promise<PaginatedResponse<Review>> {
    return apiClient.get<PaginatedResponse<Review>>(`/products/${productId}/reviews${buildQuery(params)}`);
  },

  async create(req: CreateReviewRequest): Promise<Review> {
    return apiClient.post<Review>('/reviews', req);
  },

  async reply(reviewId: string, req: ReplyReviewRequest): Promise<Review> {
    return apiClient.post<Review>(`/reviews/${reviewId}/reply`, req);
  },

  async delete(reviewId: string): Promise<void> {
    await apiClient.delete<void>(`/reviews/${reviewId}`);
  },
};
