import {
  resolveImageSource,
  tokensOf,
} from '../../../Home/redesign/data/mappers';
import { PDP_ART } from '../assets';

const FEATURE_ICONS = [
  PDP_ART.featFire,
  PDP_ART.featStar,
  PDP_ART.featGasStove,
  PDP_ART.featShield,
];

export type Feature = {
  id: string;
  icon: any;
  title: string;
  subtitle: string;
};

export const tokenCount = (...sources: any[]) => {
  for (const source of sources) {
    const value = tokensOf(source);
    if (value > 0) {
      return value;
    }
  }
  return 0;
};

export const money = (value: any) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    return '';
  }
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const galleryImages = (details: any, fallback: any) => {
  const images =
    details?.images ||
    details?.productImages ||
    details?.gallery ||
    details?.product?.images ||
    fallback?.images ||
    [];

  const sources = Array.isArray(images)
    ? images
        .map((entry: any) =>
          resolveImageSource(
            entry?.imageUrl ||
              entry?.imagePath ||
              entry?.url ||
              entry?.image ||
              entry?.thumbnail ||
              entry?.uri ||
              entry,
          ),
        )
        .filter(Boolean)
    : [];

  if (sources.length > 0) {
    return sources;
  }

  const single = resolveImageSource(
    details?.featuredImage ||
      details?.product?.featuredImage ||
      fallback?.featuredImage ||
      fallback?.imageUrl ||
      fallback?.image ||
      fallback?.productImage ||
      fallback?.thumbnail,
  );
  return single ? [single] : [];
};

export const productTitle = (product: any, details?: any) =>
  product?.prName ||
  product?.productName ||
  product?.title ||
  product?.name ||
  details?.product?.prName ||
  details?.product?.productName ||
  details?.product?.title ||
  details?.product?.name ||
  details?.prName ||
  details?.productName ||
  details?.title ||
  details?.name ||
  '';

export const productSubtitle = (product: any, details?: any) =>
  product?.shortDescription ||
  product?.catName ||
  product?.categoryName ||
  product?.brandName ||
  details?.product?.shortDescription ||
  details?.product?.catName ||
  details?.product?.categoryName ||
  details?.product?.brandName ||
  details?.shortDescription ||
  details?.catName ||
  '';

export const productDescription = (product: any, details?: any) => {
  const raw =
    product?.description ||
    product?.longDescription ||
    product?.shortDescription ||
    details?.product?.description ||
    details?.product?.longDescription ||
    details?.product?.shortDescription ||
    details?.description ||
    details?.shortDescription ||
    '';
  return String(raw)
    .replace(/<\/?[^>]+(>|$)/g, '')
    .trim();
};

export const pricing = (product: any, details?: any) => {
  const src = product || details?.product || details || {};
  const mrp =
    Number(
      src?.unitPrice ??
        src?.mrp ??
        src?.originalPrice ??
        src?.regularPrice ??
        details?.unitPrice ??
        details?.mrp ??
        0,
    ) || 0;
  const price =
    Number(
      src?.specialPrice ??
        src?.price ??
        src?.sellingPrice ??
        src?.currentPrice ??
        details?.specialPrice ??
        details?.price ??
        mrp,
    ) || mrp;
  const saved = mrp > price ? mrp - price : 0;
  const percent =
    Number(
      src?.discountPercent ??
        src?.discountPercentage ??
        details?.discountPercent ??
        details?.discountPercentage,
    ) || (mrp > 0 && saved > 0 ? Math.round((saved / mrp) * 100) : 0);

  return {
    price: money(price),
    mrp: saved > 0 ? money(mrp) : '',
    saved: money(saved),
    percent,
    discountLabel: percent > 0 ? `${percent}%` : '',
    saveLabel: saved > 0 ? `You save ${money(saved)} (${percent}% OFF)` : '',
    savingBadge: saved > 0 ? `You are saving ${money(saved)}/-` : '',
  };
};

export type PriceBreakupItem = {
  breakupId: number | string;
  productId?: number | string;
  componentType?: string;
  componentName: string;
  amount: number;
  formattedAmount: string;
  sortOrder: number;
};

