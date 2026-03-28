import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { getAddressListApi, deleteAddressApi } from '../api/services/addressService';
import Toast from 'react-native-simple-toast';

interface AddressItem {
    id: string | number;
    type: string;
    address: string;
    phone: string;
    pin: string;
    selected: boolean;
    threeDotsClicked: boolean;
    pincodeAreaId?: number;
    raw: any;
}

export const useAddresses = () => {
    const [addresses, setAddresses] = useState<AddressItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [addressConfirmationData, setAddressConfirmationData] = useState<any>(null);

    const refreshAddresses = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await getAddressListApi();
            if (response && response.success && Array.isArray(response.data)) {
                const formatted: AddressItem[] = response.data.map((addr: any, index: number) => {
                    // The backend uses custAddressId as the primary unique identifier
                    const actualId = addr.custAddressId ?? addr.addressId ?? addr.id ?? index;

                    return {
                        id: actualId,
                        type: addr.addressType === 'HOME' ? 'Home'
                            : addr.addressType === 'OFFICE' ? 'Office'
                                : addr.addressType || 'Other',
                        address: [addr.addLine1, addr.addLine2, addr.landmark].filter(Boolean).join(', '),
                        phone: addr.phone || '',
                        pin: addr.pincode || '',
                        selected: addr.isDefaultShippingAddress || false,
                        threeDotsClicked: false,
                        pincodeAreaId: addr.pincodeAreaId,
                        raw: addr,
                    };
                });
                setAddresses(formatted);
            }
        } catch (error) {
            console.error('Error refreshing addresses:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const onSelectAddress = useCallback((id: string | number, _showConfirmation: boolean) => {
        setAddresses(prev =>
            prev.map(addr => ({
                ...addr,
                selected: addr.id === id,
                threeDotsClicked: false,
            }))
        );
        // Optionally show confirmation
        const selectedAddr = addresses.find(a => a.id === id);
        if (selectedAddr) {
            setAddressConfirmationData({
                pincode: selectedAddr.pin,
                areaName: selectedAddr.raw?.pincodeAreaName || '',
                isServiceable: true,
                isPlacingOrder: false,
            });
        }
    }, [addresses]);

    const onThreeDotsClicked = useCallback((id: string | number) => {
        setAddresses(prev =>
            prev.map(addr => ({
                ...addr,
                threeDotsClicked: addr.id === id,
            }))
        );
    }, []);

    const onCloseThreeDots = useCallback(() => {
        setAddresses(prev =>
            prev.map(addr => ({
                ...addr,
                threeDotsClicked: false,
            }))
        );
    }, []);

    const onDeleteClicked = useCallback((id: string | number) => {
        Alert.alert(
            'Delete Address',
            'Are you sure you want to delete this address?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await deleteAddressApi(id);
                            if (response && response.success !== false) {
                                Toast.show('Address deleted', Toast.SHORT);
                                await refreshAddresses();
                            } else {
                                Toast.show(response?.message || 'Failed to delete', Toast.SHORT);
                            }
                        } catch (error) {
                            console.error('Error deleting address:', error);
                            Toast.show('Error deleting address', Toast.SHORT);
                        }
                    },
                },
            ]
        );
    }, [refreshAddresses]);

    return {
        addresses,
        isLoading,
        refreshAddresses,
        onSelectAddress,
        onThreeDotsClicked,
        onDeleteClicked,
        onCloseThreeDots,
        addressConfirmationData,
        setAddressConfirmationData,
    };
};
