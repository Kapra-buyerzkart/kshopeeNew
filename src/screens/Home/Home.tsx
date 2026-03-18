import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useCommonStyles } from '../../assets/styles';
import { colors } from '../../assets/theme/colours';
import Card from '../../components/Card';
import Button from '../../components/Buttons';
import { RootStackParamList } from '../../types/types';
import CustomGradientButton from '../../components/CustomGradientButton';


const HomeScreen: React.FC = () => {
  const styles = useCommonStyles();
  const colour = colors;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const data = [
    { id: 1, name: 'Name One', email: 'one@gmail.com', username: 'one_one' },
    { id: 2, name: 'Name Two', email: 'two@gmail.com', username: 'two_two' },
    { id: 3, name: 'Name Three', email: 'three@gmail.com', username: 'three_three' },
  ]


  const handGoCheckComponent = () => {
    navigation.navigate('CheckComponent', { data: 'Check data Passing', dataOne: data });
  }

  return (
    <View style={styles.container}>

      <View style={{ width: '100%', alignSelf: 'center' }}>
        <CustomGradientButton title="Continue" onPress={handGoCheckComponent} />
      </View>
    </View>
  );

}

export default HomeScreen;





