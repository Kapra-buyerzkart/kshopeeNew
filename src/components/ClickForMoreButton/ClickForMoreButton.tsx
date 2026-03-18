import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import styles from './styles';
import { colors } from '../../assets/theme/colours';

interface ClickForMoreButtonProps {
  onPress: () => void;
  title: string;
}

const ClickForMoreButton: React.FC<ClickForMoreButtonProps> = ({ onPress, title }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <View style={styles.contentRow}>
        <Text style={styles.buttonText}>{title}</Text>
        <Text style={styles.chevronText}>&gt;&gt;&gt;</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ClickForMoreButton;
