import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useUser } from '../../../../context/UserContext';
import { useCart } from '../../../../context/CartContext';
import { getHomepageData } from '../../../../api/services/homeService';
import { getKshopeAreaId } from '../../../../globals/storage';
import type { HeaderItem } from '../../../../components/HomeHeader';
import {
  BEST_SELLING,
  BRANDS,
  CATEGORY_CARDS,
  CATEGORY_CHIPS,
  CATEGORY_TABS,
  FEATURED_PRODUCTS,
  HEADER_CIRCLES,
  HEADER_CONTENT,
  RECOMMENDED,
} from '../content';
import type { Tile } from '../content';
import {
  bannersFor,
  blockTitle,
  getProducts,
  resolveCatId,
  resolveCatName,
  sectionTitle,
  splitTitle,
  unwrapBlock,
} from './blocks';
import {
  mapBrandTile,
  mapCategoryTile,
  mapExploreTile,
  mapOccasionTile,
  mapProductTile,
  bannerProductId,
  mapGoatDealCard,
  mapRecCard,
  mapTabChip,
  orFallback,
  resolveImageSource,
} from './mappers';

const HEADER_PLACEHOLDERS = [
  require('../../../../assets/images/home/items/gshock.png'),
  require('../../../../assets/images/home/items/shoes.png'),
  require('../../../../assets/images/home/items/watch.png'),
  require('../../../../assets/images/home/items/shoes_02.png'),
];

const FALLBACK_HEADER_ITEMS: HeaderItem[] = HEADER_CIRCLES.map(tile => ({
  id: tile.id,
  name: tile.label,
  image: tile.image,
  raw: tile.raw,
}));

