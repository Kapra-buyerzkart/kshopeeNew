import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, StyleSheet, ImageBackground } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useCommonStyles } from '../../assets/styles';
import { colors } from '../../assets/theme/colours';
import { fonts } from '../../assets/theme/typography';
import { RootStackParamList } from '../../types/types';
import HomeSearchBar from '../../components/HomeSearchBar/HomeSearchBar';
import ClickForMoreButton from '../../components/ClickForMoreButton/ClickForMoreButton';
import { sliderImages, goatDeals, exploreItems, bestSellingItem, topBrands, gShockData, superSaleBanner, flashSaleItems } from './dummyData';
import { AppIcons } from '../../assets/icons';

const { width } = Dimensions.get('window');
const figmaTeal = '#00B4D8';
const figmaLightTeal = '#E8F8FA';
const darkBadgeColor = '#2A2A2A';

const HomeScreen: React.FC = () => {
  const styles = useCommonStyles();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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
    <Image source={{ uri: item.url }} style={figmaStyles.headerSectionImageBackground} resizeMode="cover" />
  );

  const renderGoatDeal = ({ item }: { item: any }) => (
    <TouchableOpacity style={figmaStyles.goatDealCard}>
      <Text style={figmaStyles.goatDealTitle}>{item.title}</Text>
      <Image source={{ uri: item.url }} style={figmaStyles.goatDealImage} resizeMode="contain" />
      <View style={figmaStyles.goatDealBadge}>
        <Text style={figmaStyles.goatDealBadgeText}>{item.badgeText}</Text>
        <View style={figmaStyles.goatDealArrowCircle}>
          <Text style={{color: figmaTeal, fontSize: 10, fontWeight: 'bold'}}>&gt;</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderExploreItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={figmaStyles.exploreItemCard}>
      <View style={figmaStyles.exploreTopBadgesRow}>
        <View style={figmaStyles.discountCircle}>
          <Text style={figmaStyles.discountCircleText}>{item.discountBadge}</Text>
        </View>
        <Text style={{color: figmaTeal, fontWeight: 'bold', fontSize: 20}}>W</Text> {/* Bookmark Mock */}
      </View>
      
      <Image source={{ uri: item.url }} style={figmaStyles.exploreItemImage} />
      
      <View style={{ padding: 10 }}>
        <Text style={[styles.caption, { fontWeight: '600', color: colors.black }]} numberOfLines={3}>{item.title}</Text>
        
        {/* Mock stars */}
        <View style={{flexDirection: 'row', marginVertical: 6}}>
           <Text style={{ color: '#FFD700', fontSize: 12 }}>★</Text>
           <Text style={{ color: colors.lightGrey, fontSize: 12 }}>★★★★</Text>
        </View>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <View style={figmaStyles.pricePill}>
            <Text style={figmaStyles.pricePillText}>{item.currentPrice}</Text>
          </View>
          <Text style={figmaStyles.originalPriceText}>{item.originalPrice}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderBrandItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={figmaStyles.brandItemCard}>
      <Text style={figmaStyles.brandLogoText}>{item.logoText}</Text>
      <Image source={{ uri: item.url }} style={figmaStyles.brandItemImage} resizeMode="contain"/>
    </TouchableOpacity>
  );

  const renderGShockCard = ({ item }: { item: any }) => {
    const isDark = item.theme === 'dark';
    return (
      <TouchableOpacity style={[figmaStyles.gShockSmallCard, { backgroundColor: isDark ? '#1F1F1F' : colors.white }]}>
        <Image source={{ uri: item.url }} style={figmaStyles.gShockSmallImage} resizeMode="contain" />
        <View style={{ justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 10 }}>
          <Text style={{ color: isDark ? colors.white : colors.black, fontSize: 10 }}>Only @</Text>
          <Text style={{ color: figmaTeal, fontSize: 16, fontWeight: 'bold' }}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFlashSaleItem = ({ item }: { item: any }) => (
    <View style={figmaStyles.flashSaleItemCard}>
      <Image source={{ uri: item.url }} style={figmaStyles.flashSaleImage} />
      <View style={figmaStyles.flashBadgeDark}>
        <Text style={figmaStyles.flashBadgeTextDark}>Off 50%</Text>
      </View>
      <Text style={figmaStyles.flashSalePrice}>{item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80, backgroundColor: '#F2FBFB' }}>
        
        {/* Header Section from Screenshot 1 & 5 */}
        <View style={figmaStyles.headerSectionWrapper}>
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
            <View style={figmaStyles.topBar}>
              <TouchableOpacity style={figmaStyles.profileArea}>
                <Image source={{uri: 'https://picsum.photos/seed/user/100/100'}} style={figmaStyles.profileImageReal} />
                <Text style={figmaStyles.userName}>Rahul KR</Text>
              </TouchableOpacity>
              
              <View style={figmaStyles.actionsPill}>
                <TouchableOpacity style={figmaStyles.actionIcon}>
                  <AppIcons.User color={colors.black} size={20} /> {/* Mock Bag */}
                </TouchableOpacity>
                <TouchableOpacity style={figmaStyles.actionIcon}>
                  <View style={figmaStyles.notificationDot} />
                  <AppIcons.User color={colors.black} size={20} /> {/* Mock Bell */}
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
              <HomeSearchBar placeholder="Search product" />
            </View>

            <View style={figmaStyles.headerDotsContainer}>
              {sliderImages.map((_, index) => (
                <View key={index} style={[figmaStyles.headerDot, currentSlideIndex === index && { backgroundColor: figmaTeal }]} />
              ))}
            </View>
          </View>
        </View>

        {/* GOAT DEALS */}
        <View style={figmaStyles.sectionContainer}>
          <Text style={figmaStyles.sectionTitleCenter}>GOAT DEALS</Text>
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
        <View style={figmaStyles.sectionContainer}>
          <Text style={figmaStyles.sectionTitleCenter}>EXPLORE</Text>
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
        <View style={figmaStyles.sectionContainer}>
          <Text style={figmaStyles.sectionTitleCenter}>BEST SELLING</Text>
          <View style={figmaStyles.bestSellingContainer}>
            {/* Arrows */}
            <View style={figmaStyles.carouselArrowLeft}><Text style={figmaStyles.chevronArrowText}>&lt;</Text></View>
            <View style={figmaStyles.carouselArrowRight}><Text style={figmaStyles.chevronArrowText}>&gt;</Text></View>
            
            <Image source={{ uri: bestSellingItem.url }} style={figmaStyles.bestSellingImage} resizeMode="contain" />
            
            <View style={figmaStyles.bestSellingTextRow}>
              <Text style={figmaStyles.bestSellingTitle}>{bestSellingItem.brand}</Text>
              <View style={{alignItems: 'flex-end'}}>
                 <Text style={figmaStyles.bestSellingOriginalPrice}>{bestSellingItem.originalPrice}</Text>
                 <Text style={figmaStyles.bestSellingCurrentPrice}>{bestSellingItem.price}</Text>
              </View>
            </View>
          </View>
          <View style={{marginTop: 16}}>
             <ClickForMoreButton onPress={() => {}} title="Click for more offers" />
          </View>
        </View>

        {/* TOP BRANDS */}
        <View style={figmaStyles.sectionContainer}>
          <Text style={figmaStyles.sectionTitleCenter}>TOP BRANDS</Text>
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
        <View style={figmaStyles.gShockSectionWrapper}>
          <Image source={{ uri: gShockData.mainUrl }} style={figmaStyles.gShockTopBanner} resizeMode="cover" />
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
          <Image source={{ uri: superSaleBanner }} style={figmaStyles.superSaleBannerImage} resizeMode="cover" />
          {/* Pills */}
          <View style={figmaStyles.superSaleDotsContainer}>
            <View style={[figmaStyles.superSalePill, { backgroundColor: figmaTeal }]} />
            <View style={figmaStyles.superSalePill} />
            <View style={figmaStyles.superSalePill} />
            <View style={figmaStyles.superSalePill} />
            <View style={figmaStyles.superSalePill} />
          </View>
        </View>

        {/* FLASH SALE */}
        <View style={figmaStyles.flashSaleContainer}>
          <Text style={figmaStyles.hugeFlashText}>FLASH</Text>
          <Image source={{ uri: 'https://picsum.photos/seed/podium/600/400' }} style={figmaStyles.podiumImageBackground} />
          
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

const figmaStyles = StyleSheet.create({
  headerSectionWrapper: { height: 320, width: width, position: 'relative' },
  headerSectionImageBackground: { height: 320, width: width },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  profileArea: { flexDirection: 'row', alignItems: 'center' },
  profileImageReal: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.white, marginRight: 10
  },
  userName: { fontFamily: 'Gilroy-Medium', fontSize: 16, color: colors.black },
  actionsPill: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6
  },
  actionIcon: { marginLeft: 12, position: 'relative' },
  notificationDot: {
    position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#E74C3C', zIndex: 1
  },
  headerDotsContainer: { flexDirection: 'row', position: 'absolute', bottom: 16, alignSelf: 'center' },
  headerDot: { width: 20, height: 4, borderRadius: 2, backgroundColor: colors.white, marginHorizontal: 3, opacity: 0.8 },
  
  sectionContainer: { marginTop: 30 },
  sectionTitleCenter: {
    fontFamily: 'Gilroy-Bold', fontSize: 16, textAlign: 'center', marginBottom: 20, color: colors.black
  },
  
  goatDealCard: {
    width: (width - 32 - 16) / 2,
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: figmaLightTeal,
    height: 140,
  },
  goatDealTitle: { position: 'absolute', top: 12, left: 12, fontSize: 18, fontWeight: 'bold', color: colors.black, zIndex: 1 },
  goatDealImage: { width: '100%', height: 110, marginTop: 20 },
  goatDealBadge: {
    position: 'absolute', bottom: -14, alignSelf: 'center',
    backgroundColor: darkBadgeColor, borderRadius: 20,
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 5, paddingHorizontal: 12,
  },
  goatDealBadgeText: { color: colors.white, fontSize: 10, marginRight: 8 },
  goatDealArrowCircle: { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' },
  
  exploreItemCard: {
    width: 150, marginRight: 16, backgroundColor: colors.white,
    borderRadius: 16, borderWidth: 1, borderColor: figmaLightTeal,
    paddingTop: 10,
  },
  exploreTopBadgesRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginBottom: -10, zIndex: 2 },
  discountCircle: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: figmaTeal, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white },
  discountCircleText: { color: figmaTeal, fontSize: 10, fontWeight: 'bold' },
  exploreItemImage: { width: '100%', height: 120, resizeMode: 'contain' },
  pricePill: { backgroundColor: figmaTeal, borderRadius: 12, paddingVertical: 4, paddingHorizontal: 8 },
  pricePillText: { color: colors.white, fontSize: 12, fontWeight: 'bold' },
  originalPriceText: { fontSize: 9, color: colors.grey, textDecorationLine: 'line-through' },
  
  bestSellingContainer: {
    marginHorizontal: 16, backgroundColor: '#8ED2C9', borderRadius: 24, height: 280, justifyContent: 'flex-end', padding: 16, overflow: 'hidden'
  },
  carouselArrowLeft: { position: 'absolute', left: 16, top: 120, width: 36, height: 36, borderRadius: 18, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  carouselArrowRight: { position: 'absolute', right: 16, top: 120, width: 36, height: 36, borderRadius: 18, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  chevronArrowText: { fontSize: 16, color: colors.black, fontWeight: '300' },
  bestSellingImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '80%', resizeMode: 'contain', zIndex: 1, top: 20 },
  bestSellingTextRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 2 },
  bestSellingTitle: { fontSize: 24, fontWeight: 'bold', color: '#1D1D1D' },
  bestSellingOriginalPrice: { fontSize: 12, color: '#555555', textDecorationLine: 'line-through', textAlign: 'right' },
  bestSellingCurrentPrice: { fontSize: 24, fontWeight: 'bold', color: '#1D1D1D' },
  
  brandItemCard: {
    width: (width - 32) / 3 - 10, height: 160, borderRadius: 16,
    backgroundColor: figmaLightTeal, overflow: 'hidden', marginHorizontal: 4,
    alignItems: 'center', paddingTop: 10
  },
  brandLogoText: { fontSize: 20, fontWeight: 'bold', color: colors.black, zIndex: 1 },
  brandItemImage: { position: 'absolute', bottom: 0, width: '100%', height: 110 },
  
  gShockSectionWrapper: { backgroundColor: colors.black, marginTop: 40, paddingBottom: 30 },
  gShockTopBanner: { width: width, height: 100 },
  gShockSmallCard: {
    width: (width - 32 - 16) / 2, borderRadius: 12, padding: 8, marginBottom: 16,
    flexDirection: 'row', alignItems: 'center'
  },
  gShockSmallImage: { width: 50, height: 50 },
  
  superSaleBannerImage: { width: width - 32, height: 120, marginHorizontal: 16, borderRadius: 16 },
  superSaleDotsContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  superSalePill: { width: 16, height: 4, borderRadius: 2, backgroundColor: '#A0A0A0', marginHorizontal: 3 },
  
  flashSaleContainer: { backgroundColor: '#A4E8DF', paddingBottom: 40, marginTop: 20 },
  hugeFlashText: { color: colors.white, fontSize: 64, fontWeight: 'bold', position: 'absolute', bottom: 20, left: -10, opacity: 0.8 },
  podiumImageBackground: { width: width, height: 260, resizeMode: 'cover', opacity: 0.6 },
  flashSaleItemCard: { alignItems: 'center', marginRight: 16, width: 110 },
  flashSaleImage: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.white, marginBottom: 20 },
  flashBadgeDark: { backgroundColor: darkBadgeColor, borderRadius: 12, paddingVertical: 4, paddingHorizontal: 12, position: 'absolute', bottom: 25 },
  flashBadgeTextDark: { color: colors.white, fontSize: 10, fontWeight: 'bold' },
  flashSalePrice: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
});

export default HomeScreen;
