import { useQuery } from '@tanstack/react-query';
import { searchProductsApi } from '../api/productService';
import { searchKeys } from './queryKeys';

const useCategorySearchQuery = (catId, areaId, sortBy, priceMin, priceMax) =>
  useQuery({
    queryKey: searchKeys.categorySearch(catId, areaId, sortBy, priceMin, priceMax),
    queryFn: async () => {
      const payload = {
        pincodeAreaId: areaId,
        prName: '',
        catId: parseInt(catId, 10),
        priceMin,
        priceMax,
        filterValues: null,
        sortBy,
        pageNumber: 1,
        pageSize: 50,
      };
      const response = await searchProductsApi(payload);
      return response;
    },
    select: (response) => (response?.success ? response.data?.items || [] : []),
    enabled: !!catId,
    staleTime: 60 * 1000,
  });

export default useCategorySearchQuery;
