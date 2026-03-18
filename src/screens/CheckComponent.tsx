import React, { useState } from 'react';
import uuid from 'react-native-uuid';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
} from 'react-native';

//import { NavigationProp, useNavigation } from '@react-navigation/native';
//import { RootStackParamList } from '../types/types';
import Button from '../components/Buttons';
import CustomAlert from '../components/Alert';
import ActionSheet from '../components/ActionSheet';
import CustomModal from '../components/Modal';
import LoadingIndicator from '../components/LoadingIndicator';
import Header from '../components/Header';
import ListItem from '../components/ListItem';
import Checkbox from '../components/CheckBox';
import { colors } from '../assets/theme/colours';
import { ListView } from '../components/ListView';
import { AppIcons } from '../assets/icons';
import { ActionSheetIOS } from 'react-native';
import { fonts } from '../assets/theme/typography';

const CheckComponentScreen: React.FC = () => {
    const colour = colors;

    //const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const [isModalVisible, setModalVisible] = useState<boolean>(false);
    const [isActionSheetVisible, setActionSheetVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isTermsChecked, setIsTermsChecked] = useState<boolean>(false);
    const [selectedContact, setSelectedContact] = useState<{
        id: string;
        name: string;
        phone: string;
        avatar: string;
    } | null>(null);

    const [isCustomAlertVisible, setIsCustomAlertVisible] = useState<boolean>(false);
    const [customAlertTitle, setCustomAlertTitle] = useState<string>('');
    const [customAlertMessage, setCustomAlertMessage] = useState<string>('');
    const [customAlertButtons, setCustomAlertButtons] = useState<
        { text: string; onPress: () => void; style?: 'cancel' | 'default' | 'destructive' }[]
    >([]);

    const showCustomAlert = (
        title: string,
        message: string,
        buttons?: { text: string; onPress: () => void; style?: 'cancel' | 'default' | 'destructive' }[]
    ) => {
        setCustomAlertTitle(title);
        setCustomAlertMessage(message);
        setCustomAlertButtons(
            buttons || [{ text: 'OK', onPress: () => setIsCustomAlertVisible(false) }]
        );
        setIsCustomAlertVisible(true);
    };


    const handleSimulateRequest = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            showCustomAlert('Request Complete', 'The simulated network request has finished.');
        }, 2000);
    };

    const handleTermsPress = () => {
        setIsTermsChecked(!isTermsChecked);
    };

    const handleSubmit = () => {
        if (isTermsChecked) {
            showCustomAlert('Success', 'You have agreed to the terms!');
        } else {
            showCustomAlert('Warning', 'Please agree to the terms to proceed.');
        }
    };

    const fetchDummyData = async (page: number) => {
        await new Promise<void>((res) => setTimeout(res, 1000));
        return Array.from({ length: 25 }, (_, i) => ({
            id: uuid.v4(),
            name: `Item ${page}-${i}`,
        }));
    };

    const contactData = [
        { id: '1', name: 'Alice Johnson', phone: '555-1234', avatar: 'https://i.pravatar.cc/100?u=a' },
        { id: '2', name: 'Bob Smith', phone: '555-5678', avatar: 'https://i.pravatar.cc/100?u=b' },
        { id: '3', name: 'Charlie Brown', phone: '555-9012', avatar: 'https://i.pravatar.cc/100?u=c' },
        { id: '4', name: 'Diana Prince', phone: '555-3456', avatar: 'https://i.pravatar.cc/100?u=d' },
        { id: '5', name: 'Ethan Hunt', phone: '555-7890', avatar: 'https://i.pravatar.cc/100?u=e' },
        { id: '6', name: 'Victor Johnson', phone: '555-9034', avatar: 'https://i.pravatar.cc/100?u=f' },
        { id: '7', name: 'Vince Smith', phone: '515-5678', avatar: 'https://i.pravatar.cc/100?u=g' },
        { id: '8', name: 'Rock Brown', phone: '575-9012', avatar: 'https://i.pravatar.cc/100?u=h' },
        { id: '9', name: 'Diana Mathew', phone: '455-3456', avatar: 'https://i.pravatar.cc/100?u=i' },
        { id: '10', name: 'John Hunt', phone: '553-7883', avatar: 'https://i.pravatar.cc/100?u=j' },
        { id: '11', name: 'Lucy Vince', phone: '555-1234', avatar: 'https://i.pravatar.cc/100?u=k' },
        { id: '12', name: 'Jack Watson', phone: '555-8578', avatar: 'https://i.pravatar.cc/100?u=l' },
        { id: '13', name: 'Shane Youth', phone: '555-9052', avatar: 'https://i.pravatar.cc/100?u=m' },
        { id: '14', name: 'Quil John', phone: '575-3456', avatar: 'https://i.pravatar.cc/100?u=n' },
        { id: '15', name: 'White Lins', phone: '555-7680', avatar: 'https://i.pravatar.cc/100?u=o' },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colour.background }]}>
            <Header
                title="My Contacts"
                leftContent={
                    <TouchableOpacity onPress={() => showCustomAlert('Menu Pressed', 'You pressed the menu button.')}>
                        <AppIcons.Menu />
                    </TouchableOpacity>
                }
                rightContent={
                    <TouchableOpacity onPress={() => showCustomAlert('Add Pressed', 'You pressed the add button.')}>
                        <AppIcons.Add />
                    </TouchableOpacity>
                }
            />

            <FlatList
                ListHeaderComponent={
                    <View style={{ backgroundColor: colour.background }}>
                        <Text style={fonts.h1}>Reusable Components (TS)</Text>

                        <Button title="Open Custom Modal" onPress={() => setModalVisible(true)} style={styles.buttonMargin} />
                        <Button title="Open Action Sheet" onPress={() => setActionSheetVisible(true)} style={styles.buttonMargin} />
                        <Button title="Simulate Request" onPress={handleSimulateRequest} disabled={isLoading} style={styles.buttonMargin} />

                        <View style={styles.buttonMargin}>
                            <Checkbox
                                label="I agree to the Terms of Service"
                                isChecked={isTermsChecked}
                                onPress={handleTermsPress}
                                color={colour.primary}
                            />
                            <Button
                                title="Submit"
                                onPress={handleSubmit}
                                style={styles.submitButton}
                                disabled={!isTermsChecked}
                            />
                        </View>

                        <Text style={fonts.h3}>Contact List</Text>
                    </View>
                }
                data={contactData}
                style={styles.list}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <ListItem
                        title={item.name}
                        subtitle={item.phone}
                        onPress={() => {
                            setSelectedContact(item);
                            //setIsUserVisible(true);
                            showCustomAlert(`The ${selectedContact?.name || 'Contact Details'}`, `This user id is ${item?.id} and this user mobile number is ${item?.phone}` || 'Contact Details',)
                        }}
                        leftContent={
                            <Image
                                source={{ uri: item.avatar }}
                                style={styles.avatar}
                            />
                        }
                        rightContent={<AppIcons.Forward />}
                    />
                )}
                ListFooterComponent={
                    <View style={{ backgroundColor: colour.background }}>
                        <Text style={fonts.h3}>Other List</Text>
                        <ListView
                            fetchData={fetchDummyData}
                            keyExtractor={(item) => String(item.id)}
                            renderItem={({ item }) => (
                                <ListItem title={item.name} />
                            )}
                        />
                    </View>
                }
            />

            <LoadingIndicator isVisible={isLoading} />

            <CustomModal isVisible={isModalVisible} onClose={() => setModalVisible(false)}>
                <Text style={styles.modalContent}>This is the content inside the custom modal!</Text>
                <Button title="Close" onPress={() => setModalVisible(false)} />
            </CustomModal>

            <ActionSheet isVisible={isActionSheetVisible} onClose={() => setActionSheetVisible(false)}>
                <View>
                    <Text>Hello world! This is a custom action sheet.</Text>
                    <ListView
                        fetchData={fetchDummyData}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <ListItem title={item.name} />
                        )}
                    />
                </View>
            </ActionSheet>



            <CustomAlert
                isVisible={isCustomAlertVisible}
                onClose={() => setIsCustomAlertVisible(false)}
                title={customAlertTitle}
                message={customAlertMessage}
                buttons={customAlertButtons}
            />
        </View>
    );
};

export default CheckComponentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    buttonMargin: {
        marginTop: 10,
    },
    submitButton: {
        marginTop: 30,
        width: '100%',
    },
    modalContent: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EFEFEF',
    },
    list: {
        backgroundColor: '#F7F7F7',
    },
});
