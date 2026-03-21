import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import { styles } from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../assets/theme/colours';
import { useNavigation } from '@react-navigation/native';
import { topFilters, subCategories, productsData } from './dummyData';
import { AppIcons } from '../../assets/icons';
import { Rating } from 'react-native-ratings';

const CategoryScreen = () => {
    const navigation = useNavigation();
    const [selectedTopFilter, setSelectedTopFilter] = useState('1');
    const [selectedSubCategory, setSelectedSubCategory] = useState(subCategories['1'][0]?.id || '');

    const handleTopFilterPress = (id: string) => {
        setSelectedTopFilter(id);
        const subs = subCategories[id] || [];
        if (subs.length > 0) {
            setSelectedSubCategory(subs[0].id);
        } else {
            setSelectedSubCategory('');
        }
    };

    const renderProduct = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.exploreItemCard}>
            <View style={styles.exploreTopBadgesRow}>
                <View style={styles.discountCircle}>
                    <Text style={[styles.discountCircleText]}>{item.discount}</Text>
                </View>
                <AppIcons.BookmarkOutline color={colors.tealIconFont} size={24} />
            </View>

            <Image source={item.image} style={styles.exploreItemImage} />

            <View style={{ padding: 8 }}>
                <Text style={[styles.caption]} numberOfLines={3}>{item.title}</Text>

                <Rating
                    type='custom'
                    readonly
                    startingValue={item.rating || 1}
                    ratingCount={5}
                    imageSize={12}
                    ratingColor={colors.starYellow}
                    ratingBackgroundColor={colors.lightGrey}
                    tintColor={colors.themeWhite}
                    style={{ alignSelf: 'flex-start', marginVertical: 6 }}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, gap: 4 }}>
                    <View style={styles.pricePill}>
                        <Text style={styles.pricePillText}>{item.price}</Text>
                    </View>
                    <Text style={styles.originalPriceText}>{item.oldPrice}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Banner Section */}
            <View style={styles.bannerContainer}>
                <ImageBackground
                    source={require('../../assets/images/category/men.jpg')}
                    style={styles.bannerBg}
                    resizeMode="cover"
                >
                    <View style={styles.bannerHeader}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={28} color={colors.themeBlack} />
                            <Text style={styles.bannerTitle}>Fashion</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="search-outline" size={28} color={colors.themeBlack} />
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>

            {/* Top Filters */}
            <View style={styles.topFilterContainer}>
                <TouchableOpacity style={styles.optionsIconContainer}>
                    <View style={styles.optionsBadge}>
                        <Text style={styles.optionsBadgeText}>1</Text>
                    </View>
                    <AppIcons.FilterIcon size={20} color={colors.themeBlack} />
                </TouchableOpacity>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topFilterList}>
                    {topFilters.map((filter) => {
                        const isActive = selectedTopFilter === filter.id;
                        return (
                            <TouchableOpacity
                                key={filter.id}
                                style={styles.filterItemContainer}
                                onPress={() => handleTopFilterPress(filter.id)}
                            >
                                <View style={styles.filterContent}>
                                    <Image source={filter.image} style={styles.filterImage} />
                                    <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                                        {filter.name}
                                    </Text>
                                </View>
                                {isActive && <View style={styles.activeIndicator} />}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>
                {/* Left Sidebar */}
                <View style={styles.sidebarContainer}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {(subCategories[selectedTopFilter] || []).map((sub: any, index: number) => {
                            const isActive = selectedSubCategory === sub.id;
                            return (
                                <TouchableOpacity
                                    key={sub.id + index}
                                    style={styles.sidebarItem}
                                    onPress={() => setSelectedSubCategory(sub.id)}
                                >
                                    <View style={isActive ? styles.sidebarIconActiveBg : styles.sidebarIconInactiveBg}>
                                        <View style={[styles.sidebarIconWrapper, isActive && styles.sidebarIconWrapperActive]}>
                                            <Image
                                                source={sub.icon}
                                                style={styles.sidebarIconImage}
                                            />
                                        </View>
                                    </View>
                                    <Text style={[styles.sidebarItemText, isActive && styles.sidebarItemTextActive]}>
                                        {sub.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Products Grid */}
                <View style={styles.productsGrid}>
                    <FlatList
                        data={productsData[selectedSubCategory] || []}
                        keyExtractor={(item, index) => item.id + index.toString()}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderProduct}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                    />
                </View>
            </View>
        </View>
    );
};

export default CategoryScreen;
