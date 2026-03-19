import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { styles } from './styles';
import { AppIcons } from '../../assets/icons';
import ProductCard from '../../components/ProductCard';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../assets/theme/colours';
import { wp } from '../../utils/responsive';
import LinearGradient from 'react-native-linear-gradient';

const DATA = [
    {
        id: '1',
        title: 'Lorem Ipsum is simply dummy textLorem',
        price: '324.00',
        mrp: '394.00',
        discount: '-17%',
        rating: 3,
        image: require('../../assets/images/img.png'),
    },
    {
        id: '2',
        title: 'Lorem Ipsum is simply dummy textLorem',
        price: '324.00',
        mrp: '394.00',
        discount: '-17%',
        rating: 4,
        image: require('../../assets/images/img.png'),
    },
    {
        id: '3',
        title: 'Lorem Ipsum is simply dummy textLorem',
        price: '324.00',
        mrp: '394.00',
        discount: '-17%',
        rating: 2,
        image: require('../../assets/images/img.png'),
    },
    {
        id: '4',
        title: 'Lorem Ipsum is simply dummy textLorem',
        price: '324.00',
        mrp: '394.00',
        discount: '-17%',
        rating: 5,
        image: require('../../assets/images/img.png'),
    },
];

const WishlistScreen: React.FC = () => {
    const navigation = useNavigation();
    const [isEmpty, setIsEmpty] = React.useState(false);

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AppIcons.ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Wishlist</Text>
            </View>
            <View style={styles.headerRight}>
                <TouchableOpacity style={styles.headerIcon}>
                    <AppIcons.Search size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.cartIconContainer}>
                    <AppIcons.ShoppingCart size={18} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderFooter = () => (
        <View style={styles.footerContainer}>
            <Image source={require('../../assets/images/nomorewishlist.png')} style={{ width: 140, height: 140 }} resizeMode='contain' />
        </View>
    );

    return (
        <SafeAreaView style={styles.mainContainer}>
            {renderHeader()}
            {/* 
            <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setIsEmpty(!isEmpty)}
            >
                <Text style={styles.toggleButtonText}>
                    {isEmpty ? 'Show Items' : 'Show Empty'}
                </Text>
            </TouchableOpacity> */}

            {isEmpty ? (
                <View style={styles.emptyContainer}>
                    <Image
                        source={require('../../assets/images/nowishlist.png')}
                        style={styles.emptyImage}
                    />
                    <Text style={styles.emptyText}> Oops! No wishlist</Text>
                </View>
            ) : (
                // <LinearGradient
                //     colors={[colors.white, colors.themeBg]}
                //     locations={[0, 1]}
                //     start={{ x: 0, y: 0.1 }}
                //     end={{ x: 1, y: 0.9 }}
                //     style={styles.cartGradient}
                // >
                <FlatList
                    data={DATA}
                    renderItem={({ item }) => (
                        <ProductCard
                            title={item.title}
                            price={item.price}
                            mrp={item.mrp}
                            discount={item.discount}
                            rating={item.rating}
                            image={item.image}
                            isWishlisted={true}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                    ListFooterComponent={renderFooter}
                    showsVerticalScrollIndicator={false}
                />
                // </LinearGradient>
            )}
        </SafeAreaView>
    );
};

export default WishlistScreen;
