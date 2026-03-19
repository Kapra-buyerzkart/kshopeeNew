import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';

interface TermsCheckBoxProps {
    isChecked: boolean;
    onPress: () => void;
    onTermsPress?: () => void;
}

const TermsCheckBox: React.FC<TermsCheckBoxProps> = ({ isChecked, onPress, onTermsPress }) => {
    return (
        <View style={styles.termsAndConditionsContainer}>
            <TouchableOpacity onPress={onPress} style={styles.termsAndConditionsRadioOuter} activeOpacity={0.7}>
                {isChecked && (
                    <View style={styles.termsAndConditionsRadioInner} />
                )}
            </TouchableOpacity>
            <Text style={styles.agreeText}>I have read and agree to</Text>
            <TouchableOpacity onPress={onTermsPress} activeOpacity={0.7}>
                <Text style={styles.termsAndConditionsText}>
                    Terms and conditions<Text style={styles.mandatoryStar}>*</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default TermsCheckBox;
