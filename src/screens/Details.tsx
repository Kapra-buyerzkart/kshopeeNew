import { RouteProp } from '@react-navigation/native';
import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/Buttons';
import { RootStackParamList } from '../types/types';
import { colors } from '../assets/theme/colours';
import { fonts } from '../assets/theme/typography';
import { AppIcons } from '../assets/icons';



type DetailsScreenRouteProps = RouteProp<RootStackParamList, 'Details'>;

type Props = {
    route: DetailsScreenRouteProps;
}
const DetailScreen: React.FC<Props> = ({ route }) => {
    const colour = colors;

    const { data, dataOne } = route.params;
    return (
        <View style={[styles.container, { backgroundColor: colour.background }]}>
            <Text style={fonts.h1}>{data}</Text>
            {
                dataOne.map((item) => (
                    <View key={item.id} style={{ marginVertical: 10, padding: 10, borderWidth: 1, borderColor: 'black', width: '90%' }}>
                        <Text style={fonts.h1}>
                            {item.id} - {item.username}
                        </Text>
                        <Text style={[fonts.h3]}>
                            {item.name}
                        </Text>
                        <Text style={[fonts.h3]}>
                            {item.email}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                            <Button
                                title='Go to List'
                                onPress={() => console.log('Button Pressed')}
                                type='secondary'
                                size='small'
                                textStyle={{ ...fonts.subtitle1, color: colour.text }}
                            />

                            <AppIcons.Person />
                            <Button
                                title='Go to List'
                                onPress={() => console.log('Button Pressed')}
                                type='secondary'
                                size='small'
                                textStyle={{ ...fonts.subtitle1, color: colour.text }}
                            />
                        </View>
                    </View>
                ))
            }

        </View>
    );
}

export default DetailScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // title: {
    //     ...useTypography().h1,
    //     fontSize: 20,
    // },
})


