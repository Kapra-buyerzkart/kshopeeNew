import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import { useNetworkStatus } from '../hooks/userNetworkStatus';
import { RootStackParamList } from '../types/types';
import { useGetEmployee } from '../api/queries/usePostQueries';
import { colors } from '../assets/theme/colours';
import { fonts } from '../assets/theme/typography';

import LoadingIndicator from '../components/LoadingIndicator';
import NetworkBanner from '../components/ShowOfflineMessage';
import { ListView } from '../components/ListView'; // Reusable ListView

const CheckApiScreen: React.FC = () => {
    const colour = colors;
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const isConnected = useNetworkStatus();

    const { data, isLoading, isFetching, error, refetch } = useGetEmployee();
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log('Connection type:', state.type);
            console.log('Is connected?', state.isConnected);
            console.log('Is internet reachable?', state.isInternetReachable);
        });

        return () => unsubscribe();
    }, []);

    useFocusEffect(
        useCallback(() => {
            if (!hasFetched) {
                refetch().then(() => setHasFetched(true));
            }
        }, [refetch, hasFetched])
    );

    if (isLoading || isFetching || !hasFetched) {
        return (
            <View style={[styles.container, { backgroundColor: colour.background }]}>
                <LoadingIndicator isVisible />
            </View>
        );
    }

    if (error || !data?.data) {
        return (
            <View style={[styles.container, { backgroundColor: colour.background }]}>
                <Text style={[fonts.h2]}>
                    Error fetching employees, {error?.message || 'Unknown error'}
                </Text>
            </View>
        );
    }

    // Wrap static data to return only once
    const fetchEmployees = async () => {
        return data?.data || [];
    };

    return (
        <View style={[styles.container, { backgroundColor: colour.background }]}>
            <Text style={fonts.h1}>Check API Screen</Text>
            <Text style={fonts.h1}>{isConnected ? 'Connected' : 'Not Connected'}</Text>
            {!isConnected && <NetworkBanner />}

            <ListView
                fetchData={() => fetchEmployees()}
                pageSize={data?.data.length ?? 10} // just return full list once
                keyExtractor={(item: any, index: number) => item.id.toString() + index}
                renderItem={({ item }) => (
                    <View style={[styles.cardExample, { backgroundColor: colour.card }]}>
                        <Text style={fonts.body1}>{item.employee_name}</Text>
                        <Text style={fonts.body2}>Age: {item.employee_age}</Text>
                        <Text style={fonts.body2}>Salary: ${item.employee_salary}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 16,
    },
    cardExample: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
    },
});

export default CheckApiScreen;
