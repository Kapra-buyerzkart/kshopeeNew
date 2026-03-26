import { useState, useCallback, useEffect } from 'react';
import { getDeliverySlotsApi } from '../api/services/cartService';
import { getDeliveryModesApi } from '../api/services/configService';

export const useDeliverySlot = () => {
    const [selectedDeliveryType, setSelectedDeliveryType] = useState<'express' | 'slot'>('express');
    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const [showSlotModal, setShowSlotModal] = useState(false);
    const [datesList, setDatesList] = useState<any[]>([]);
    const [slotsByDate, setSlotsByDate] = useState<any>({});
    const [deliveryMode, setDeliveryMode] = useState<'express' | 'slotted'>('express');
    const [deliveryModes, setDeliveryModes] = useState<any[]>([]);

    useEffect(() => {
        setDeliveryMode(selectedDeliveryType === 'slot' ? 'slotted' : 'express');
    }, [selectedDeliveryType]);

    // Fetch available delivery modes on mount
    useEffect(() => {
        const fetchDeliveryModes = async () => {
            try {
                const response = await getDeliveryModesApi();
                if (response?.success && response?.data) {
                    setDeliveryModes(response.data);
                }
            } catch (error) {
                console.error('Error fetching delivery modes:', error);
            }
        };
        fetchDeliveryModes();
    }, []);

    const fetchSlots = useCallback(async (pincodeAreaId?: number) => {
        try {
            const response = await getDeliverySlotsApi(pincodeAreaId);
            if (response && response.success) {
                // Logic to process slots into datesList and slotsByDate
                const slots = response.data || [];
                const dates: string[] = [];
                const grouped: any = {};

                slots.forEach((slot: any) => {
                    const date = slot.date?.split('T')[0];
                    if (!dates.includes(date)) {
                        dates.push(date);
                    }
                    if (!grouped[date]) {
                        grouped[date] = [];
                    }
                    grouped[date].push(slot);
                });

                setDatesList(dates);
                setSlotsByDate(grouped);
            }
        } catch (error) {
            console.error('Error fetching delivery slots:', error);
        }
    }, []);

    const onSelectDate = useCallback((date: string) => {
        // Logic to handle date selection
    }, []);

    return {
        deliveryMode,
        deliveryModes,
        selectedSlot,
        selectedDeliveryType,
        setSelectedDeliveryType,
        setSelectedSlot,
        showSlotModal,
        setShowSlotModal,
        datesList,
        slotsByDate,
        onSelectDate,
        fetchSlots
    };
};
