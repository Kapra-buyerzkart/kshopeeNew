import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { styles } from './styles';
import { colors } from '../../assets/theme/colours';
import { AppIcons } from '../../assets/icons';
import { useNavigation } from '@react-navigation/native';

interface HomeSearchBarProps {
  placeholder?: string;
  onPress?: () => void;
}

const HomeSearchBar: React.FC<HomeSearchBarProps> = ({
  placeholder = 'Search for Product...',
  onPress,
}) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.searchBarContainer}
      onPress={onPress || (() => navigation.navigate('SearchScreen'))}
    >
      {/* Figma exact match: The left icon is K in cyan */}
      <View style={styles.iconLeftContainer}>
        <Image
          source={require('../../assets/images/home/k_symbol.png')}
          style={styles.kIcon}
        />
      </View>
      <View style={[styles.input, { justifyContent: 'center' }]}>
        <Text style={{ color: colors.black }}>{placeholder}</Text>
      </View>
      {/* Figma exact match: The right icon is a mic surrounded by an oval/circle */}
      {/* <TouchableOpacity onPress={() => {}}>
        <AppIcons.Microphone color={colors.black} size={20} />
      </TouchableOpacity> */}
    </TouchableOpacity>
  );
};

export default HomeSearchBar;
