import React from 'react';
import renderer, { act } from 'react-test-renderer';

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockPush = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
    push: mockPush,
    canGoBack: jest.fn(() => true),
    dispatch: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
    removeListener: jest.fn(),
  }),
  useRoute: () => ({
    params: {
      productId: '501',
      orderId: 'ORD-12345',
      orderNumber: 'KND-98765',
      type: 'phone',
      contactValue: '9876543210',
      settingKeys: ['terms'],
      title: 'Terms of Use',
    },
  }),
  useIsFocused: () => true,
  useFocusEffect: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const React2 = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }: any) => children,
    SafeAreaView: ({ children, ...props }: any) =>
      React2.createElement(View, props, children),
    useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
    initialWindowMetrics: {
      frame: { x: 0, y: 0, width: 375, height: 812 },
      insets: { top: 44, left: 0, right: 0, bottom: 34 },
    },
  };
});

// Mock Application Contexts to make screen tests fast & deterministic
jest.mock('../src/kshope/context/UserContext', () => ({
  UserProvider: ({ children }: any) => children,
  useUser: () => ({
    profile: {
      custId: 123,
      custName: 'Kapra Customer',
      custPhone: '9876543210',
      custEmail: 'customer@kapragnd.com',
      gender: 'Male',
      dob: '1995-01-01',
    },
    setProfile: jest.fn(),
    loadProfile: jest.fn(() => Promise.resolve()),
  }),
}));

jest.mock('../src/kshope/context/WishlistContext', () => ({
  WishlistProvider: ({ children }: any) => children,
  useWishlist: () => ({
    wishlistItems: [],
    wishlistCount: 0,
    isInWishlist: () => false,
    toggleWishlist: jest.fn(),
    loadWishlist: jest.fn(() => Promise.resolve()),
  }),
}));

jest.mock('../src/kshope/context/CartContext', () => ({
  CartProvider: ({ children }: any) => children,
  useCart: () => ({
    cartItems: [],
    cartSummary: { totalAmount: 0, subtotal: 0, discount: 0 },
    cartCount: 0,
    selectedAddress: null,
    addresses: [],
    loadCart: jest.fn(() => Promise.resolve()),
    addToCart: jest.fn(),
    setQuantity: jest.fn(),
    removeFromCart: jest.fn(),
    setSelectedAddress: jest.fn(),
    refreshAddresses: jest.fn(() => Promise.resolve()),
  }),
}));

jest.mock('../src/context/CartContext', () => ({
  CartProvider: ({ children }: any) => children,
  useCart: () => ({
    showStatus: jest.fn(),
    cartItems: [],
    cartSummary: { totalAmount: 0 },
    cartCount: 0,
    addToCart: jest.fn(),
  }),
  useCartActions: () => ({
    addToCart: jest.fn(),
  }),
  useCartEntry: () => null,
}));

jest.mock('../src/context/WishlistContext', () => ({
  WishlistProvider: ({ children }: any) => children,
  useWishlist: () => ({
    wishlistItems: [],
    wishlistCount: 0,
    isInWishlist: () => false,
    toggleWishlist: jest.fn(),
  }),
  useWishlistActions: () => ({
    toggleWishlist: jest.fn(),
  }),
  useWishlistIds: () => new Set(),
}));

jest.mock('../src/kshope/context/AlertContext', () => ({
  AlertProvider: ({ children }: any) => children,
  useAlert: () => ({ showAlert: jest.fn() }),
  useCustomAlert: () => ({ showAlert: jest.fn() }),
}));

jest.mock('../src/kshope/context/loaderContext', () => {
  const React2 = require('react');
  return {
    LoaderContextProvider: ({ children }: any) => children,
    LoaderContext: React2.createContext({
      showLoader: jest.fn(),
      loading: false,
    }),
  };
});

jest.mock('../src/context/loaderContext', () => {
  const React2 = require('react');
  return {
    LoaderContext: React2.createContext({
      showLoader: jest.fn(),
      loading: false,
    }),
    LoaderProvider: ({ children }: any) => children,
  };
});