export const extractPriceBreakup = (
  details: any,
  product: any,
): PriceBreakupItem[] => {
  const rawList =
    details?.jewelleryPriceBreakup ||
    product?.jewelleryPriceBreakup ||
    details?.priceBreakup ||
    details?.priceBreakups ||
    details?.price_breakup ||
    details?.productPriceBreakup ||
    details?.breakup ||
    details?.breakups ||
    details?.product?.priceBreakup ||
    details?.product?.priceBreakups ||
    product?.priceBreakup ||
    product?.priceBreakups ||
    product?.price_breakup ||
    [];

  const seenIds = new Set<string>();
  const items: PriceBreakupItem[] = [];

  if (Array.isArray(rawList) && rawList.length > 0) {
    for (const item of rawList) {
      const id = String(item?.breakupId ?? item?.id ?? items.length);
      if (seenIds.has(id)) {
        continue;
      }
      seenIds.add(id);

      const amount = Number(item?.amount ?? item?.value ?? item?.price ?? 0);
      const componentName =
        item?.componentName ||
        item?.componentType ||
        item?.title ||
        item?.name ||
        item?.label ||
        'Component';

      items.push({
        breakupId: item?.breakupId ?? id,
        productId: item?.productId,
        componentType: item?.componentType || '',
        componentName,
        amount,
        formattedAmount:
          money(amount) ||
          (amount > 0 ? `₹${amount.toLocaleString('en-IN')}` : 'Included'),
        sortOrder: Number(item?.sortOrder ?? 0),
      });
    }
  }

  // If gold / metal details exist and we have making charges or breakup items,
  // ensure Gold Metal component is included at the top if not already listed
  const hasMetalComponent = items.some(
    i =>
      i.componentName.toLowerCase().includes('gold') ||
      i.componentName.toLowerCase().includes('metal'),
  );

  const jd = details?.jewelleryDetails || product?.jewelleryDetails;
  const jm = (details?.jewelleryMetals || product?.jewelleryMetals || [])[0];
  const goldPurity = jd?.metalPurity || jm?.purity || '22KT';
  const goldWeight = jd?.netMetalWeight || jm?.weight;

  const totalSpecialPrice = Number(
    product?.specialPrice ??
      product?.price ??
      details?.product?.specialPrice ??
      details?.specialPrice ??
      0,
  );

  if (!hasMetalComponent && totalSpecialPrice > 0) {
    const sumOtherBreakup = items.reduce((sum, item) => sum + item.amount, 0);
    const goldAmount = Math.max(0, totalSpecialPrice - sumOtherBreakup);
    const label = `Gold Component (${goldPurity}${goldWeight ? ` - ${goldWeight}g` : ''})`;

    items.unshift({
      breakupId: 'gold-metal-component',
      componentType: 'GoldMetal',
      componentName: label,
      amount: goldAmount,
      formattedAmount:
        money(goldAmount) || `₹${goldAmount.toLocaleString('en-IN')}`,
      sortOrder: 1,
    });
  }

  return items.sort((a, b) => a.sortOrder - b.sortOrder);
};

export const ratingSummary = (details: any, product?: any) => {
  const summary =
    details?.ratingSummary ||
    details?.ratings ||
    details?.product?.ratingSummary ||
    product?.ratingSummary ||
    {};
  const average = Number(
    summary?.avgRating ??
      summary?.averageRating ??
      summary?.rating ??
      product?.avgRating ??
      0,
  );
  const ratings = Number(
    summary?.ratingCount ??
      summary?.reviewCount ??
      summary?.totalRatings ??
      summary?.count ??
      product?.ratingCount ??
      0,
  );
  const reviews = Number(
    summary?.reviewCount ??
      summary?.totalReviews ??
      product?.reviewCount ??
      0,
  );

  return {
    average: average.toFixed(1),
    ratings,
    reviews,
    hasRating: average > 0 || ratings > 0 || reviews > 0,
  };
};

export const isOutOfStock = (product: any, details?: any) => {
  const src = product || details?.product || details || {};
  const stockQty = Number(src?.stockQty ?? details?.stockQty ?? 1);
  const availability = String(
    src?.stockAvailability || details?.stockAvailability || '',
  ).toLowerCase();
  const isAvail = src?.isAvailable ?? details?.isAvailable;
  const inStock = src?.inStock ?? details?.inStock;

  return (
    stockQty <= 0 ||
    availability === 'out of stock' ||
    availability === 'outofstock' ||
    isAvail === false ||
    inStock === false
  );
};