export const useHomeData = () => {
  const { profile } = useUser();
  const { fetchAddresses, selectedAddress: activeAddress } = useCart();

  const [homeData, setHomeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(
    async (isRefresh = false) => {
      try {
        if (!isRefresh) {
          setLoading(true);
        }
        const storedAreaId = await getKshopeAreaId();
        const areaId = storedAreaId ?? profile?.pincode ?? null;
        const data = await getHomepageData(areaId, 100);
        const payload = data?.data || data;
        setHomeData(payload);
      } catch (e) {
        console.error('Error fetching home data for K-shope', e);
      } finally {
        setLoading(false);
      }
    },
    [profile?.pincode],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      fetchAddresses?.();
    }
  }, [isFocused, fetchAddresses]);

  const selectedAddress = useMemo(() => {
    if (!activeAddress) return null;
    const label = [activeAddress.type, activeAddress.address].filter(Boolean).join(' · ');
    return label || null;
  }, [activeAddress]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData(true);
    setRefreshing(false);
  }, [fetchData]);

  const sections = useMemo(() => {
    const categories =
      homeData?.featuredCategories || homeData?.FeaturedCategories || [];

    const firstBlock = unwrapBlock(
      homeData?.firstProductBlock ||
        homeData?.FirstProductBlock ||
        homeData?.firstproductblock,
    );
    const firstProducts = getProducts(firstBlock);
    let secondBlock = unwrapBlock(
      homeData?.secondProductBlock ||
        homeData?.SecondProductBlock ||
        homeData?.secondproductblock ||
        homeData?.trendingProducts ||
        homeData?.TrendingProducts ||
        homeData?.trendingNow ||
        homeData?.TrendingNow ||
        homeData?.bestOffers ||
        homeData?.BestOffers,
    );
    let secondProducts = getProducts(secondBlock);

    if (secondProducts.length === 0) {
      const candidates = [
        homeData?.secondProductBlock,
        homeData?.SecondProductBlock,
        homeData?.trendingProducts,
        homeData?.TrendingProducts,
        homeData?.trendingNow,
        homeData?.TrendingNow,
        homeData?.bestOffers,
        homeData?.BestOffers,
        homeData?.featuredProducts,
        homeData?.FeaturedProducts,
        homeData?.halfPriceStore,
        homeData?.HalfPriceStore,
        homeData?.categoryDiscovery?.products,
        homeData?.categoryDiscovery?.Products,
        homeData?.categoryDiscovery?.items,
        homeData?.categoryDiscovery?.Items,
        homeData?.categoryDiscovery,
        homeData?.products,
        homeData?.Products,
        homeData?.thirdProductBlock,
        homeData?.ThirdProductBlock,
        homeData?.fourthProductBlock,
        homeData?.FourthProductBlock,
      ];
      for (const candidate of candidates) {
        if (!candidate) continue;
        const unwrapped = unwrapBlock(candidate);
        const prods = getProducts(unwrapped);
        if (prods && prods.length > 0) {
          secondProducts = prods;
          secondBlock = unwrapped;
          break;
        }
      }
    }

    let thirdBlock = unwrapBlock(
      homeData?.thirdProductBlock ||
        homeData?.ThirdProductBlock ||
        homeData?.thirdproductblock,
    );


    const rawBrands =
      homeData?.brands?.length > 0
        ? homeData.brands
        : homeData?.topBrands?.length > 0
        ? homeData.topBrands
        : bannersFor(homeData, 'app_top_brands');

    let tabShowcase = unwrapBlock(
      homeData?.categoryTabShowcase ||
        homeData?.CategoryTabShowcase ||
        homeData?.categorytabshowcase,
    );
    if (tabShowcase && !Array.isArray(tabShowcase)) {
      tabShowcase = unwrapBlock(
        tabShowcase.categoryTabShowcase ||
          tabShowcase.CategoryTabShowcase ||
          tabShowcase.data ||
          tabShowcase.items ||
          tabShowcase.Items ||
          tabShowcase,
      );
    }
    const tabs = Array.isArray(tabShowcase) ? tabShowcase : [];

    const categoryById = new Map<string, any>();
    categories.forEach((cat: any) => {
      const id = resolveCatId(cat);
      if (id !== undefined && id !== null && id !== '') {
        categoryById.set(String(id), cat);
      }
    });
    const svgCategories = (() => {
      const svgOf = (item: any) =>
        item?.svgurl || item?.svgUrl || item?.SvgUrl || item?.SvgURL;
      const hasSvg = (list: any) =>
        Array.isArray(list) && list.some((item: any) => svgOf(item));
      const named =
        homeData?.categorySvgs ||
        homeData?.CategorySvgs ||
        homeData?.categorySvg ||
        homeData?.svgCategories ||
        homeData?.categoryIcons;
      if (hasSvg(named)) return named as any[];

      const seen = new Set<any>();
      const search = (node: any, depth: number): any[] | null => {
        if (!node || typeof node !== 'object' || depth > 4 || seen.has(node)) {
          return null;
        }
        seen.add(node);
        if (hasSvg(node)) return node as any[];
        for (const value of Object.values(node)) {
          const found = search(value, depth + 1);
          if (found) return found;
        }
        return null;
      };
      return search(homeData, 0) ?? [];
    })();
    const exploreTiles = svgCategories
      .filter((cat: any) => cat?.svgurl || cat?.svgUrl || cat?.SvgUrl || cat?.SvgURL)
      .slice(0, 10)
      .map((cat: any, index: number) => {
        const tile = mapExploreTile(cat, index);
        const linked = categoryById.get(String(resolveCatId(cat) ?? ''));
        return linked ? { ...tile, raw: { ...linked, ...cat } } : tile;
      });

    const goatDeals = bannersFor(homeData, 'app_home_cat_top_sidebyside_four');
    let thirdProducts = getProducts(thirdBlock);

    // If thirdProductBlock has no products, check any other available product blocks/arrays in the API
    if (thirdProducts.length === 0) {
      const candidates = [
        homeData?.featuredProducts,
        homeData?.FeaturedProducts,
        homeData?.fourthProductBlock,
        homeData?.FourthProductBlock,
        homeData?.fourthproductblock,
        homeData?.categoryDiscovery?.products,
        homeData?.categoryDiscovery?.Products,
        homeData?.bestOffers,
        homeData?.BestOffers,
        homeData?.halfPriceStore,
        homeData?.HalfPriceStore,
        homeData?.products,
        homeData?.Products,
      ];
      for (const candidate of candidates) {
        const unwrapped = unwrapBlock(candidate);
        const prods = getProducts(unwrapped);
        if (prods && prods.length > 0) {
          thirdProducts = prods;
          break;
        }
      }
    }

    const productIndex = new Map<string, any>();
    [...thirdProducts, ...secondProducts, ...firstProducts].forEach(product => {
      const id = product?.productId ?? product?.ProductId ?? product?.id;
      if (id !== undefined && !productIndex.has(String(id))) {
        productIndex.set(String(id), product);
      }
    });

    const recommendedCards = orFallback(
      goatDeals.length > 0
        ? goatDeals
            .slice(0, 6)
            .map((banner: any, index: number) =>
              mapGoatDealCard(
                banner,
                index,
                productIndex.get(String(bannerProductId(banner))),
              ),
            )
            .filter(card => card.image)
        : thirdProducts.slice(0, 6).map(mapRecCard).filter(card => card.image),
      RECOMMENDED,
    );

    const bestSellingRaw = (homeData?.showcaseSlider || []).slice(0, 6);
    const bestSellingTiles = orFallback(
      bestSellingRaw.map(mapCategoryTile),
      BEST_SELLING,
    );

    const rawOccasions = (() => {
      const fromBanners =
        bannersFor(homeData, 'app_occasions').length > 0
          ? bannersFor(homeData, 'app_occasions')
          : bannersFor(homeData, 'app_shop_by_occasion').length > 0
          ? bannersFor(homeData, 'app_shop_by_occasion')
          : bannersFor(homeData, 'app_home_cat_top_sidebyside_four').length > 0
          ? bannersFor(homeData, 'app_home_cat_top_sidebyside_four')
          : null;
      if (fromBanners && fromBanners.length > 0) return fromBanners;

      const direct =
        homeData?.occasions ||
        homeData?.Occasions ||
        homeData?.shopByOccasion ||
        homeData?.ShopByOccasion;
      if (Array.isArray(direct) && direct.length > 0) return direct;

      if (Array.isArray(categories) && categories.length > 0) {
        return categories.slice(0, 4);
      }
      return [];
    })();

    const occasions = rawOccasions
      .map(mapOccasionTile)
      .filter((o: any) => Boolean(o.image));

    return {
      header: {
        title: sectionTitle(homeData, 'home', HEADER_CONTENT.title),
        address: selectedAddress,
        searchPlaceholder: HEADER_CONTENT.searchPlaceholder,
      },
      occasions,
      headerTabs: [
        { id: 'all', name: 'All' },
        ...tabs.map((tab: any, i: number) => ({
          id: String(
            tab.tabId ?? tab.TabId ?? resolveCatId(tab) ?? i,
          ),
          name:
            tab.tabName || tab.TabName || resolveCatName(tab, '') || 'Tab',
          image: resolveImageSource(
            tab.toptabimgurl ??
              tab.topTabImgUrl ??
              tab.TopTabImgUrl ??
              tab.TopTabImgURL,
          ),
        })),
      ],
      headerItemsFor: (tabId: string): HeaderItem[] => {
        const source =
          tabId === 'all'
            ? categories.slice(0, 8)
            : (() => {
                const tab = tabs.find((t: any, i: number) => {
                  const id = t.tabId ?? t.TabId ?? resolveCatId(t) ?? i;
                  return String(id) === String(tabId);
                });
                return tab?.items || tab?.Items || [];
              })();

        const mapped: HeaderItem[] = source.map((item: any, index: number) => ({
          id: String(resolveCatId(item) ?? index),
          name: resolveCatName(item, ''),
          image:
            mapCategoryTile(item, index).image ??
            HEADER_PLACEHOLDERS[index % HEADER_PLACEHOLDERS.length],
          raw: item,
        }));

        return orFallback(mapped, FALLBACK_HEADER_ITEMS);
      },
      searchTabs: orFallback(
        tabs.map((t: any) => resolveCatName(t, '')).filter(Boolean),
        CATEGORY_TABS,
      ),
      featured: firstProducts.map(mapProductTile),
      featuredTitle: splitTitle(blockTitle(firstBlock, 'Curated for you')),
      featuredBlock: firstBlock,
      categoryChips: tabs.map(mapTabChip),
      categoryCardsFor: (chipId: string): Tile[] => {
        const tab = tabs.find(
          (t: any, i: number) =>
            String(mapTabChip(t, i).id) === String(chipId),
        );
        const items = tab?.items || tab?.Items || [];
        return items.map(mapCategoryTile);
      },
      bestSelling: bestSellingTiles,
      brands: rawBrands.map(mapBrandTile),
      recommended: thirdProducts.slice(0, 6).map(mapRecCard),
      secondStrip: secondProducts.map(mapProductTile),
      secondTitle: splitTitle(blockTitle(secondBlock, 'Trending Now')),
      secondBlock,
      thirdStrip: thirdProducts.map(mapProductTile),
      thirdTitle: splitTitle(blockTitle(thirdBlock, 'Time less design')),
      thirdBlock,
      exploreRowOne: exploreTiles.slice(0, 5),
      exploreRowTwo: exploreTiles.slice(5, 10),
      banners: {
        main: bannersFor(homeData, 'app_main_banner'),
        top:
          bannersFor(homeData, 'app_main_banner').length > 0
            ? bannersFor(homeData, 'app_main_banner')
            : bannersFor(homeData, 'app_home_top_banner'),
        top3InARow: bannersFor(homeData, 'app_top_3_in_a_row'),
        mid:
          bannersFor(homeData, 'app_mid_banner').length > 0
            ? bannersFor(homeData, 'app_mid_banner')
            : bannersFor(homeData, 'app_home_mid_banner'),
        midBottom:
          bannersFor(homeData, 'app_mid_bottom_banner').length > 0
            ? bannersFor(homeData, 'app_mid_bottom_banner')
            : bannersFor(homeData, 'app_home_mid_banner_bottom').length > 0
            ? bannersFor(homeData, 'app_home_mid_banner_bottom')
            : bannersFor(homeData, 'app_home_bottom'),
        bottom2InARow: bannersFor(homeData, 'app_bottom_2_in_a_row'),
        bottom: bannersFor(homeData, 'app_home_bottom'),
        topSection: bannersFor(homeData, 'app_home_top_banner_top_section'),
        sideBySide:
          bannersFor(homeData, 'app_bottom_2_in_a_row').length > 0
            ? bannersFor(homeData, 'app_bottom_2_in_a_row')
            : bannersFor(homeData, 'app_home_top_sidebyside_two'),
      },
      recommendedTitleBlock: thirdBlock,
      recommendedFooterImage: resolveImageSource(
        bannersFor(homeData, 'app_flahs_sale')[0]?.imageUrl,
      ),
    };
  }, [homeData, profile, selectedAddress]);

  return { homeData, loading, refreshing, onRefresh, sections };
};

export const bannerImage = (banner: any) =>
  resolveImageSource(banner?.imageUrl || banner?.ImageUrl || banner?.image);

const VIDEO_EXTENSIONS = /\.(mp4|mov|m4v|webm)(\?.*)?$/i;

export const bannerMedia = (banner: any) => {
  const source = bannerImage(banner);
  const uri = typeof source?.uri === 'string' ? source.uri : '';
  if (!uri) {
    return null;
  }
  return { source, uri, isVideo: VIDEO_EXTENSIONS.test(uri) };
};
