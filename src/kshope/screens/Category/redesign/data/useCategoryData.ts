import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getCategoriesApi } from '../../../../api/services/categoryService';
import { searchProductsApi } from '../../../../api/services/productService';
import { getKshopeAreaId } from '../../../../globals/storage';
import { useDebounce } from '../../../../hooks/useDebounce';
import {
  DEFAULT_CATEGORY_FILTERS,
  isDefaultCategoryFilters,
} from '../../constants';
import {
  ALL_TILE_ID,
  bannerSource,
  findCategory,
  toCategoryTiles,
  toProductCards,
  toSubCategoryTiles,
} from './selectors';

const ROOT_PARENT_ID = '1';
const PAGE_SIZE = 20;

const categoryCache = new Map<string, { items: any[]; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const clearCategoryCache = () => categoryCache.clear();

const extractItems = (response: any): any[] => {
  if (!response) return [];
  const rawData = response?.data ?? response?.Data ?? response;
  if (Array.isArray(rawData)) return rawData;
  if (Array.isArray(rawData?.items)) return rawData.items;
  if (Array.isArray(rawData?.Items)) return rawData.Items;
  return [];
};

export type Filters = {
  sortBy: string;
  priceMin: number;
  priceMax: number;
};

export const useCategoryData = (initialCatId?: string | number) => {
  // Pure backend data only - starts empty, no dummy categories
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialCatId ? String(initialCatId) : null,
  );
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    string | null
  >(null);

  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [pincodeAreaId, setPincodeAreaId] = useState<number | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_CATEGORY_FILTERS);

  // Fast 200ms debounce
  const debouncedSearchText = useDebounce(searchText, 200);
  const areaIdRef = useRef<number | null>(null);
  const latestReqIdRef = useRef<number>(0);

  // Fetch live categories directly from backend (no dummy fallbacks)
  const fetchCategories = useCallback(async () => {
    try {
      setIsCategoriesLoading(true);
      const response = await getCategoriesApi(ROOT_PARENT_ID);
      let items = extractItems(response);

      // If parentCatId '1' yielded no items, attempt '0' for backends using 0 as root
      if (items.length === 0) {
        try {
          const altResponse = await getCategoriesApi('0');
          const altItems = extractItems(altResponse);
          if (altItems.length > 0) {
            items = altItems;
          }
        } catch {
          // ignore fallback attempt error
        }
      }

      if (items && items.length > 0) {
        setCategories(items);
        setSelectedCategoryId(prev => {
          if (initialCatId) return String(initialCatId);
          // Keep current category if it matches any real category in fetched items
          if (
            prev &&
            items.some(
              c =>
                String(c.catId || c.id || c.categoryId) === String(prev),
            )
          ) {
            return prev;
          }
          const firstCatId =
            items[0]?.catId ?? items[0]?.id ?? items[0]?.categoryId;
          return firstCatId !== undefined && firstCatId !== null
            ? String(firstCatId)
            : null;
        });
      } else {
        setCategories([]);
        setSelectedCategoryId(null);
      }
    } catch (error) {
      console.error('Error fetching categories from backend:', error);
      setCategories([]);
      setSelectedCategoryId(null);
    } finally {
      setIsCategoriesLoading(false);
    }
  }, [initialCatId]);

  // Subcategories fetched strictly from backend
  const fetchSubCategories = useCallback(
    async (parentId: string) => {
      if (!parentId) {
        setSubCategories([]);
        setSelectedSubCategoryId(null);
        return;
      }
      try {
        const response = await getCategoriesApi(parentId);
        const items = extractItems(response);
        setSubCategories(items);
      } catch (error) {
        console.error('Error fetching subcategories from backend:', error);
        setSubCategories([]);
      }
    },
    [],
  );

  // Fetch products from backend searchProductsApi
  const fetchProducts = useCallback(
    async (categoryId: string | null, page = 1) => {
      const parsedCatId = categoryId ? parseInt(categoryId, 10) : NaN;
      const targetCatId = !isNaN(parsedCatId) ? parsedCatId : null;
      const queryTerm = debouncedSearchText.trim();
      const isFirstPage = page === 1;

      const cacheKey = `${targetCatId}_${queryTerm}_${filters.sortBy}_${filters.priceMin}_${filters.priceMax}_${areaIdRef.current}_${page}`;

      // Instant cache return for page 1
      if (isFirstPage && process.env.NODE_ENV !== 'test') {
        const cached = categoryCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
          setProducts(cached.items);
          setLoading(false);
          setPageNumber(1);
          setHasMore(cached.items.length === PAGE_SIZE);
          return;
        }
      }

      const reqId = ++latestReqIdRef.current;

      try {
        if (isFirstPage) {
          setLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const response = await searchProductsApi({
          pincodeAreaId: areaIdRef.current,
          prName: queryTerm ?? '',
          catId: targetCatId,
          priceMin: filters.priceMin,
          priceMax: filters.priceMax,
          filterValues: null,
          sortBy: filters.sortBy,
          pageNumber: page,
          pageSize: PAGE_SIZE,
        });

        if (latestReqIdRef.current !== reqId) return;

        const items = extractItems(response);
        if (items && items.length > 0) {
          categoryCache.set(cacheKey, { items, timestamp: Date.now() });
          setProducts(prev => (page === 1 ? items : [...prev, ...items]));
          setPageNumber(page);
          setHasMore(items.length === PAGE_SIZE);
        } else {
          categoryCache.set(cacheKey, { items: [], timestamp: Date.now() });
          if (page === 1) {
            setProducts([]);
          }
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching products from backend:', error);
        if (page === 1) {
          setProducts([]);
        }
      } finally {
        if (isFirstPage) {
          setLoading(false);
        }
        setIsLoadingMore(false);
      }
    },
    [debouncedSearchText, filters],
  );

  // Parallel initial boot: load area ID and categories concurrently
  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      try {
        const [storedAreaId] = await Promise.all([
          getKshopeAreaId().catch(() => null),
          fetchCategories(),
        ]);
        if (!cancelled) {
          areaIdRef.current = storedAreaId;
          setPincodeAreaId(storedAreaId);
        }
      } catch (error) {
        console.error('Error in category boot:', error);
      }
    };
    boot();
    return () => {
      cancelled = true;
    };
  }, [fetchCategories]);

  // Sync subcategories strictly when category changes
  useEffect(() => {
    if (selectedCategoryId) {
      fetchSubCategories(selectedCategoryId);
    } else {
      setSubCategories([]);
      setSelectedSubCategoryId(null);
    }
  }, [selectedCategoryId, fetchSubCategories]);

  // Query products on category selection, search, or filter changes
  useEffect(() => {
    const target = selectedSubCategoryId || selectedCategoryId;
    if (target) {
      fetchProducts(target, 1);
    } else if (!isCategoriesLoading && categories.length === 0) {
      // If backend has no categories, set products to empty and finish loading
      setProducts([]);
      setLoading(false);
    }
  }, [
    selectedSubCategoryId,
    selectedCategoryId,
    debouncedSearchText,
    filters,
    pincodeAreaId,
    isCategoriesLoading,
    categories.length,
    fetchProducts,
  ]);

  const loadMore = useCallback(() => {
    const target = selectedSubCategoryId || selectedCategoryId;
    if (!isLoadingMore && hasMore && target && !loading) {
      fetchProducts(target, pageNumber + 1);
    }
  }, [
    fetchProducts,
    hasMore,
    isLoadingMore,
    loading,
    pageNumber,
    selectedCategoryId,
    selectedSubCategoryId,
  ]);

  const selectSubCategory = useCallback((id: string) => {
    setSelectedSubCategoryId(id === ALL_TILE_ID ? null : id);
  }, []);

  const selectCategory = useCallback((id: string) => {
    setSearchText('');
    setSelectedCategoryId(id);
    setSelectedSubCategoryId(null);
  }, []);

  const clearSearch = useCallback(() => setSearchText(''), []);

  const activeCategory = useMemo(
    () => findCategory(categories, selectedCategoryId),
    [categories, selectedCategoryId],
  );

  return {
    isCategoriesLoading,
    loading,
    isLoadingMore,
    categoryTiles: useMemo(() => toCategoryTiles(categories), [categories]),
    subCategoryTiles: useMemo(
      () => toSubCategoryTiles(subCategories, activeCategory),
      [subCategories, activeCategory],
    ),
    productCards: useMemo(() => toProductCards(products), [products]),
    activeCategory,
    categoryName: activeCategory?.catName ?? activeCategory?.name ?? '',
    banner: bannerSource(activeCategory),
    selectedCategoryId,
    setSelectedCategoryId: selectCategory,
    selectedSubCategoryId,
    selectSubCategory,
    searchText,
    setSearchText,
    clearSearch,
    activeSearchTerm: debouncedSearchText.trim(),
    resultCount: products.length,
    filters,
    setFilters,
    filtersActive: !isDefaultCategoryFilters(filters),
    loadMore,
  };
};
