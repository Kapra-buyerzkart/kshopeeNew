import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { styles } from './styles';
import { colors } from '../../assets/theme/colours';

interface HomeSearchBarProps {
  placeholder?: string;
  onSearch?: (text: string) => void;
}

const HomeSearchBar: React.FC<HomeSearchBarProps> = ({ placeholder = "Search for Product...", onSearch }) => {
  return (
    <View style={styles.container}>
      {/* Figma exact match: The left icon is K in cyan */}
      <View style={styles.iconLeftContainer}>
        <Text style={styles.kIconText}>K</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.grey}
        onChangeText={onSearch}
      />
      {/* Figma exact match: The right icon is a mic surrounded by an oval/circle */}
      <TouchableOpacity style={styles.micButton}>
        <Text style={styles.micIconText}>🎤</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeSearchBar;
