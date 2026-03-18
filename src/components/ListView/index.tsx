import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    FlatList,
    Text,
    ActivityIndicator,
    RefreshControl,
    ListRenderItem,
    StyleProp,
    ViewStyle,
} from 'react-native';
import { getStyles } from './styles';
import { colors } from '../../assets/theme/colours';

interface ListViewProps<T> {
    fetchData: (page: number) => Promise<T[]>; // API fetching logic
    renderItem: ListRenderItem<T>;             // How to render each item
    keyExtractor: (item: T, index: number) => string;
    pageSize?: number;
    style?: StyleProp<ViewStyle>;
}

export const ListView = <T,>({
    fetchData,
    renderItem,
    keyExtractor,
    pageSize = 10,
    style,
}: ListViewProps<T>) => {
    const colour = colors;
    const styles = getStyles(colour);

    const [data, setData] = useState<T[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async (pageNum: number, isRefresh = false) => {
        if (loading) return;
        setLoading(true);
        setError(null);

        try {
            const result = await fetchData(pageNum);
            if (isRefresh) {
                setData(result);
            } else {
                setData((prev) => [...prev, ...result]);
            }

            setHasMore(result.length >= pageSize);
        } catch (err) {
            setError('Something went wrong');
        }

        setLoading(false);
        setRefreshing(false);
    }, [fetchData, loading, pageSize]);


    useEffect(() => {
        loadData(1);
    }, [loadData]);


    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        setPage(1);
        loadData(1, true);
    }, [loadData]);


    const handleLoadMore = useCallback(() => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadData(nextPage);
        }
    }, [loading, hasMore, page, loadData]);


    const renderFooter = useCallback(() => {
        return loading && !refreshing ? (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color={colour.primary} />
            </View>
        ) : null;
    }, [loading, refreshing, styles.footer, colour.primary]);


    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!loading && data.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={styles.emptyText}>No data available</Text>
            </View>
        );
    }

    return (
        <FlatList
            contentContainerStyle={style}
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.8}
            ListFooterComponent={renderFooter}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={[colour.primary]}
                />
            }
        />
    );
};