jest.mock('../src/context/appContext', () => {
  const React2 = require('react');
  return {
    AppContext: React2.createContext({
      profile: {
        custId: 123,
        custName: 'Kapra Customer',
        phone: '9876543210',
        email: 'customer@kapragnd.com',
      },
      loadProfile: jest.fn(),
      isStoreUnavailable: false,
      generalSettings: {},
      isUpdateModalVisible: false,
      setIsUpdateModalVisible: jest.fn(),
      updateInfo: null,
    }),
    AppContextProvider: ({ children }: any) => children,
  };
});

// Mock services
jest.mock('../src/kshope/api/services/productService', () => ({
  getProductDetails: jest.fn(() =>
    Promise.resolve({
      success: true,
      data: {
        product: {
          productId: 501,
          prName: 'Gold Necklace 22K',
          unitPrice: 50000,
          specialPrice: 45000,
          stockQty: 5,
        },
        images: [{ imageUrl: 'media/necklace.png' }],
        attributes: [],
      },
    }),
  ),
  getRelatedProductsApi: jest.fn(() =>
    Promise.resolve({ success: true, data: { items: [] } }),
  ),
  searchProductsApi: jest.fn(() =>
    Promise.resolve({ success: true, data: { items: [], total: 0 } }),
  ),
  getCategoriesApi: jest.fn(() =>
    Promise.resolve({
      success: true,
      data: [{ catId: 1, catName: 'Gold Chains', image: 'media/chain.png' }],
    }),
  ),
}));

jest.mock('../src/kshope/api/services/cartService', () => ({
  getCartApi: jest.fn(() =>
    Promise.resolve({
      success: true,
      data: { cartItems: [], cartSummary: { totalAmount: 0 } },
    }),
  ),
  addToCartApi: jest.fn(() => Promise.resolve({ success: true })),
  updateCartItemApi: jest.fn(() => Promise.resolve({ success: true })),
  removeFromCartApi: jest.fn(() => Promise.resolve({ success: true })),
  getAvailableCouponsApi: jest.fn(() =>
    Promise.resolve({ success: true, data: { items: [] } }),
  ),
  getAvailableGiftCardsApi: jest.fn(() =>
    Promise.resolve({ success: true, data: { items: [] } }),
  ),
  getDeliverySlotsApi: jest.fn(() =>
    Promise.resolve({ success: true, data: [] }),
  ),
}));

jest.mock('../src/kshope/api/services/orderService', () => ({
  getMyOrdersApi: jest.fn(() =>
    Promise.resolve({ success: true, data: [] }),
  ),
  getOrderListApi: jest.fn(() =>
    Promise.resolve({ success: true, data: { items: [] } }),
  ),
  getOrderDetailsApi: jest.fn(() =>
    Promise.resolve({ success: true, data: { orderId: 'ORD-12345', items: [] } }),
  ),
  reorderApi: jest.fn(() => Promise.resolve({ success: true })),
}));

jest.mock('../src/kshope/api/services/wishlistService', () => ({
  getWishlistApi: jest.fn(() =>
    Promise.resolve({ success: true, data: { items: [] } }),
  ),
  getWishlistIdsApi: jest.fn(() => Promise.resolve({ success: true, data: [] })),
  addToWishlistApi: jest.fn(() => Promise.resolve({ success: true })),
  removeFromWishlistApi: jest.fn(() => Promise.resolve({ success: true })),
}));

jest.mock('../src/kshope/api/services/addressService', () => ({
  getAddressListApi: jest.fn(() => Promise.resolve({ success: true, data: [] })),
  addAddressApi: jest.fn(() => Promise.resolve({ success: true })),
  updateAddressApi: jest.fn(() => Promise.resolve({ success: true })),
  deleteAddressApi: jest.fn(() => Promise.resolve({ success: true })),
}));

