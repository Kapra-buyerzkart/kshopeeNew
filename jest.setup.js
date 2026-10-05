require('react-native-gesture-handler/jestSetup');

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@react-native-clipboard/clipboard', () =>
  require('@react-native-clipboard/clipboard/jest/clipboard-mock')
);

jest.mock('react-native-localize', () =>
  require('react-native-localize/mock')
);

jest.mock('@sbaiahmed1/react-native-blur', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    BlurView: props => React.createElement(View, props, props.children),
  };
});

jest.mock('react-native-keyboard-controller', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    KeyboardProvider: ({ children }) => React.createElement(View, null, children),
    KeyboardAvoidingView: ({ children, ...props }) => React.createElement(View, props, children),
    KeyboardAwareScrollView: ({ children, ...props }) => React.createElement(View, props, children),
    useKeyboardHandler: jest.fn(),
    useReanimatedKeyboardAnimation: () => ({ height: { value: 0 }, progress: { value: 0 } }),
    KeyboardController: {
      setInputMode: jest.fn(),
      setDefaultMode: jest.fn(),
      dismiss: jest.fn(),
    },
    useKeyboardController: () => ({ setEnabled: jest.fn() }),
  };
});

jest.mock('react-native-otp-verify', () => ({
  getHash: jest.fn(() => Promise.resolve([])),
  getOtp: jest.fn(() => Promise.resolve(true)),
  addListener: jest.fn(),
  removeListener: jest.fn(),
}));

jest.mock('react-native-razorpay', () => ({
  open: jest.fn(() => Promise.resolve({ razorpay_payment_id: 'pay_123' })),
}));

jest.mock('react-native-blob-util', () => ({
  fs: {
    dirs: { DocumentDir: '/mock/docs', DownloadDir: '/mock/downloads' },
    writeFile: jest.fn(() => Promise.resolve()),
  },
  config: jest.fn(() => ({
    fetch: jest.fn(() =>
      Promise.resolve({
        info: () => ({ status: 200 }),
        path: () => '/mock/file.pdf',
      }),
    ),
  })),
}));

jest.mock('react-native-google-places-autocomplete', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    GooglePlacesAutocomplete: props => React.createElement(View, props),
  };
});

jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
  stopObserving: jest.fn(),
  requestAuthorization: jest.fn(),
  setRNConfiguration: jest.fn(),
}));

jest.mock('@gorhom/bottom-sheet', () =>
  require('@gorhom/bottom-sheet/mock')
);

jest.mock('react-native-device-info', () =>
  require('react-native-device-info/jest/react-native-device-info-mock')
);

jest.mock('react-native-simple-toast', () => ({
  show: jest.fn(),
  showWithGravity: jest.fn(),
  showWithGravityAndOffset: jest.fn(),
  SHORT: 0,
  LONG: 1,
  TOP: 1,
  BOTTOM: 2,
  CENTER: 3,
}));

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(() => Promise.resolve(true)),
  getGenericPassword: jest.fn(() => Promise.resolve(false)),
  resetGenericPassword: jest.fn(() => Promise.resolve(true)),
}));

jest.mock('react-native-onesignal', () => ({
  OneSignal: {
    initialize: jest.fn(),
    Notifications: {
      requestPermission: jest.fn(() => Promise.resolve(true)),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    User: {
      addTag: jest.fn(),
      removeTag: jest.fn(),
      addAlias: jest.fn(),
      removeAlias: jest.fn(),
    },
  },
}));

jest.mock('./src/services/OneSignalService', () => ({
  requestPushPermissionIfNeeded: jest.fn(),
  setupOneSignal: jest.fn(),
}), { virtual: true });

jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockMapView = props => React.createElement(View, props, props.children);
  MockMapView.Marker = props => React.createElement(View, props, props.children);
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMapView.Marker,
  };
});

jest.mock('lottie-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  return props => React.createElement(View, props);
});

jest.mock('axios', () => {
  const createMockInstance = (config = {}) => {
    const requestHandlers = [];
    const responseHandlers = [];
    const instance = {
      defaults: {
        baseURL: config.baseURL || '',
        timeout: config.timeout,
        headers: { common: {}, ...(config.headers || {}) },
      },
      interceptors: {
        request: {
          use: jest.fn(fn => {
            requestHandlers.push({ fulfilled: fn });
            return requestHandlers.length - 1;
          }),
          eject: jest.fn(),
          handlers: requestHandlers,
        },
        response: {
          use: jest.fn(fn => {
            responseHandlers.push({ fulfilled: fn });
            return responseHandlers.length - 1;
          }),
          eject: jest.fn(),
          handlers: responseHandlers,
        },
      },
      get: jest.fn(() => Promise.resolve({ data: { success: true, data: [] } })),
      post: jest.fn(() => Promise.resolve({ data: { success: true, data: [] } })),
      put: jest.fn(() => Promise.resolve({ data: { success: true, data: [] } })),
      delete: jest.fn(() => Promise.resolve({ data: { success: true, data: [] } })),
      patch: jest.fn(() => Promise.resolve({ data: { success: true, data: [] } })),
    };
    return instance;
  };

  const defaultInstance = createMockInstance();
  defaultInstance.create = jest.fn(cfg => createMockInstance(cfg));
  return defaultInstance;
});

try {
  const ReactNativePrivateInterface = require('react-native/Libraries/ReactPrivate/ReactNativePrivateInterface');
  if (ReactNativePrivateInterface && typeof ReactNativePrivateInterface.getNativeTagFromPublicInstance !== 'function') {
    ReactNativePrivateInterface.getNativeTagFromPublicInstance = () => 1;
  }
} catch (e) {
  // Ignored if not found
}


