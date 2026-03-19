import React from 'react';
import { View, TextInput, TouchableOpacity, Text, Image } from 'react-native';
import { styles } from './styles';
import { colors } from '../../assets/theme/colours';
import { AppIcons } from '../../assets/icons';

interface HomeSearchBarProps {
  placeholder?: string;
  onSearch?: (text: string) => void;
}

const HomeSearchBar: React.FC<HomeSearchBarProps> = ({ placeholder = "Search for Product...", onSearch }) => {
  return (
    <View style={styles.searchBarContainer}>
      {/* Figma exact match: The left icon is K in cyan */}
      <View style={styles.iconLeftContainer}>
        <Image source={require('../../assets/images/home/k_symbol.png')} style={styles.kIcon} />
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.black}
        onChangeText={onSearch}
      />
      {/* Figma exact match: The right icon is a mic surrounded by an oval/circle */}
      <TouchableOpacity >
        <AppIcons.Microphone color={colors.black} size={20} />
      </TouchableOpacity>
    </View>
  );
};

export default HomeSearchBar;