export const featureList = (details: any, product?: any): Feature[] => {
  const attrs =
    details?.attributes ||
    details?.productAttributes ||
    details?.product?.attributes ||
    product?.attributes ||
    [];

  if (!Array.isArray(attrs)) {
    return [];
  }

  return attrs
    .slice(0, 4)
    .map((attr: any, index: number) => ({
      id: String(attr?.attrId ?? attr?.id ?? index),
      icon: FEATURE_ICONS[index % FEATURE_ICONS.length],
      title: attr?.attrName || attr?.name || attr?.label || '',
      subtitle: attr?.attrValue || attr?.value || '',
    }))
    .filter((feature: Feature) => Boolean(feature.title));
};

export type ReviewBar = {
  star: number;
  percent: number;
};

export type ReviewEntry = {
  id: string;
  name: string;
  date: string;
  rating: number;
  comment: string;
};

const reviewDate = (value: any) => {
  if (!value) {
    return '';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }
  return parsed
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .replace(/ (\w+) /, ' $1, ');
};

export const reviewList = (details: any, product?: any): ReviewEntry[] => {
  const list =
    details?.reviews ||
    details?.productReviews ||
    details?.product?.reviews ||
    product?.reviews ||
    [];

  if (!Array.isArray(list)) {
    return [];
  }

  return list.map((entry: any, index: number) => ({
    id: String(entry?.reviewId ?? entry?.id ?? index),
    name:
      entry?.customerName ||
      entry?.userName ||
      entry?.name ||
      entry?.user?.name ||
      'Anonymous',
    date: reviewDate(
      entry?.createdDate || entry?.reviewDate || entry?.date || entry?.createdAt,
    ),
    rating: Number(entry?.rating ?? entry?.ratingValue ?? entry?.stars ?? 0),
    comment: String(
      entry?.comment ||
        entry?.review ||
        entry?.description ||
        entry?.reviewText ||
        '',
    )
      .replace(/<\/?[^>]+(>|$)/g, '')
      .trim(),
  }));
};

export const reviewSummary = (details: any, product?: any) => {
  const summary =
    details?.ratingSummary ||
    details?.product?.ratingSummary ||
    product?.ratingSummary ||
    {};
  const reviews = reviewList(details, product);

  const total = Number(
    summary?.ratingCount ??
      summary?.reviewCount ??
      summary?.totalRatings ??
      reviews.length ??
      0,
  );

  const counts = [5, 4, 3, 2, 1].map(star => {
    const fromSummary =
      summary?.[`star${star}`] ??
      summary?.[`rating${star}`] ??
      summary?.[`count${star}`];
    if (fromSummary !== undefined && fromSummary !== null) {
      return Number(fromSummary) || 0;
    }
    return reviews.filter(entry => Math.round(entry.rating) === star).length;
  });

  const totalCounts = counts.reduce((sum, value) => sum + value, 0);

  const bars: ReviewBar[] = counts.map((count, index) => ({
    star: 5 - index,
    percent: totalCounts > 0 ? Math.round((count / totalCounts) * 100) : 0,
  }));

  const average = Number(
    summary?.avgRating ??
      summary?.averageRating ??
      (reviews.length
        ? reviews.reduce((sum, entry) => sum + entry.rating, 0) / reviews.length
        : 0),
  );

  return {
    average: average.toFixed(1),
    total,
    bars,
    hasData: totalCounts > 0 || reviews.length > 0,
  };
};

