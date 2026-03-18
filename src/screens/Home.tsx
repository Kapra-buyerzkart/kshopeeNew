import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useCommonStyles } from '../assets/styles';
import { colors } from '../assets/theme/colours';
import Card from '../components/Card';
import Button from '../components/Buttons';
import { RootStackParamList } from '../types/types';
import CustomGradientButton from '../components/CustomGradientButton';


const HomeScreen: React.FC = () => {
  const styles = useCommonStyles();
  const colour = colors;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const data = [
    { id: 1, name: 'Name One', email: 'one@gmail.com', username: 'one_one' },
    { id: 2, name: 'Name Two', email: 'two@gmail.com', username: 'two_two' },
    { id: 3, name: 'Name Three', email: 'three@gmail.com', username: 'three_three' },
  ]

  const handGoDetails = () => {
    navigation.navigate('Details', { data: 'Check data Passing', dataOne: data });
  }
  const handGoCheckComponent = () => {
    navigation.navigate('CheckComponent', { data: 'Check data Passing', dataOne: data });
  }
  const handGoCheckApiScreen = () => {
    navigation.navigate('CheckApiScreen');
  }

  return (
    <View style={styles.container}>
      {/* <Card style={styles.cardExample}>
        <Text style={styles.cardTitle}>Example Card Heading</Text>
        <Text style={styles.cardDescription}>
          This is a simple card component. You can place any content inside it to group information together.
        </Text>

        <Text style={styles.cardDescription}>
          This is a simple card component. You can place any content inside it to group information together.
        </Text>
      </Card>
      <View style={styles.buttonContainer}>
        <Button title="Go to Details" onPress={handGoDetails} textStyle={styles.buttonTextStyle} style={styles.confirmButton} />
        <Button title="Go to Components" onPress={handGoCheckComponent} textStyle={styles.buttonTextStyle} style={styles.confirmButton} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Go to Check API" onPress={handGoCheckApiScreen} textStyle={styles.buttonTextStyle} style={styles.confirmButton} />
      </View> */}
      <View style={{ width: '100%', alignSelf: 'center' }}>
        <CustomGradientButton title="Continue" onPress={handGoCheckComponent} />
      </View>
    </View>
  );

}

export default HomeScreen;