jest.mock('../src/kshope/api/services/userService', () => ({
  getProfile: jest.fn(() =>
    Promise.resolve({
      success: true,
      data: {
        custId: 123,
        custName: 'Kapra Customer',
        custPhone: '9876543210',
        custEmail: 'customer@kapragnd.com',
      },
    }),
  ),
  getWalletDataApi: jest.fn(() =>
    Promise.resolve({ success: true, data: { coins: 150 } }),
  ),
  getBCoinValueChangesApi: jest.fn(() =>
    Promise.resolve({ success: true, data: [] }),
  ),
  getReferralHistoryApi: jest.fn(() =>
    Promise.resolve({ success: true, data: [] }),
  ),
  redeemBCoinsApi: jest.fn(() => Promise.resolve({ success: true })),
  verifyEmailOtpApi: jest.fn(() => Promise.resolve({ success: true })),
  verifyPhoneOtpApi: jest.fn(() => Promise.resolve({ success: true })),
  requestPhoneOtpApi: jest.fn(() => Promise.resolve({ success: true })),
  requestEmailOtpApi: jest.fn(() => Promise.resolve({ success: true })),
  getGeneralSettingsApi: jest.fn(() =>
    Promise.resolve({ success: true, data: [] }),
  ),
}));

jest.mock('../src/api/userService', () => ({
  getGeneralSettingsApi: jest.fn(() => Promise.resolve({ success: true, data: [] })),
  getWalletDataApi: jest.fn(() => Promise.resolve({ success: true, data: { coins: 150 } })),
  redeemBCoinsApi: jest.fn(() => Promise.resolve({ success: true })),
  updateProfileApi: jest.fn(() => Promise.resolve({ success: true })),
  updateProfilePatchApi: jest.fn(() => Promise.resolve({ success: true })),
  changePasswordApi: jest.fn(() => Promise.resolve({ success: true })),
  requestEmailOtpApi: jest.fn(() => Promise.resolve({ success: true })),
  verifyEmailOtpApi: jest.fn(() => Promise.resolve({ success: true })),
  getDashboardDataApi: jest.fn(() => Promise.resolve({ success: true, data: {} })),
}));

jest.mock('../src/api', () => ({
  getProfile: jest.fn(() =>
    Promise.resolve({
      success: true,
      data: { custId: 123, custName: 'Kapra Customer' },
    }),
  ),
  loginUser: jest.fn(() => Promise.resolve({ success: true })),
  sendRegisterOtp: jest.fn(() => Promise.resolve({ success: true })),
  verifyOtp: jest.fn(() => Promise.resolve({ success: true })),
  sendForgotOtp: jest.fn(() => Promise.resolve({ success: true })),
  changePassword: jest.fn(() => Promise.resolve({ success: true })),
}));

jest.mock('../src/api/supportService', () => ({
  getSupportTicketsApi: jest.fn(() => Promise.resolve({ success: true, data: [] })),
}));

jest.mock('../src/kshope/globals/storage', () => ({
  getKshopeAreaId: jest.fn(() => Promise.resolve(10652)),
  getSelectedAddressId: jest.fn(() => Promise.resolve(null)),
  setSelectedAddressId: jest.fn(() => Promise.resolve()),
  setKshopeAreaId: jest.fn(() => Promise.resolve()),
  getCachedProfile: jest.fn(() =>
    Promise.resolve({ custId: 123, custName: 'Kapra Customer' }),
  ),
  setCachedProfile: jest.fn(() => Promise.resolve()),
  KSHOPE_KEYS: {
    AREA_ID: 'area_id',
    SELECTED_ADDRESS_ID: 'selected_address_id',
  },
}));

jest.mock('../src/kshope/screens/Home/redesign/data/useHomeData', () => ({
  useHomeData: () => ({
    loading: false,
    refreshing: false,
    onRefresh: jest.fn(),
    sections: {
      header: { address: 'Kochi, Kerala' },
      featured: [],
      secondStrip: [],
      thirdStrip: [],
      occasions: [],
      banners: { main: [], top: [], mid: [], bottom: [] },
    },
    homeData: { featuredCategories: [] },
  }),
}));