export const specificationList = (details: any, product?: any) => {
  const jd = details?.jewelleryDetails || product?.jewelleryDetails || {};
  const jm =
    (details?.jewelleryMetals || product?.jewelleryMetals || [])[0] || {};
  const jsList =
    details?.jewelleryStones || product?.jewelleryStones || [];
  const js = jsList[0] || {};

  const attrs =
    details?.attributes ||
    details?.productAttributes ||
    details?.product?.attributes ||
    product?.attributes ||
    [];

  const list: { id: string; label: string; value: string }[] = [];
  const seenLabels = new Set<string>();

  const addSpec = (label: string, value: any) => {
    if (!label || value === undefined || value === null || value === '') {
      return;
    }
    const cleanVal = String(value).trim();
    if (!cleanVal) {
      return;
    }
    const key = label.toLowerCase();
    if (seenLabels.has(key)) {
      return;
    }
    seenLabels.add(key);
    list.push({
      id: `spec-${list.length}`,
      label,
      value: cleanVal,
    });
  };

  // 1. Structured Jewellery Details from Backend
  if (jd.jewelleryType) addSpec('Jewellery Type', jd.jewelleryType);
  if (jd.gender) addSpec('Gender', jd.gender);
  if (jd.metalType || jm.metalType) {
    addSpec('Metal', jd.metalType || jm.metalType);
  }
  if (jd.metalPurity || jm.purity) {
    addSpec('Purity', jd.metalPurity || jm.purity);
  }
  if (jd.metalColor || jm.color) {
    const color = jd.metalColor || jm.color;
    addSpec(
      'Metal Color',
      String(color).toLowerCase().includes('gold') ? color : `${color} Gold`,
    );
  }
  if (jd.grossWeight) {
    addSpec('Gross Weight', `${jd.grossWeight} ${jd.weightUOM || 'g'}`);
  }
  if (jd.netMetalWeight || jm.weight) {
    addSpec(
      'Net Metal Weight',
      `${jd.netMetalWeight || jm.weight} ${jd.weightUOM || jm.weightUOM || 'g'}`,
    );
  }

  const dimUom = jd.dimensionUOM || 'mm';
  if (jd.width && jd.height && jd.thickness) {
    addSpec(
      'Dimensions',
      `${jd.width} x ${jd.height} x ${jd.thickness} ${dimUom}`,
    );
  } else if (jd.width && jd.height) {
    addSpec('Dimensions', `${jd.width} x ${jd.height} ${dimUom}`);
  } else if (jd.height) {
    addSpec('Dimensions', `${jd.height} ${dimUom}`);
  }

  if (jd.piecesCount) addSpec('Pieces Count', String(jd.piecesCount));
  if (jd.productCode) addSpec('Product Code', jd.productCode);
  if (product?.sku && product?.sku !== jd.productCode) {
    addSpec('SKU', product.sku);
  }
  if (jd.certificationNumber) {
    addSpec('Certification Number', jd.certificationNumber);
  }

  // 2. Stone Details if present
  if (js.stoneType) addSpec('Stone Type', js.stoneType);
  if (js.carat || js.weight) {
    addSpec('Stone Weight', `${js.carat || js.weight} ct`);
  }
  if (js.clarity) addSpec('Stone Clarity', js.clarity);
  if (js.color) addSpec('Stone Color', js.color);
  if (js.stoneCount) addSpec('Stone Count', String(js.stoneCount));
  if (js.settingType) addSpec('Setting Type', js.settingType);

  // 3. Raw Attributes from API
  if (Array.isArray(attrs)) {
    for (const attr of attrs) {
      const label = attr?.attrName || attr?.name || attr?.label || '';
      const value = attr?.attrValue || attr?.value || '';
      addSpec(label, value);
    }
  } else if (typeof attrs === 'object' && attrs !== null) {
    for (const [label, value] of Object.entries(attrs)) {
      addSpec(label, value);
    }
  }

  return list;
};

export type JewelleryDetails = {
  goldPurity: string;
  goldType: string;
  netWeight: string;
  grossWeight: string;
  hasDiamond: boolean;
  diamondWeight?: string;
  diamondClarity?: string;
  diamondCount?: string;
  diamondSetting?: string;
  dimensions?: string;
  isRing: boolean;
  availableSizes: string[];
  selectedSize: string;
  summaryText: string;
  sku: string;
};

