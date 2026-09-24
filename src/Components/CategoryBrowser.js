'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { notFound } from 'next/navigation';
import { toast } from 'react-toastify';
import API from '../api';
import { useNavigate, useSearchParams } from '../router-compat';
import { getImageUrl } from '../utils/imageUrl';
import { trackClick } from '../services/categoryAnalytics';
import Breadcrumbs from './Breadcrumbs';
import CategoryCard from './CategoryCard';
import ProductCard from './ProductCard';
import ProductFilter from './ProductFilter';
import SearchBarN from './SearchBarN';
import LoadingPage from './LoadingPage';

const itemsPerPage = 20;

const filtersFromSearchParams = (searchParams) => ({
  priceRange: [],
  brands: searchParams.get('brands') ? searchParams.get('brands').split(',') : [],
  inStockOnly: searchParams.get('inStock') === 'true',
  sortBy: searchParams.get('sort') || 'default',
  minPrice: searchParams.get('minPrice') || '',
  maxPrice: searchParams.get('maxPrice') || '',
});

const CategoryBrowser = ({ slugPath }) => {
  const navigate = useNavigate();
  const searchParams = useSearchParams();

  const [resolved, setResolved] = useState(null);
  const [notFoundFlag, setNotFoundFlag] = useState(false);
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [filters, setFilters] = useState(() => filtersFromSearchParams(searchParams));

  const page = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    let cancelled = false;
    const fetchResolved = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/categories/resolve?path=${encodeURIComponent(slugPath)}`);
        if (!cancelled) setResolved(res.data);
      } catch (error) {
        if (!cancelled) {
          if (error.response?.status === 404) {
            setNotFoundFlag(true);
          } else {
            toast.error('Failed to load category');
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchResolved();
    return () => { cancelled = true; };
  }, [slugPath]);

  useEffect(() => {
    if (notFoundFlag) notFound();
  }, [notFoundFlag]);

  const buildChildPath = (childSlug) => `/category${slugPath ? `/${slugPath}` : ''}/${childSlug}`;

  const trail = useMemo(() => {
    if (!resolved) return [];
    const ancestors = (resolved.ancestors || []).map(a => ({ name: a.name, slug: a.slug }));
    if (resolved.category) ancestors.push({ name: resolved.category.name, slug: resolved.category.slug });
    return ancestors;
  }, [resolved]);

  const isLeaf = resolved?.isLeaf;
  const categoryId = resolved?.category?.category_id;

  // Product fetch only happens once we know we're at a leaf category.
  useEffect(() => {
    if (!isLeaf || !categoryId) return;
    let cancelled = false;

    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('categoryId', categoryId);
        params.set('page', page);
        params.set('limit', itemsPerPage);
        if (filters.sortBy && filters.sortBy !== 'default') params.set('sort', filters.sortBy);
        if (filters.minPrice) params.set('minPrice', filters.minPrice);
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
        if (filters.brands?.length) params.set('brands', filters.brands.join(','));
        if (filters.inStockOnly) params.set('inStock', 'true');

        const res = await API.get(`/products?${params.toString()}`);
        if (cancelled) return;
        setProducts(res.data?.products || []);
        setPagination({
          total: res.data?.total || 0,
          page: res.data?.page || 1,
          totalPages: res.data?.totalPages || 1,
        });
      } catch (error) {
        if (!cancelled) toast.error('Failed to load products');
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    };
    fetchProducts();
    return () => { cancelled = true; };
  }, [isLeaf, categoryId, page, filters]);

  const updateQuery = (nextParams) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(nextParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    const query = params.toString();
    navigate(`/category/${slugPath}${query ? `?${query}` : ''}`, { replace: true });
  };

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
    updateQuery({
      sort: nextFilters.sortBy && nextFilters.sortBy !== 'default' ? nextFilters.sortBy : undefined,
      minPrice: nextFilters.minPrice || undefined,
      maxPrice: nextFilters.maxPrice || undefined,
      brands: nextFilters.brands?.length ? nextFilters.brands.join(',') : undefined,
      inStock: nextFilters.inStockOnly ? 'true' : undefined,
      page: undefined,
    });
  };

  const goToPage = (nextPage) => {
    updateQuery({ page: nextPage === 1 ? undefined : nextPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <LoadingPage />;
  if (notFoundFlag) return null;

  const currentCategory = resolved?.category;

  return (
    <div className="bg-gray-50 min-h-screen">
      <SearchBarN />
      <Breadcrumbs trail={trail} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          {currentCategory?.name || 'Categories'}
        </h1>
        {currentCategory?.description && (
          <p className="text-gray-500 mb-6 max-w-2xl">{currentCategory.description}</p>
        )}

        {!isLeaf ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
            {(resolved?.children || []).map((child) => (
              <CategoryCard
                key={child.category_id}
                cat={child}
                onClick={() => {
                  trackClick(child.category_id);
                  navigate(buildChildPath(child.slug));
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            <div className="w-full md:w-64 lg:w-72 shrink-0">
              <ProductFilter onFilterChange={handleFilterChange} initialFilters={filters} />
            </div>

            <main className="flex-1 flex flex-col">
              <p className="text-sm text-gray-500 mb-6">
                Showing {pagination.total} {pagination.total === 1 ? 'product' : 'products'}
              </p>

              {productsLoading ? (
                <LoadingPage />
              ) : products.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center sm:justify-items-stretch">
                    {products.map((product) => (
                      <div key={product.product_id} className="w-full flex justify-center">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>

                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                      {Array.from({ length: pagination.totalPages }, (_, index) => (
                        <button
                          key={index}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                            pagination.page === index + 1
                              ? 'bg-[#CC0100] text-white shadow-md hover:bg-[#b30000]'
                              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                          }`}
                          onClick={() => goToPage(index + 1)}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryBrowser;