// Import Screens
import SplashScreen from '../src/screens/SplashScreen';
import LoginScreen from '../src/screens/LoginScreen';
import LoginPwdScreen from '../src/screens/LoginPwdScreen';
import RegistrationScreen from '../src/screens/RegistrationScreen';
import OtpScreen from '../src/screens/OtpScreen';
import ChangePwdScreen from '../src/screens/ChangePwdScreen';
import ChangePasswordScreen from '../src/screens/ChangePasswordScreen';

import HomeRedesignScreen from '../src/kshope/screens/Home/redesign/HomeRedesignScreen';
import CategoryRedesignScreen from '../src/kshope/screens/Category/redesign/CategoryRedesignScreen';
import ProductDetailsRedesignScreen from '../src/kshope/screens/Product/redesign/ProductDetailsRedesignScreen';
import ProductCategoryDetailScreen from '../src/kshope/screens/Product/ProductCategoryDetailScreen';
import KshopeUnavailable from '../src/kshope/screens/KshopeUnavailable';
import CartScreen from '../src/kshope/screens/Cart/CartScreen';
import WishlistScreen from '../src/kshope/screens/Wishlist/WishlistScreen';
import SearchScreen from '../src/kshope/screens/Search/SearchScreen';

import MyOrdersRedesignScreen from '../src/kshope/screens/Order/redesign/MyOrdersRedesignScreen';
import MyOrderDetailsScreen from '../src/kshope/screens/Order/MyOrderDetailsScreen';
import OrderSuccessScreen from '../src/kshope/screens/Order/OrderSuccessScreen';
import OrderFailedScreen from '../src/kshope/screens/Order/OrderFailedScreen';
import OrderPendingScreen from '../src/kshope/screens/Order/OrderPendingScreen';

import ProfileScreenKshope from '../src/kshope/screens/Profile/ProfileScreen';
import ProfileScreenMain from '../src/screens/ProfileScreen/ProfileScreen';
import EditProfileScreen from '../src/kshope/screens/Profile/EditProfileScreen';
import UpdateContactScreen from '../src/kshope/screens/Profile/UpdateContactScreen';
import UpdateContactOtpScreen from '../src/kshope/screens/Profile/UpdateContactOtpScreen';

import SavedAddressScreen from '../src/kshope/screens/SavedAddress/SavedAddressScreen';
import AddLocationScreen from '../src/kshope/screens/AddLocation/AddLocationScreen';

import BCoinScreen from '../src/kshope/screens/BCoin/BCoinScreen';
import ReferralScreen from '../src/kshope/screens/Referral/ReferralScreen';
import ShopWithUsScreen from '../src/kshope/screens/ShopWithUs/ShopWithUsScreen';
import LegalContentScreen from '../src/kshope/screens/Legal/LegalContentScreen';
import TermsOfUseScreen from '../src/screens/TermsOfUseScreen';
import SupportTicketsListScreen from '../src/screens/SupportTicketsListScreen';
import NoNetworkScreen from '../src/screens/NoNetworkScreen/NoNetworkScreen';

let activeTrees: any[] = [];

const renderScreen = (Component: React.ComponentType<any>, props = {}) => {
  let tree: any;
  act(() => {
    tree = renderer.create(<Component {...props} />);
  });
  activeTrees.push(tree);
  return tree;
};