export const extractJewelleryDetails = (
  details: any,
  product: any,
): JewelleryDetails => {
  const jd = details?.jewelleryDetails || product?.jewelleryDetails || {};
  const jm =
    (details?.jewelleryMetals || product?.jewelleryMetals || [])[0] || {};
  const jsList =
    details?.jewelleryStones || product?.jewelleryStones || [];
  const js = jsList[0] || {};

  const attrs =
    details?.attributes ||
    details?.productAttributes ||
    details?.product?.attributes ||
    product?.attributes ||
    [];

  const findVal = (...terms: string[]) => {
    if (Array.isArray(attrs)) {
      const attr = attrs.find((a: any) => {
        const name = String(
          a?.attrName || a?.name || a?.label || a?.attributeName || a?.key || '',
        ).toLowerCase();
        return terms.some(t => name.includes(t.toLowerCase()));
      });
      return String(
        attr?.attrValue || attr?.value || attr?.attributeValue || '',
      ).trim();
    } else if (typeof attrs === 'object' && attrs !== null) {
      for (const [key, val] of Object.entries(attrs)) {
        if (terms.some(t => key.toLowerCase().includes(t.toLowerCase()))) {
          return String(val || '').trim();
        }
      }
    }
    return '';
  };

  const title = String(
    product?.prName ||
      product?.productName ||
      product?.title ||
      product?.name ||
      details?.product?.prName ||
      details?.prName ||
      '',
  ).toLowerCase();

  const jType = String(jd.jewelleryType || '').toLowerCase();
  const cat = String(
    product?.catName ||
      product?.categoryName ||
      details?.product?.catName ||
      details?.catName ||
      '',
  ).toLowerCase();

  const isRing =
    jType === 'ring' ||
    title.includes('ring') ||
    cat.includes('ring') ||
    Boolean(findVal('ring size', 'size'));

  const goldPurity =
    jd.metalPurity ||
    jm.purity ||
    product?.goldPurity ||
    product?.purity ||
    product?.karat ||
    product?.kt ||
    details?.product?.goldPurity ||
    details?.goldPurity ||
    findVal('gold purity', 'purity', 'karat', 'kt', 'metal purity') ||
    '';

  const rawGoldColor =
    jd.metalColor ||
    jm.color ||
    product?.goldType ||
    product?.metalColor ||
    product?.metalType ||
    product?.goldColor ||
    details?.product?.goldType ||
    details?.goldType ||
    findVal('gold type', 'metal color', 'metal type', 'gold color', 'metal') ||
    '';
  const goldType = rawGoldColor
    ? String(rawGoldColor).toLowerCase().includes('gold')
      ? rawGoldColor
      : `${rawGoldColor} Gold`
    : (jd.metalType || jm.metalType || '');

  const weightUom = jd.weightUOM || jm.weightUOM || 'g';

  const netWeightRaw =
    jd.netMetalWeight ||
    jm.weight ||
    product?.netWeight ||
    product?.weight ||
    details?.product?.netWeight ||
    details?.netWeight ||
    findVal('net wt', 'net weight', 'weight');
  const netWeight = netWeightRaw
    ? String(netWeightRaw).includes(weightUom)
      ? String(netWeightRaw)
      : `${netWeightRaw} ${weightUom}`
    : '';

  const grossWeightRaw =
    jd.grossWeight ||
    product?.grossWeight ||
    details?.product?.grossWeight ||
    details?.grossWeight ||
    findVal('gross wt', 'gross weight');
  const grossWeight = grossWeightRaw
    ? String(grossWeightRaw).includes(weightUom)
      ? String(grossWeightRaw)
      : `${grossWeightRaw} ${weightUom}`
    : '';

  // Stone / Diamond checks
  const diamondWeightRaw =
    js.carat ||
    js.weight ||
    product?.diamondWeight ||
    product?.stoneWeight ||
    product?.carat ||
    details?.product?.diamondWeight ||
    details?.diamondWeight ||
    findVal(
      'diamond weight',
      'diamond wt',
      'carat',
      'stone weight',
      'total diamond weight',
      'diamond carat',
    );
  const diamondClarity =
    js.clarity ||
    js.color ||
    product?.diamondClarity ||
    product?.diamondQuality ||
    product?.clarity ||
    details?.product?.diamondClarity ||
    details?.diamondClarity ||
    findVal(
      'diamond clarity',
      'clarity',
      'diamond quality',
      'color & clarity',
      'stone quality',
    ) ||
    '';

  const diamondCountRaw =
    js.stoneCount ||
    js.count ||
    product?.diamondCount ||
    product?.stoneCount ||
    details?.product?.diamondCount ||
    details?.diamondCount ||
    findVal(
      'diamond count',
      'stone count',
      'no of diamonds',
      'number of stones',
      'stones',
    );
  const diamondCount = diamondCountRaw
    ? String(diamondCountRaw).toLowerCase().includes('diamond')
      ? String(diamondCountRaw)
      : `${diamondCountRaw} Diamonds`
    : '';

  const diamondSetting =
    js.settingType ||
    product?.settingType ||
    product?.diamondSetting ||
    details?.product?.settingType ||
    details?.settingType ||
    findVal('setting type', 'setting', 'design type') ||
    '';

  const stoneType =
    js.stoneType ||
    product?.stoneType ||
    details?.product?.stoneType ||
    details?.stoneType ||
    findVal('stone type', 'gemstone', 'stone');

  const hasDiamond = Boolean(
    jsList.length > 0 ||
      diamondWeightRaw ||
      diamondClarity ||
      diamondCount ||
      stoneType ||
      title.includes('diamond') ||
      title.includes('solitaire') ||
      findVal('diamond', 'gemstone', 'solitaire'),
  );

  const diamondWeight = diamondWeightRaw
    ? String(diamondWeightRaw).includes('ct')
      ? String(diamondWeightRaw)
      : `${diamondWeightRaw} ct`
    : '';

  const dimUom = jd.dimensionUOM || 'mm';
  let dimensions = '';
  if (jd.width && jd.height && jd.thickness) {
    dimensions = `${jd.width} x ${jd.height} x ${jd.thickness} ${dimUom}`;
  } else if (jd.width && jd.height) {
    dimensions = `${jd.width} x ${jd.height} ${dimUom}`;
  } else if (jd.height) {
    dimensions = `${jd.height} ${dimUom}`;
  } else if (product?.height) {
    dimensions = `${product.height} mm (Height)`;
  } else if (details?.product?.height) {
    dimensions = `${details.product.height} mm (Height)`;
  } else {
    dimensions = findVal('dimension', 'height', 'dimensions', 'width');
  }

  const sizesAttr =
    product?.ringSize ||
    product?.availableSizes ||
    product?.size ||
    product?.sizes ||
    details?.product?.ringSize ||
    details?.product?.availableSizes ||
    details?.product?.size ||
    details?.ringSize ||
    details?.availableSizes ||
    details?.size ||
    findVal('ring size', 'available sizes', 'sizes', 'size');

  const availableSizes: string[] = sizesAttr
    ? Array.isArray(sizesAttr)
      ? sizesAttr.map(String).map(s => s.trim()).filter(Boolean)
      : String(sizesAttr)
          .split(/[,|\/\s]+/)
          .map(s => s.trim())
          .filter(Boolean)
    : [];

  const selectedSize = availableSizes.length > 0 ? availableSizes[0] : '';

  const sku =
    jd.productCode ||
    product?.sku ||
    product?.productCode ||
    product?.code ||
    product?.itemCode ||
    details?.product?.sku ||
    details?.product?.productCode ||
    details?.sku ||
    details?.productCode ||
    '';

  const goldParts = [goldPurity, goldType].filter(Boolean).join(' ');
  let summaryText = goldParts
    ? `Set in ${goldParts}${netWeight ? ` (${netWeight})` : ''}`
    : netWeight
    ? `Net wt: ${netWeight}`
    : '';
  if (hasDiamond) {
    const diamondParts = [diamondWeight, diamondClarity]
      .filter(Boolean)
      .join(', ');
    if (diamondParts) {
      summaryText += summaryText
        ? ` with diamonds (${diamondParts})`
        : `Diamonds (${diamondParts})`;
    }
  }

  return {
    goldPurity,
    goldType,
    netWeight,
    grossWeight,
    hasDiamond,
    diamondWeight,
    diamondClarity: diamondClarity || undefined,
    diamondCount: diamondCount || undefined,
    diamondSetting,
    dimensions,
    isRing,
    availableSizes,
    selectedSize,
    summaryText,
    sku,
  };
};

export const warrantyText = (details: any, product: any) => {
  const attrs =
    details?.attributes ||
    details?.productAttributes ||
    details?.product?.attributes ||
    product?.attributes ||
    [];

  if (Array.isArray(attrs)) {
    const attr = attrs.find((entry: any) =>
      String(entry?.attrName || entry?.name || entry?.label || '')
        .toLowerCase()
        .includes('warranty'),
    );
    if (attr?.attrValue || attr?.value) {
      return String(attr.attrValue || attr.value);
    }
  }

  const directWarranty =
    product?.warranty ||
    details?.product?.warranty ||
    details?.warranty;

  return directWarranty
    ? String(directWarranty)
    : 'Warranty details are not available for this product.';
};
