import type { ProductTile, Tile } from '../../../Home/redesign/content';
import {
  mapCategoryTile,
  mapProductTile,
  resolveImageSource,
} from '../../../Home/redesign/data/mappers';

export const ALL_TILE_ID = '__all__';

// Convert backend category objects to display tiles (pure backend data, no dummy fallbacks)
export const toCategoryTiles = (items: any[]): Tile[] => {
  return (items || []).map((cat, idx) => mapCategoryTile(cat, idx));
};

// Convert backend subcategory objects to display tiles (pure backend data, no dummy fallbacks)
export const toSubCategoryTiles = (items: any[], activeCategory?: any): Tile[] => {
  if (!items || items.length === 0) {
    return [];
  }
  const tiles = items.map((cat, idx) => mapCategoryTile(cat, idx));
  const allTile: Tile = {
    id: ALL_TILE_ID,
    label: 'All',
    image: activeCategory?.imageUrl ? resolveImageSource(activeCategory.imageUrl) : null,
    raw: activeCategory || null,
  };
  return [allTile, ...tiles];
};

export const formatProductSubtitle = (raw: any): string => {
  if (!raw) return '';
  const purity =
    raw.purity ||
    raw.goldPurity ||
    raw.metalPurity ||
    (raw.goldType ? `${raw.goldType} Gold` : '');
  const stone =
    raw.gemstone ||
    raw.stoneType ||
    raw.diamondType ||
    raw.material ||
    raw.stone ||
    raw.subCategoryName;
  const cat = raw.catName || raw.categoryName;

  if (purity && stone) return `${purity} | ${stone}`;
  if (purity && cat) return `${purity} | ${cat}`;
  if (purity) return purity;
  if (stone) return stone;
  if (cat) return cat;
  return '';
};

export const toProductCards = (items: any[]): ProductTile[] =>
  (items || []).map((item, idx) => {
    const tile = mapProductTile(item, idx);
    if (!tile.subtitle) {
      tile.subtitle = formatProductSubtitle(item);
    }
    return tile;
  });

export const bannerSource = (category: any) =>
  resolveImageSource(category?.mobBannerImgUrl ?? category?.MobBannerImgUrl);

export const findCategory = (items: any[], id: string | null) =>
  (items || []).find(
    cat =>
      cat?.catId?.toString() === id ||
      cat?.id?.toString() === id ||
      cat?.categoryId?.toString() === id ||
      cat?.catName?.toLowerCase() === id?.toLowerCase(),
  );

export const isOutOfStock = (item: any) =>
  item?.stockQty <= 0 || item?.stockAvailability === 'Out Of Stock';
