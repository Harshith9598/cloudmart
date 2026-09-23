import { useState, useMemo, useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { mockProducts, mockCategories } from '@/services/mock-data';
import type { ProductListParams } from '@/types';
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductsPageProps {
  query: Record<string, string>;
}

export function ProductsPage({ query }: ProductsPageProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState<ProductListParams['sort']>('newest');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(query.categoryId);
  const [search, setSearch] = useState<string | undefined>(query.search);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(query.featured === 'true');
  const [page, setPage] = useState(0);
  const pageSize = 12;

  useEffect(() => {
    setSelectedCategory(query.categoryId);
    setSearch(query.search);
    setFeaturedOnly(query.featured === 'true');
    setPage(0);
  }, [query.categoryId, query.search, query.featured]);

  const filtered = useMemo(() => {
    let result = [...mockProducts];

    if (selectedCategory) {
      const category = mockCategories.find((c) => c.id === selectedCategory);
      const childIds = category?.children?.map((c) => c.id) ?? [];
      const allIds = [selectedCategory, ...childIds];
      result = result.filter((p) => allIds.includes(p.categoryId));
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.sellerName.toLowerCase().includes(q),
      );
    }
    if (minPrice) result = result.filter((p) => p.price >= parseFloat(minPrice));
    if (maxPrice) result = result.filter((p) => p.price <= parseFloat(maxPrice));
    if (featuredOnly) result = result.filter((p) => p.featured);

    switch (sort) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [selectedCategory, search, minPrice, maxPrice, featuredOnly, sort]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const activeCategory = mockCategories.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {activeCategory ? activeCategory.name : search ? `Results for "${search}"` : 'All Products'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">{filtered.length} products found</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside
            className={cn(
              'fixed inset-y-0 left-0 z-50 w-80 transform overflow-y-auto bg-white p-6 shadow-xl transition-transform lg:static lg:z-auto lg:w-64 lg:translate-x-0 lg:shadow-none',
              filtersOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
            )}
          >
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setFiltersOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-900">Categories</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => { setSelectedCategory(undefined); setPage(0); }}
                    className={cn(
                      'block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50',
                      !selectedCategory && 'bg-sky-50 font-medium text-sky-700',
                    )}
                  >
                    All Categories
                  </button>
                  {mockCategories.map((cat) => (
                    <div key={cat.id}>
                      <button
                        onClick={() => { setSelectedCategory(cat.id); setPage(0); }}
                        className={cn(
                          'block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50',
                          selectedCategory === cat.id && 'bg-sky-50 font-medium text-sky-700',
                        )}
                      >
                        {cat.name}
                      </button>
                      {cat.children && (
                        <div className="ml-3 border-l border-gray-100 pl-2">
                          {cat.children.map((child) => (
                            <button
                              key={child.id}
                              onClick={() => { setSelectedCategory(child.id); setPage(0); }}
                              className={cn(
                                'block w-full rounded-lg px-3 py-1.5 text-left text-xs text-gray-600 hover:bg-gray-50',
                                selectedCategory === child.id && 'bg-sky-50 font-medium text-sky-700',
                              )}
                            >
                              {child.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-900">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); setPage(0); }}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); setPage(0); }}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              {/* Featured */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-900">Filter</h3>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={featuredOnly}
                    onChange={(e) => { setFeaturedOnly(e.target.checked); setPage(0); }}
                    className="rounded border-gray-300 text-sky-500 focus:ring-sky-400"
                  />
                  Featured only
                </label>
              </div>

              {/* Clear */}
              <button
                onClick={() => {
                  setSelectedCategory(undefined);
                  setSearch(undefined);
                  setMinPrice('');
                  setMaxPrice('');
                  setFeaturedOnly(false);
                  setPage(0);
                }}
                className="w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3">
              <button
                onClick={() => setFiltersOpen(true)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 lg:hidden"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as ProductListParams['sort'])}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Products grid */}
            {paged.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paged.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-20">
                <p className="text-lg font-medium text-gray-900">No products found</p>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your filters</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={cn(
                      'h-10 w-10 rounded-lg text-sm font-medium',
                      page === i
                        ? 'bg-sky-500 text-white'
                        : 'border border-gray-200 text-gray-700 hover:bg-gray-50',
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page === totalPages - 1}
                  className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
