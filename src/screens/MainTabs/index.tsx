import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../assets/theme/colours';
import { Fonts as FONTS } from '../../assets/theme/fonts';

const MainTabs: React.FC = () => {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to Main Tabs (Dummy Screen)</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Main')}
            >
                <Text style={styles.buttonText}>Go to Real App (Bottom Tabs)</Text>
            </TouchableOpacity>
        </View>
    );
};

export default MainTabs;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
    text: {
        fontSize: 18,
        fontFamily: FONTS?.gilroySemiBold || 'System',
        color: colors.primary,
        marginBottom: 20,
    },
    button: {
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
    },
});