describe('Gold & Diamond Application - Screen Tests for Every Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    while (activeTrees.length > 0) {
      const t = activeTrees.pop();
      try {
        act(() => {
          t?.unmount();
        });
      } catch {}
    }
  });

  describe('1. Splash & Onboarding Screens', () => {
    it('renders SplashScreen correctly', async () => {
      const onFinish = jest.fn();
      const tree = await renderScreen(SplashScreen, {
        isReady: true,
        onFinish,
      });
      expect(tree.toJSON()).toBeTruthy();
    });
  });

  describe('2. Authentication & Security Screens', () => {
    it('renders LoginScreen without errors', async () => {
      const tree = await renderScreen(LoginScreen);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders LoginPwdScreen without errors', async () => {
      const tree = await renderScreen(LoginPwdScreen);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders RegistrationScreen without errors', async () => {
      const tree = await renderScreen(RegistrationScreen);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders OtpScreen without errors', async () => {
      const tree = await renderScreen(OtpScreen);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders ChangePwdScreen without errors', async () => {
      const tree = await renderScreen(ChangePwdScreen);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders ChangePasswordScreen without errors', async () => {
      const tree = await renderScreen(ChangePasswordScreen);
      expect(tree.toJSON()).toBeTruthy();
    });
  });

  describe('3. Main Shopping & Discovery Screens', () => {
    it('renders Gold & Diamond HomeRedesignScreen', async () => {
      const tree = await renderScreen(HomeRedesignScreen);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders CategoryRedesignScreen', async () => {
      const tree = await renderScreen(CategoryRedesignScreen);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders ProductDetailsRedesignScreen', async () => {
      const tree = await renderScreen(ProductDetailsRedesignScreen);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders CartScreen (Shopping Bag)', async () => {
      const tree = await renderScreen(CartScreen);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders WishlistScreen', async () => {
      const tree = await renderScreen(WishlistScreen);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders SearchScreen', async () => {
      const tree = await renderScreen(SearchScreen);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders ProductCategoryDetailScreen', async () => {
      const tree = await renderScreen(ProductCategoryDetailScreen);
      expect(tree.toJSON()).toBeTruthy();
    });
  });

  describe('4. Order Management Screens', () => {
    it('renders MyOrdersRedesignScreen', async () => {
      const tree = await renderScreen(MyOrdersRedesignScreen);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders MyOrderDetailsScreen', async () => {
      const tree = await renderScreen(MyOrderDetailsScreen);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders OrderSuccessScreen', async () => {
      const tree = await renderScreen(OrderSuccessScreen);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders OrderFailedScreen', async () => {
      const tree = await renderScreen(OrderFailedScreen);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders OrderPendingScreen', async () => {
      const tree = await renderScreen(OrderPendingScreen);
      expect(tree.toJSON()).toBeTruthy();
    });
  });

  describe('5. Profile & Account Screens', () => {
    it('renders ProfileScreen (Kshope Luxury)', async () => {
      const tree = await renderScreen(ProfileScreenKshope);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders ProfileScreen (Main)', async () => {
      const tree = await renderScreen(ProfileScreenMain);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders EditProfileScreen', async () => {
      const tree = await renderScreen(EditProfileScreen);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders UpdateContactScreen', async () => {
      const tree = await renderScreen(UpdateContactScreen);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders UpdateContactOtpScreen', async () => {
      const tree = await renderScreen(UpdateContactOtpScreen);
      expect(tree.toJSON()).toBeTruthy();
    });
  });

  describe('6. Address & Location Screens', () => {
    it('renders SavedAddressScreen', async () => {
      const tree = await renderScreen(SavedAddressScreen);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders AddLocationScreen', async () => {
      const tree = await renderScreen(AddLocationScreen);
      expect(tree.toJSON()).toBeTruthy();
    });
  });

  describe('7. Rewards, Affiliate & Loyalty Screens', () => {
    it('renders BCoinScreen (Kapra Coins)', async () => {
      const tree = await renderScreen(BCoinScreen);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders ReferralScreen', async () => {
      const tree = await renderScreen(ReferralScreen);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders ShopWithUsScreen', async () => {
      const tree = await renderScreen(ShopWithUsScreen);
      expect(tree.toJSON()).toBeTruthy();
    });
  });

  describe('8. Legal, Support & Network Screens', () => {
    it('renders LegalContentScreen', async () => {
      const tree = await renderScreen(LegalContentScreen);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders TermsOfUseScreen', async () => {
      const tree = await renderScreen(TermsOfUseScreen);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders SupportTicketsListScreen', async () => {
      const tree = await renderScreen(SupportTicketsListScreen);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders NoNetworkScreen', async () => {
      const tree = await renderScreen(NoNetworkScreen);
      expect(tree.toJSON()).toBeTruthy();
    });

    it('renders KshopeUnavailable', async () => {
      const tree = await renderScreen(KshopeUnavailable);
      expect(tree.toJSON()).toBeTruthy();
    });
  });
});
