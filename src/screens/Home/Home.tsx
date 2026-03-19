import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useCommonStyles } from '../../assets/styles';
import { colors } from '../../assets/theme/colours';
import { RootStackParamList } from '../../types/types';
import HomeSearchBar from '../../components/HomeSearchBar/HomeSearchBar';
import ClickForMoreButton from '../../components/ClickForMoreButton/ClickForMoreButton';
import { sliderImages, goatDeals, exploreItems, bestSellingItem, topBrands, gShockData, superSaleBanner, flashSaleItems } from './dummyData';
import { AppIcons } from '../../assets/icons';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const styles = useCommonStyles();
  const navigation = useNavigation<any>();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slideRef = useRef<FlatList>(null);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      let nextIndex = currentSlideIndex + 1;
      if (nextIndex >= sliderImages.length) nextIndex = 0;
      slideRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentSlideIndex(nextIndex);
    }, 3000);
    return () => clearInterval(slideInterval);
  }, [currentSlideIndex]);

  const renderSliderItem = ({ item }: { item: any }) => (
    <Image source={item.image} style={styles.headerSectionImageBackground} resizeMode="cover" />
  );

  const renderGoatDeal = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.goatDealCard}>
      <Text style={styles.goatDealTitle}>{item.title}</Text>
      <Image source={item.image} style={styles.goatDealImage} resizeMode="contain" />
      <View style={styles.goatDealBadge}>
        <Text style={styles.goatDealBadgeText}>{item.badgeText}</Text>
        <View style={styles.goatDealArrowCircle}>
          <Text style={{color: colors.figmaTeal, fontSize: 10, fontFamily: 'Gilroy-Bold'}}>&gt;</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderExploreItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.exploreItemCard}>
      <View style={styles.exploreTopBadgesRow}>
        <View style={styles.discountCircle}>
          <Text style={styles.discountCircleText}>{item.discountBadge}</Text>
        </View>
        <Text style={{color: colors.figmaTeal, fontFamily: 'Gilroy-Bold', fontSize: 20}}>W</Text> {/* Bookmark Mock */}
      </View>
      
      <Image source={item.image} style={styles.exploreItemImage} />
      
      <View style={{ padding: 10 }}>
        <Text style={[styles.caption, { fontFamily: 'Gilroy-Medium', color: colors.black }]} numberOfLines={3}>{item.title}</Text>
        
        {/* Mock stars */}
        <View style={{flexDirection: 'row', marginVertical: 6}}>
           <Text style={{ color: colors.starYellow, fontSize: 12 }}>★</Text>
           <Text style={{ color: colors.lightGrey, fontSize: 12 }}>★★★★</Text>
        </View>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <View style={styles.pricePill}>
            <Text style={styles.pricePillText}>{item.currentPrice}</Text>
          </View>
          <Text style={styles.originalPriceText}>{item.originalPrice}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderBrandItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.brandItemCard}>
      <Text style={styles.brandLogoText}>{item.logoText}</Text>
      <Image source={item.image} style={styles.brandItemImage} resizeMode="contain"/>
    </TouchableOpacity>
  );

  const renderGShockCard = ({ item }: { item: any }) => {
    const isDark = item.theme === 'dark';
    return (
      <TouchableOpacity style={[styles.gShockSmallCard, { backgroundColor: isDark ? colors.darkCardBackground : colors.white }]}>
        <Image source={item.image} style={styles.gShockSmallImage} resizeMode="contain" />
        <View style={{ justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 10 }}>
          <Text style={{ fontFamily: 'Gilroy-Medium', color: isDark ? colors.white : colors.black, fontSize: 10 }}>Only @</Text>
          <Text style={{ fontFamily: 'Gilroy-Bold', color: colors.figmaTeal, fontSize: 16 }}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFlashSaleItem = ({ item }: { item: any }) => (
    <View style={styles.flashSaleItemCard}>
      <Image source={item.image} style={styles.flashSaleImage} />
      <View style={styles.flashBadgeDark}>
        <Text style={styles.flashBadgeTextDark}>Off 50%</Text>
      </View>
      <Text style={styles.flashSalePrice}>{item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80, backgroundColor: colors.homeScreenBackground }}>
        
        {/* Header Section from Screenshot 1 & 5 */}
        <View style={styles.headerSectionWrapper}>
          <FlatList
            ref={slideRef}
            data={sliderImages}
            renderItem={renderSliderItem}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
          />
          <View style={[StyleSheet.absoluteFillObject, { paddingTop: 50 }]}>
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.profileArea} onPress={() => navigation.navigate('ProfileScreen')}>
                <Image source={{uri: 'https://picsum.photos/seed/user/100/100'}} style={styles.profileImageReal} />
                <Text style={styles.userName}>Rahul KR</Text>
              </TouchableOpacity>
              
              <View style={styles.actionsPill}>
                <TouchableOpacity style={styles.actionIcon}>
                  <AppIcons.User color={colors.black} size={20} /> {/* Mock Bag */}
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionIcon}>
                  <View style={styles.notificationDot} />
                  <AppIcons.User color={colors.black} size={20} /> {/* Mock Bell */}
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
              <HomeSearchBar placeholder="Search product" />
            </View>

            <View style={styles.headerDotsContainer}>
              {sliderImages.map((_, index) => (
                <View key={index} style={[styles.headerDot, currentSlideIndex === index && { backgroundColor: colors.figmaTeal }]} />
              ))}
            </View>
          </View>
        </View>

        {/* GOAT DEALS */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitleCenter}>GOAT DEALS</Text>
          <View style={styles.horizontalScrollPadding}>
            <FlatList
              data={goatDeals}
              renderItem={renderGoatDeal}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              scrollEnabled={false}
            />
          </View>
        </View>

        {/* EXPLORE */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitleCenter}>EXPLORE</Text>
          <FlatList
            data={exploreItems}
            renderItem={renderExploreItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollPadding}
          />
          <View style={{marginTop: 16}}>
             <ClickForMoreButton onPress={() => {}} title="Click for more" />
          </View>
        </View>

        {/* BEST SELLING */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitleCenter}>BEST SELLING</Text>
          <View style={styles.bestSellingContainer}>
            {/* Arrows */}
            <View style={styles.carouselArrowLeft}><Text style={styles.chevronArrowText}>&lt;</Text></View>
            <View style={styles.carouselArrowRight}><Text style={styles.chevronArrowText}>&gt;</Text></View>
            
            <Image source={bestSellingItem.image} style={styles.bestSellingImage} resizeMode="contain" />
            
            <View style={styles.bestSellingTextRow}>
              <Text style={styles.bestSellingTitle}>{bestSellingItem.brand}</Text>
              <View style={{alignItems: 'flex-end'}}>
                 <Text style={styles.bestSellingOriginalPrice}>{bestSellingItem.originalPrice}</Text>
                 <Text style={styles.bestSellingCurrentPrice}>{bestSellingItem.price}</Text>
              </View>
            </View>
          </View>
          <View style={{marginTop: 16}}>
             <ClickForMoreButton onPress={() => {}} title="Click for more offers" />
          </View>
        </View>

        {/* TOP BRANDS */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitleCenter}>TOP BRANDS</Text>
          <FlatList
            data={topBrands}
            renderItem={renderBrandItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.horizontalScrollPadding, { justifyContent: 'space-around', flex: 1 }]}
          />
        </View>

        {/* G-SHOCK Black Section */}
        <View style={styles.gShockSectionWrapper}>
          <Image source={gShockData.mainImage} style={styles.gShockTopBanner} resizeMode="cover" />
          <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
            <FlatList
              data={gShockData.items}
              renderItem={renderGShockCard}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              scrollEnabled={false}
            />
          </View>
        </View>

        {/* 11.11 SUPER SALE Banner */}
        <View style={{ marginVertical: 20 }}>
          <Image source={superSaleBanner} style={styles.superSaleBannerImage} resizeMode="cover" />
          {/* Pills */}
          <View style={styles.superSaleDotsContainer}>
            <View style={[styles.superSalePill, { backgroundColor: colors.figmaTeal }]} />
            <View style={styles.superSalePill} />
            <View style={styles.superSalePill} />
            <View style={styles.superSalePill} />
            <View style={styles.superSalePill} />
          </View>
        </View>

        {/* FLASH SALE */}
        <View style={styles.flashSaleContainer}>
          <Text style={styles.hugeFlashText}>FLASH</Text>
          <Image source={require('../../assets/images/home/flash_sale.png')} style={styles.podiumImageBackground} />
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, marginTop: -90 }}>
            {flashSaleItems.map((item, index) => (
              <React.Fragment key={item.id}>
                {renderFlashSaleItem({ item })}
              </React.Fragment>
            ))}
          </ScrollView>
        </View>

      </ScrollView>
    </View>
  );
};

export default HomeScreen;
