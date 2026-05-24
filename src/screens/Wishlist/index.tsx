import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { styles } from './styles';
import { AppIcons } from '../../assets/icons';
import ExploreItem from '../../components/ExploreItem/ExploreItem';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors } from '../../assets/theme/colours';
import { hp, wp } from '../../utils/responsive';
import LinearGradient from 'react-native-linear-gradient';

import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import {
  addToCartApi,
  removeFromCartApi,
} from '../../api/services/cartService';
import FloatingCartButton from '../../components/FloatingCartButton/FloatingCartButton';
import { Alert } from 'react-native';
import ConfirmationModal from '../../components/ConfirmationModal';

const WishlistScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { wishlistItems, loadWishlist, isLoading, toggleWishlist } =
    useWishlist();
  const { cartItems, cartSummary, loadCart } = useCart();
  const [itemToRemove, setItemToRemove] = useState<any>(null);

  const handleCartToggle = async (item: any) => {
    const productId = item.productId || item.id;
    const existingCartItem = cartItems.find(c => c.productId === productId);

    try {
      if (existingCartItem) {
        // Item is already in cart, remove it
        await removeFromCartApi(
          existingCartItem.cartItemId,
          cartSummary?.cartVersion,
          productId,
        );
      } else {
        // Item is not in cart, add it
        await addToCartApi(productId, 1);
      }
      await loadCart();
    } catch (error) {
      console.error('Error toggling cart item:', error);
      Alert.alert('Error', 'Failed to update cart. Please try again.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadWishlist(true);
    }, [loadWishlist]),
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AppIcons.ArrowLeft size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wishlist</Text>
      </View>
      <View style={styles.headerRight}>
        {/* <TouchableOpacity style={styles.headerIcon}>
          <AppIcons.Search size={24} color="black" />
        </TouchableOpacity> */}
        <TouchableOpacity
          //style={styles.cartIconContainer}
          onPress={() => navigation.navigate('Cart')}
        >
          <Image
            source={require('../../assets/images/bottomtab/cart.png')}
            style={{ width: wp(8.5), height: wp(8.5) }}
            resizeMode="contain"
          />
          {/* <AppIcons.ShoppingCart size={18} color="white" /> */}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      {wishlistItems.length > 0 && (
        <Image
          source={require('../../assets/images/nomorewishlist.png')}
          style={{ width: 140, height: 140 }}
          resizeMode="contain"
        />
      )}
    </View>
  );

  if (isLoading && wishlistItems.length === 0) {
    return (
      <SafeAreaView
        style={[
          styles.mainContainer,
          {
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
          },
        ]}
      >
        {renderHeader()}
        <View style={[styles.emptyContainer, { justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color={colors.themeBg} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.mainContainer,
        { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
      ]}
    >
      {renderHeader()}

      {wishlistItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require('../../assets/images/nowish.png')}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}> Oops! No wishlist</Text>
        </View>
      ) : (
        <View style={{ backgroundColor: colors.wishlistbg, flex: 1 }}>
          <FlatList
            data={wishlistItems}
            renderItem={({ item }) => (
              <ExploreItem
                item={item}
                onPress={() =>
                  navigation.navigate('ProductDetailsScreen', {
                    productId: item.productId || item.id,
                    product: item,
                  })
                }
                toggleWishlist={() => setItemToRemove(item)}
                isInWishlist={() => true} // It's the wishlist screen, so always true
                style={{
                  width: wp('29.3%'),
                  marginHorizontal: wp('0.5%'),
                  marginBottom: hp('1.5%'),
                  contentContainer: { padding: 6 },
                  image: { height: 80 }, // Shorter image for 3 columns
                  caption: { fontSize: 9, height: 28 }, // Slightly smaller font
                  pricePill: {
                    minWidth: 45,
                    height: 20,
                    borderRadius: 6,
                    paddingHorizontal: 4,
                  },
                  pricePillText: { fontSize: 10 },
                  originalPriceText: { fontSize: 7 },
                }}
              />
            )}
            keyExtractor={(item, index) =>
              (item.productId || item.id || index).toString()
            }
            numColumns={3}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={{ justifyContent: 'flex-start' }}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
      <FloatingCartButton />
      <ConfirmationModal
        visible={!!itemToRemove}
        onClose={() => setItemToRemove(null)}
        onConfirm={() => {
          if (itemToRemove) {
            toggleWishlist(itemToRemove);
            setItemToRemove(null);
          }
        }}
        title="Remove Item"
        message="Are you sure you want to remove this item from your wishlist?"
        confirmText="Remove"
        themeColor={colors.themeTeal}
      />
    </SafeAreaView>
  );
};

export default WishlistScreen;
