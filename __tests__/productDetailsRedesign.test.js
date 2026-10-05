import React from 'react';
import renderer, { act } from 'react-test-renderer';

const PRODUCT_PAYLOAD = {
  success: true,
  data: {
    product: {
      productId: 501,
      prName: "Blueberry's Gas Stove - Glint 2b",
      shortDescription: 'Glasstop, Large 2B Gas Stove',
      description: '<p>Toughened glass top with brass burners.</p>',
      unitPrice: 7290,
      specialPrice: 3479,
      stockQty: 12,
    },
    images: [{ imageUrl: 'media/stove1.png' }, { imageUrl: 'media/stove2.png' }],
    attributes: [
      { attrId: 1, attrName: 'Brass Burners', attrValue: 'High efficiency' },
      { attrId: 2, attrName: 'Tough Glasstop', attrValue: 'Easy to clean' },
    ],
    ratingSummary: { avgRating: 4.5, ratingCount: 8, reviewCount: 3 },
    customerspecific: { cartQty: 0 },
  },
};

const RELATED_PAYLOAD = {
  success: true,
  data: {
    items: [
      {
        productId: 601,
        prName: 'Blueberrys Gas Stove - Glanza 3b',
        unitPrice: 7290,
        specialPrice: 2889,
        featuredImage: 'media/glanza.png',
      },
    ],
  },
};

jest.mock('react-native-simple-toast', () => ({ show: jest.fn(), SHORT: 0 }));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 59, bottom: 34, left: 0, right: 0 }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: jest.fn(), push: jest.fn() }),
  useIsFocused: () => true,
  useRoute: () => ({ params: { productId: '501' } }),
  useFocusEffect: effect => {
    const React2 = require('react');
    React2.useEffect(() => effect(), [effect]);
  },
}));

jest.mock('../src/kshope/api/services/productService', () => ({
  getProductDetails: jest.fn(() => Promise.resolve(PRODUCT_PAYLOAD)),
  getRelatedProductsApi: jest.fn(() => Promise.resolve(RELATED_PAYLOAD)),
}));

jest.mock('../src/kshope/api/services/cartService', () => ({
  addToCartApi: jest.fn(() => Promise.resolve({ success: true })),
  updateCartItemApi: jest.fn(() => Promise.resolve({ success: true })),
  removeFromCartApi: jest.fn(() => Promise.resolve({ success: true })),
}));

jest.mock('../src/kshope/globals/storage', () => ({
  getKshopeAreaId: jest.fn(() => Promise.resolve(10652)),
}));

jest.mock('../src/kshope/context/CartContext', () => ({
  useCart: () => ({ cartItems: [], cartSummary: {}, loadCart: jest.fn() }),
}));

jest.mock('../src/kshope/context/WishlistContext', () => ({
  useWishlist: () => ({ toggleWishlist: jest.fn(), isInWishlist: () => false }),
}));

jest.mock('../src/kshope/components/FloatingCartButton', () => {
  const React2 = require('react');
  const { View } = require('react-native');
  return { __esModule: true, default: () => React2.createElement(View) };
});

jest.mock('react-native-svg', () => {
  const React2 = require('react');
  const { View } = require('react-native');
  const Stub = props => React2.createElement(View, props, props.children);
  return { __esModule: true, default: Stub, Svg: Stub, Path: Stub };
});

const ProductDetailsRedesignScreen =
  require('../src/kshope/screens/Product/redesign/ProductDetailsRedesignScreen')
    .default;

const flatten = node => {
  if (node == null || typeof node === 'boolean') return [];
  if (typeof node === 'string' || typeof node === 'number')
    return [String(node)];
  if (Array.isArray(node)) return node.flatMap(flatten);
  return flatten(node.children);
};

const render = async () => {
  let tree;
  await act(async () => {
    tree = renderer.create(React.createElement(ProductDetailsRedesignScreen));
  });
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
  return tree;
};

const renderText = async () => flatten((await render()).toJSON()).join('\n');

describe('product details redesign screen', () => {
  it('renders the product name, subtitle and pricing from the api', async () => {
    const text = await renderText();
    expect(text).toContain("Blueberry's Gas Stove - Glint 2b");
    expect(text).toContain('₹3,479.00/-');
    expect(text).toContain('₹7,290.00/-');
    expect(text).toContain('You are saving ₹3,811.00/-');
  });

  it('renders the action row and savings', async () => {
    const text = await renderText();
    expect(text).toContain('ADD TO WISHLIST');
    expect(text).toContain('ADD TO BAG');
    expect(text).toContain('You are saving ₹3,811.00/-');
  });

  it('renders the trust strip', async () => {
    const text = await renderText();
    ['100% Quality', 'Certified Products', 'Easy Support', 'Secure Shopping'].forEach(
      label => expect(text).toContain(label),
    );
  });

  it('renders the description and attribute feature tiles', async () => {
    const text = await renderText();
    expect(text).toContain('PRODUCT DETAILS');
    expect(text).toContain('Toughened glass top with brass burners.');
    expect(text).toContain('Brass Burners');
    expect(text).toContain('High efficiency');
    expect(text).toContain('Tough Glasstop');
  });

  it('renders similar products from the related api', async () => {
    const text = await renderText();
    expect(text).toContain('Similar Products');
    expect(text).toContain('Blueberrys Gas Stove - Glanza 3b');
    expect(text).toContain('₹2,889/-');
    expect(text).toContain('60% OFF');
  });

  it('renders the action row with add to bag', async () => {
    const text = await renderText();
    expect(text).toContain('ADD TO BAG');
  });

  it('loads gallery images from the api', async () => {
    const tree = await render();
    const uris = [];
    const walk = node => {
      if (!node || typeof node !== 'object') return;
      if (Array.isArray(node)) return node.forEach(walk);
      if (node.props?.source?.uri) uris.push(node.props.source.uri);
      walk(node.children);
    };
    walk(tree.toJSON());
    expect(uris.some(uri => uri.includes('stove') || uri.includes('glanza'))).toBe(true);
  });
});
