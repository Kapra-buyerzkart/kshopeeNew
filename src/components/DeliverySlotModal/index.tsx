import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from '../../styles/typography';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useCartScreen } from '../../hooks/useCartScreen';

const DeliverySlotModal = ({ visible, onClose, onSelectSlot }: any) => {
    const { datesList, slotsByDate } = useCartScreen();
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);

    const activeDate = datesList[selectedDateIndex];
    const availableSlots = activeDate ? slotsByDate[activeDate.value] || [] : [];

    const handleSelectSlot = (slot: any) => {
        onSelectSlot({
            ...slot,
            date: activeDate.value,
            dateDisplay: activeDate.display,
            slotDisplay: slot.display || slot.slotValue
        });
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Select Delivery Slot</Text>
                        <TouchableOpacity onPress={onClose}>
                            <AntDesign name="close" size={wp('6%')} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateList}>
                        {datesList.map((date, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.dateItem, selectedDateIndex === index && styles.selectedDate]}
                                onPress={() => setSelectedDateIndex(index)}
                            >
                                <Text style={[styles.dateText, selectedDateIndex === index && styles.selectedDateText]}>{date.display}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <ScrollView style={styles.slotList}>
                        {availableSlots.length > 0 ? (
                            availableSlots.map((slot: any, index: number) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.slotItem}
                                    onPress={() => handleSelectSlot(slot)}
                                >
                                    <Text style={styles.slotText}>{slot.display || slot.slotValue}</Text>
                                    <AntDesign name="right" size={wp('4%')} color="#CCC" />
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.emptySlots}>
                                <Text style={styles.emptyText}>No slots available for this date</Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    content: { backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25, height: hp('60%'), padding: wp('5%') },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp('2%') },
    title: { fontFamily: FONTS.poppins.semiBold, fontSize: wp('4.5%'), color: '#000' },
    dateList: { flexGrow: 0, marginBottom: hp('2%') },
    dateItem: { paddingHorizontal: wp('4%'), paddingVertical: hp('1%'), borderRadius: 20, marginRight: wp('3%'), backgroundColor: '#F5F5F5' },
    selectedDate: { backgroundColor: '#F25000' },
    dateText: { fontFamily: FONTS.outfit.medium, fontSize: wp('3.5%'), color: '#757575' },
    selectedDateText: { color: '#FFF' },
    slotList: { flex: 1 },
    slotItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: hp('2%'), borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    slotText: { fontFamily: FONTS.poppins.medium, fontSize: wp('3.8%'), color: '#000' },
    emptySlots: { alignItems: 'center', marginTop: hp('5%') },
    emptyText: { fontFamily: FONTS.outfit.regular, fontSize: wp('3.8%'), color: '#999' },
});

export default DeliverySlotModal;
