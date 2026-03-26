declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

declare module 'react-native-maps' {
  import { ComponentType } from 'react';
  const MapView: ComponentType<any>;
  export const Marker: ComponentType<any>;
  export type Region = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  export default MapView;
}

declare module 'react-native-google-places-autocomplete' {
  import { ComponentType } from 'react';
  export const GooglePlacesAutocomplete: ComponentType<any>;
}

declare module 'react-native-dropdown-picker' {
  import { ComponentType } from 'react';
  const DropDownPicker: ComponentType<any>;
  export default DropDownPicker;
}

declare module 'react-native-simple-toast' {
  const Toast: {
    show: (message: string, duration: number) => void;
    SHORT: number;
    LONG: number;
  };
  export default Toast;
}

declare module '@react-native-community/geolocation' {
  const Geolocation: {
    getCurrentPosition: (success: (position: any) => void, error?: (error: any) => void, options?: any) => void;
    requestAuthorization: () => void;
    watchPosition: (success: (position: any) => void, error?: (error: any) => void, options?: any) => number;
    clearWatch: (watchId: number) => void;
  };
  export default Geolocation;
}

declare module 'react-native-razorpay' {
  const RazorpayCheckout: {
    open: (options: Record<string, any>) => Promise<any>;
  };
  export default RazorpayCheckout;
}
