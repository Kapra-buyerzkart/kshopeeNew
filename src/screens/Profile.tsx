//import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../components/Card';
import { colors } from '../assets/theme/colours';
import '../i18n/i18n'; // Ensure i18n is initialized
import { useTranslation } from 'react-i18next';
import Button from '../components/Buttons';
import { useCommonStyles } from '../assets/styles';

const ProfileScreen: React.FC = () => {
    const colour = colors;
    const styles = useCommonStyles();
    //const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { t, i18n } = useTranslation();

    const changeLanguage = async (lng: string) => {
        await i18n.changeLanguage(lng);
    };



    return (
        <View style={styles.container}>
            <Text style={styles.headingTextStyle}>{t('welcome')}</Text>
            <Button title="English" onPress={() => changeLanguage('en')} textStyle={styles.buttonTextStyle} style={styles.confirmButton} />
            <Button title="हिंदी" onPress={() => changeLanguage('hi')} textStyle={styles.buttonTextStyle} style={styles.confirmButton} />

            <Card style={styles.cardExample}>
                <Text style={styles.cardTitle}>Example Card 2 Heading</Text>
                <Text style={styles.cardDescription}>
                    This is a simple card component. You can place any content inside it to group information together.
                </Text>

            </Card>

            <Card style={styles.cardExample}>
                <Text style={styles.cardTitle}>Example Card 3 Heading</Text>
                <Text style={styles.cardDescription}>
                    This is a simple card component. You can place any content inside it to group information together.
                </Text>
                <Text style={styles.cardTitle}>Example Card</Text>
                <Text style={styles.cardDescription}>
                    This is a simple card component. You can place any content inside it to group information together.
                </Text>
            </Card>
        </View>
    );

}

export default ProfileScreen;





