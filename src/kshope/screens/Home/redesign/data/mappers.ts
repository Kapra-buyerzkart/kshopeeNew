import CONFIG from '../../../../globals/config';
import type { OccasionTile, ProductTile, RecCard, Tile } from '../content';

export type BrandTile = { id: string; image: any; raw?: any };
export type RecentItem = {
  id: string;
  label: string;
  price: string;
  mrp: string;
  raw?: any;
};

const pick = (source: any, ...keys: string[]) => {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }
  return undefined;
};

export const resolveImageSource = (path: any) => {
  if (!path) {
    return null;
  }
  if (typeof path === 'object') {
    return path.uri ? path : null;
  }
  if (typeof path !== 'string') {
    return path;
  }

  const trimmed = path.trim();
  if (!trimmed) {
    return null;
  }
  if (trimmed.startsWith('http')) {
    return { uri: trimmed };
  }

  const base = CONFIG.image_base_url.replace(/\/$/, '');
  const suffix = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return { uri: `${base}${suffix}` };
};

const imageOf = (item: any) =>
  resolveImageSource(
    pick(
      item,
      'featuredImage',
      'FeaturedImage',
      'productImage',
      'ProductImage',
      'catImage',
      'CatImage',
      'imageUrl',
      'ImageUrl',
      'imagePath',
      'ImagePath',
      'thumbnail',
      'Thumbnail',
      'image',
      'Image',
    ),
  );

const idOf = (item: any, prefix: string, index: number) => {
  const raw = pick(
    item,
    'productId',
    'ProductId',
    'bannerId',
    'BannerId',
    'catId',
    'CatId',
    'categoryId',
    'CategoryId',
    'tabId',
    'TabId',
    'id',
    'Id',
  );
  return raw === undefined ? `${prefix}-${index}` : String(raw);
};

const nameOf = (item: any) =>
  pick(
    item,
    'prName',
    'PrName',
    'productName',
    'ProductName',
    'title',
    'Title',
    'name',
    'Name',
  ) ?? '';

/** Formats a number or numeric string with Indian comma separators (e.g. 124000 -> "1,24,000") */
export const formatAmountWithCommas = (val: unknown): string => {
  if (val === null || val === undefined || val === '') return '';
  const clean = String(val).replace(/,/g, '').trim();
  const num = parseFloat(clean);
  if (!Number.isFinite(num)) return String(val);
  return Number.isInteger(num)
    ? num.toLocaleString('en-IN')
    : num.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
};

/** Formats a price string or number with Indian commas, preserving ₹ and /- if present */
export const formatPriceWithCommas = (val?: string | number | null): string => {
  if (val === null || val === undefined || val === '') return '';
  if (typeof val === 'number') {
    return `₹${formatAmountWithCommas(val)}/-`;
  }
  const str = String(val).trim();
  if (str.includes(',')) return str;
  return str.replace(/(\d+(\.\d+)?)/, match => formatAmountWithCommas(match));
};

export const toPricing = (item: any) => {
  const price = Number(pick(item, 'specialPrice', 'price', 'currentPrice')) || 0;
  const mrp = Number(pick(item, 'unitPrice', 'mrp', 'originalPrice')) || 0;
  const percent = item?.discountPercent
    ? Math.round(item.discountPercent)
    : mrp > 0 && price > 0 && mrp > price
    ? Math.round(((mrp - price) / mrp) * 100)
    : 0;

  return {
    price: price > 0 ? `₹${formatAmountWithCommas(price)}/-` : '',
    mrp: mrp > 0 && mrp > price ? `₹${formatAmountWithCommas(mrp)}/-` : '',
    discount: percent > 0 ? `${percent}% OFF` : '',
  };
};

export const tokensOf = (item: any) => {
  const value = Number(
    pick(item, 'btokens', 'bTokens', 'BTokens', 'Btokens') ?? 0,
  );
  return Number.isFinite(value) && value > 0 ? Math.round(value) : 0;
};

export const mapProductTile = (item: any, index: number): ProductTile => {
  const tokens = tokensOf(item);
  return {
    id: idOf(item, 'product', index),
    brand: pick(item, 'brandName', 'BrandName', 'brand', 'Brand') ?? '',
    name: nameOf(item),
    ...toPricing(item),
    ...(tokens > 0 ? { tokens } : {}),
    image: imageOf(item),
    raw: item,
  };
};

export const mapRecCard = (item: any, index: number): RecCard => ({
  id: idOf(item, 'rec', index),
  name: nameOf(item),
  subtitle:
    pick(item, 'catName', 'CatName', 'subTitle', 'SubTitle', 'shortDescription') ??
    '',
  ...toPricing(item),
  image: imageOf(item),
  raw: item,
});

