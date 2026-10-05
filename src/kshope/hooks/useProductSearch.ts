import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { searchProductsApi } from '../api/services/productService';
import { useDebounce } from './useDebounce';
import { useKshopeAreaId } from './useKshopeAreaId';
import KSHOPE_CONFIG from '../globals/config';

const searchCache = new Map<string, { items: any[]; totalCount: number; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MIN_SEARCH_LENGTH = 3; // 3+ chars prevents heavy database unindexed full scans

const extractItems = (response: any): any[] => {
  if (!response) return [];
  const rawData = response?.data ?? response?.Data ?? response;
  if (Array.isArray(rawData)) return rawData;
  if (Array.isArray(rawData?.items)) return rawData.items;
  if (Array.isArray(rawData?.Items)) return rawData.Items;
  if (Array.isArray(response?.items)) return response.items;
  return [];
};

const getItemPrice = (item: any): number => {
  const raw = item?.sellingPrice ?? item?.price ?? item?.finalPrice ?? item?.salePrice ?? item?.mrp ?? 0;
  const num = Number(raw);
  return isNaN(num) ? 0 : num;
};

const useProductSearch = (
  initialPincodeId: any,
  initialCatId: any = null,
  filters: any = {},
  initialAttrValueId: any = null,
  initialSearchTerm: string = '',
  initialProductId: any = null
) => {
  const { areaId } = useKshopeAreaId();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [catId, setCatId] = useState(initialCatId);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 16;
  const [resultCount, setResultCount] = useState(0);

  const activePincodeId = initialPincodeId || areaId || KSHOPE_CONFIG.default_pincode_area_id;
  const [error, setError] = useState<any>(null);
  const latestRequestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastExecutedKeyRef = useRef<string>('');

  const sortBy = filters.sortBy || 'relevance';
  const priceMin = filters.priceMin ?? null;
  const priceMax = filters.priceMax ?? null;

  // 350ms debounce: prevents request flooding per keystroke while staying responsive
  const debouncedSearchTerm = useDebounce(searchTerm, 350);

  useEffect(() => {
    setCatId(initialCatId);
  }, [initialCatId]);

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  // When search term is cleared, immediately clear suggestions (no wait)
  useEffect(() => {
    if (searchTerm.trim().length === 0 && !catId && !initialAttrValueId && !initialProductId) {
      abortControllerRef.current?.abort();
      lastExecutedKeyRef.current = '';
      setSuggestions([]);
      setResultCount(0);
      setLoading(false);
      setHasMore(false);
    }
  }, [searchTerm, catId, initialAttrValueId, initialProductId]);

  const fetchProducts = useCallback(
    async (page = 1, overrideTerm?: string) => {
      const currentTerm = (overrideTerm !== undefined ? overrideTerm : debouncedSearchTerm).trim();
      const isSearchingText = currentTerm.length > 0;
      const parsedCatId = catId && !isNaN(Number(catId)) ? parseInt(catId, 10) : null;

      // If user is typing text but hasn't reached MIN_SEARCH_LENGTH, don't fire expensive search
      if (isSearchingText && currentTerm.length < MIN_SEARCH_LENGTH) {
        return;
      }

      // Empty search with no category/filter -> clear and exit
      if (!isSearchingText && !parsedCatId && !initialAttrValueId && !initialProductId) {
        abortControllerRef.current?.abort();
        lastExecutedKeyRef.current = '';
        setSuggestions([]);
        setResultCount(0);
        setLoading(false);
        setHasMore(false);
        return;
      }

      const termKey = isSearchingText ? currentTerm.toLowerCase() : '';
      const catKey = isSearchingText ? '' : (parsedCatId ?? '');
      const prodKey = isSearchingText ? '' : (initialProductId ?? '');
      const attrKey = isSearchingText ? '' : (initialAttrValueId ?? '');
      const execKey = `${termKey}_${catKey}_${prodKey}_${attrKey}_${activePincodeId}_${sortBy}_${priceMin}_${priceMax}_${page}`;

      // Deduplicate request: avoid re-fetching if exact query was already dispatched (e.g. submit + debounced trigger)
      if (execKey === lastExecutedKeyRef.current) {
        return;
      }
      lastExecutedKeyRef.current = execKey;

      // Cache key
      const cacheKey = execKey;

      // Instant 0ms cache hit for page 1
      if (page === 1) {
        const cached = searchCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
          setSuggestions(cached.items);
          setResultCount(cached.totalCount);
          setLoading(false);
          setHasMore(cached.items.length >= pageSize);
          setPageNumber(1);
          return;
        }
      }

      // Abort previous in-flight request to free connection bandwidth
      abortControllerRef.current?.abort();
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const currentRequestId = ++latestRequestIdRef.current;

      if (page === 1) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      try {
        const payload: any = {
          pincodeAreaId: activePincodeId,
          pageNumber: page,
          pageSize,
          sortBy,
        };
        if (priceMin != null) payload.priceMin = priceMin;
        if (priceMax != null) payload.priceMax = priceMax;

        if (isSearchingText) {
          payload.prName = currentTerm;
        } else {
          if (parsedCatId) payload.catId = parsedCatId;
          if (initialProductId) payload.productId = initialProductId;
          if (initialAttrValueId) {
            payload.attrValueId = initialAttrValueId;
            payload.filterValues = String(initialAttrValueId);
          }
        }

        const response = await searchProductsApi(payload, abortController.signal);

        // If request was aborted or overtaken by a newer request, drop result
        if (abortController.signal.aborted || latestRequestIdRef.current !== currentRequestId) {
          return;
        }

        if (!response) {
          setLoading(false);
          setIsLoadingMore(false);
          return;
        }

        const newItems = extractItems(response);
        const total = response?.data?.totalCount ?? response?.totalCount ?? response?.data?.total ?? newItems.length;

        searchCache.set(cacheKey, {
          items: newItems,
          totalCount: total,
          timestamp: Date.now(),
        });

        if (page === 1) {
          setSuggestions(newItems);
          setResultCount(total);
        } else {
          setSuggestions(prev => [...prev, ...newItems]);
        }
        setHasMore(newItems.length >= pageSize);
        setPageNumber(page);
      } catch (err: any) {
        if (!abortController.signal.aborted && latestRequestIdRef.current === currentRequestId) {
          setError(err);
          if (page === 1) {
            setSuggestions([]);
            setResultCount(0);
          }
        }
      } finally {
        if (!abortController.signal.aborted && latestRequestIdRef.current === currentRequestId) {
          setLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [
      debouncedSearchTerm,
      catId,
      initialAttrValueId,
      initialProductId,
      activePincodeId,
      sortBy,
      priceMin,
      priceMax,
    ]
  );

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  // Immediate search trigger (bypasses debounce, used on keyboard submit or chip click)
  const submitSearch = useCallback(
    (term?: string) => {
      const targetTerm = (typeof term === 'string' ? term : searchTerm).trim();
      if (targetTerm.length >= MIN_SEARCH_LENGTH) {
        fetchProducts(1, targetTerm);
      }
    },
    [searchTerm, fetchProducts]
  );

  const loadMore = useCallback(() => {
    if (!loading && !isLoadingMore && hasMore) {
      fetchProducts(pageNumber + 1);
    }
  }, [loading, isLoadingMore, hasMore, pageNumber, fetchProducts]);

  const sortedSuggestions = useMemo(() => {
    if (sortBy === 'relevance' || suggestions.length <= 1) return suggestions;

    const sorted = [...suggestions];
    switch (sortBy) {
      case 'lowToHigh':
        return sorted.sort((a, b) => getItemPrice(a) - getItemPrice(b));
      case 'highToLow':
        return sorted.sort((a, b) => getItemPrice(b) - getItemPrice(a));
      case 'a-z':
        return sorted.sort((a, b) =>
          (a.productName || a.name || '').localeCompare(b.productName || b.name || '')
        );
      case 'z-a':
        return sorted.sort((a, b) =>
          (b.productName || b.name || '').localeCompare(a.productName || a.name || '')
        );
      default:
        return sorted;
    }
  }, [suggestions, sortBy]);

  const clearSearch = useCallback(() => {
    abortControllerRef.current?.abort();
    lastExecutedKeyRef.current = '';
    setSearchTerm('');
    setCatId(null);
    setSuggestions([]);
    setResultCount(0);
    setPageNumber(1);
    setHasMore(true);
  }, []);

  const isAwaitingDebounce =
    searchTerm.trim().length >= MIN_SEARCH_LENGTH &&
    searchTerm.trim().toLowerCase() !== debouncedSearchTerm.trim().toLowerCase() &&
    !lastExecutedKeyRef.current.startsWith(searchTerm.trim().toLowerCase());
  const isSearching = loading || isAwaitingDebounce;

  return {
    searchTerm,
    setSearchTerm,
    submitSearch,
    catId,
    setCatId,
    suggestions: sortedSuggestions,
    loading,
    isSearching,
    isLoadingMore,
    hasMore,
    loadMore,
    resultCount,
    error,
    isGlobalFallback: false,
    clearSearch,
  };
};

export default useProductSearch;