export const bannerProductId = (banner: any) => {
  const linkType = String(
    pick(banner, 'linkType', 'LinkType') ?? '',
  ).toLowerCase();
  if (linkType !== 'product') {
    return undefined;
  }
  const value = pick(banner, 'linkValue', 'LinkValue');
  return value === undefined ? undefined : String(value);
};

export const mapGoatDealCard = (
  banner: any,
  index: number,
  linked?: any,
): RecCard => {
  const pricing = toPricing(banner);
  const linkedPricing = linked ? toPricing(linked) : null;
  const hasOwnPricing = Boolean(pricing.price);

  return {
    id: idOf(banner, 'goat', index),
    variant: linked ? 'product' : 'banner',
    name:
      pick(
        banner,
        'title',
        'Title',
        'bannerName',
        'BannerName',
        'name',
        'Name',
      ) ??
      (linked ? nameOf(linked) : '') ??
      '',
    subtitle:
      pick(banner, 'subTitle', 'SubTitle', 'description', 'Description') ??
      (linked
        ? pick(linked, 'catName', 'CatName', 'brandName', 'BrandName') ?? ''
        : ''),
    ...(hasOwnPricing || !linkedPricing ? pricing : linkedPricing),
    image:
      resolveImageSource(
        pick(
          banner,
          'imageUrl',
          'ImageUrl',
          'bannerImageUrl',
          'BannerImageUrl',
          'bannerImage',
          'BannerImage',
          'imagePath',
          'ImagePath',
          'image',
          'Image',
        ),
      ) ?? (linked ? imageOf(linked) : null),
    raw: linked ?? banner,
  };
};

export const mapCategoryTile = (cat: any, index: number): Tile => ({
  id: idOf(cat, 'category', index),
  label:
    pick(cat, 'catName', 'CatName', 'displayTitle', 'DisplayTitle', 'name', 'Name') ??
    '',
  image: imageOf(cat),
  raw: cat,
});

export const mapExploreTile = (cat: any, index: number): Tile => ({
  id: idOf(cat, 'explore', index),
  label:
    pick(cat, 'catName', 'CatName', 'displayTitle', 'DisplayTitle', 'name', 'Name') ??
    '',
  image:
    resolveImageSource(pick(cat, 'svgurl', 'svgUrl', 'SvgUrl', 'SvgURL')) ??
    imageOf(cat),
  raw: cat,
});

export const mapTabChip = (tab: any, index: number): Tile => ({
  id: String(pick(tab, 'tabId', 'TabId') ?? idOf(tab, 'tab', index)),
  label:
    pick(tab, 'tabName', 'TabName', 'catName', 'CatName', 'name', 'Name') ?? '',
  image:
    resolveImageSource(pick(tab, 'tabImageUrl', 'TabImageUrl')) ?? imageOf(tab),
  raw: tab,
});

export const mapBrandTile = (banner: any, index: number): BrandTile => ({
  id: idOf(banner, 'brand', index),
  // Brand rows carry their logo under brandImage/logo, which the generic
  // product image lookup does not check.
  image:
    resolveImageSource(pick(banner, 'brandImage', 'BrandImage', 'logo', 'Logo')) ??
    imageOf(banner),
  raw: banner,
});

export const mapRecentlyViewed = (item: any, index: number): RecentItem => {
  const { price, mrp } = toPricing(item);
  return {
    id: idOf(item, 'recent', index),
    label: nameOf(item),
    price,
    mrp,
    raw: item,
  };
};

export const mapOccasionTile = (item: any, index: number): OccasionTile => {
  const label =
    pick(
      item,
      'title',
      'Title',
      'bannerName',
      'BannerName',
      'catName',
      'CatName',
      'name',
      'Name',
      'label',
      'Label',
      'displayTitle',
      'DisplayTitle',
    ) || `Occasion ${index + 1}`;

  return {
    id: String(
      pick(item, 'bannerId', 'BannerId', 'catId', 'CatId', 'id', 'Id') ??
        `occasion-${index}`,
    ),
    label,
    image:
      resolveImageSource(
        pick(
          item,
          'imageUrl',
          'ImageUrl',
          'bannerImageUrl',
          'BannerImageUrl',
          'bannerImage',
          'BannerImage',
          'catImage',
          'CatImage',
          'featuredImage',
          'FeaturedImage',
          'image',
          'Image',
        ),
      ) || null,
    query: label,
    raw: item,
  };
};

export const orFallback = <T>(
  mapped: T[] | null | undefined,
  fallback: T[],
): T[] => (mapped && mapped.length > 0 ? mapped : fallback);
