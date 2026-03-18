import { Dimensions, StyleSheet } from "react-native";
import { colors } from "./theme/colours";
import { fonts } from "./theme/typography";

// Export a function that returns the styles
const { width, height } = Dimensions.get('window');

// Guideline sizes are based on standard design screen (e.g. iPhone X)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export const scale = (size: number) => (width / guidelineBaseWidth) * size;
export const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export const useCommonStyles = () => {
    const colour = colors;
    return StyleSheet.create({

        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colour.background,
        },
        title: {
            fontSize: 20,
            color: colour.text
        },
        sectionTitle: {
            fontFamily: fonts.h1.fontFamily,
            fontSize: 18,
            fontWeight: 'bold',
            color: colour.text,
            marginVertical: 12,
            paddingHorizontal: 16,
        },
        horizontalScrollPadding: {
            paddingHorizontal: 16,
        },
        rowCenter: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        // Generic Text Styles
        heading1: {
            fontSize: 22,
            fontWeight: 'bold',
            color: colour.text,
        },
        body1: {
            fontSize: 16,
            color: colour.text,
        },
        body2: {
            fontSize: 14,
            color: colour.text,
        },
        caption: {
            fontSize: 12,
            color: colour.text,
        },
        label1: {
            fontSize: 16,
            fontWeight: '600',
            color: colour.text,
        },

        // Text Utilities
        textPrimary: { color: colour.primary },
        textWhite: { color: colour.white },
        textBold: { fontWeight: 'bold' },

        cardExample: {
            padding: 30,
            marginTop: 10,
            color: colour.text,
            backgroundColor: colour.themeTeal,
        },
        headingTextStyle: {
            ...fonts.h4,
            color: colour.text,
        },
        cardTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colour.text
        },
        cardDescription: {
            fontSize: 14,
            color: colour.text
        },
        buttonTextStyle: {
            ...fonts.h4,
            color: colour.white,

        },
        confirmButton: {
            width: '45%',
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            width: '100%',
            margin: 6
        },
        // Product Screen Styles
        productFloatingCartContainer: {
            position: 'absolute',
            bottom: 20,
            left: 16,
            right: 16,
        },
        productCartButton: {
            backgroundColor: colour.primary,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 14,
            paddingHorizontal: 20,
            borderRadius: 12,
            shadowColor: colour.black,
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
        },
        productCartLeft: {
            flexDirection: 'row',
            alignItems: 'center',
        },


        // Order Details Screen Styles

        // Transaction Success Screen Styles
        iconContainer: {
            marginBottom: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        // Order History Screen Styles

        // Filter Button

        // Filter Modal

        // Radio Buttons

        // Date Inputs

        // Filter Action Button


        // Section Headers for Daily Grouping


        // Updated Transaction Cards


        // Side Menu Styles
        sideMenuOverlay: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 2000,
        },
        sideMenuContainer: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: '80%',
            maxWidth: 320,
            backgroundColor: colour.primary,
            paddingTop: 50, // For status bar
            paddingBottom: 20,
            zIndex: 2001,
            shadowColor: "#000",
            shadowOffset: {
                width: 2,
                height: 0,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        sideMenuHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginBottom: 20,
        },
        sideMenuAppIcon: {
            width: 32,
            height: 32,
            backgroundColor: 'white',
            borderRadius: 6,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
        },
        sideMenuUserInfo: {
            paddingHorizontal: 20,
            marginBottom: 20,
        },
        sideMenuBranchSelector: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(255,255,255,0.15)',
            marginHorizontal: 20,
            padding: 12,
            borderRadius: 8,
            marginBottom: 20,
        },
        sideMenuAppIconImage: {
            width: 40,
            height: 40,
            borderRadius: 20,
        },
        sideMenuScrollContent: {
            flex: 1,
        },
        sideMenuItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 16,
            paddingHorizontal: 20,
        },
        sideMenuFooter: {
            paddingHorizontal: 20,
            marginTop: 20,
        },
        sideMenuLastLoginContainer: {
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        sideMenuLastLoginIcon: {
            width: 40,
            height: 40,
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        sideMenuLastLoginContent: {
            flex: 1,
        },

        // Home Screen specific styles
        headerSection: { height: 280, width: width, position: 'relative' },
        sliderImage: { width: width, height: 280 },
        headerOverlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.3)',
            paddingTop: 50,
        },
        topBar: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            marginBottom: 10,
        },
        profileArea: { flexDirection: 'row', alignItems: 'center' },
        profileIconPlaceholder: {
            width: 32,
            height: 32,
            borderRadius: 30,
            backgroundColor: colour.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
        },
        userName: { fontFamily: 'Gilroy-Medium', fontSize: 17, color: colour.white },
        actionsArea: { flexDirection: 'row', alignItems: 'center' },
        actionIcon: { marginLeft: 16, position: 'relative' },
        notificationDot: {
            position: 'absolute', top: -2, right: -4, width: 8, height: 8, borderRadius: 4, backgroundColor: 'red', zIndex: 1
        },
        sectionContainer: { marginTop: 20 },
        sectionTitleCenter: {
            fontFamily: fonts.h1.fontFamily, fontSize: 16, textAlign: 'center', marginBottom: 16, color: colour.black, letterSpacing: 1
        },
        goatDealCard: {
            width: (width - 32 - 16) / 2,
            backgroundColor: colour.white,
            borderRadius: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#E8F8FA',
            overflow: 'hidden',
        },
        goatDealImage: { width: '100%', height: 120, resizeMode: 'contain' },
        goatDealBadge: {
            backgroundColor: colour.black,
            borderTopLeftRadius: 10, borderTopRightRadius: 10,
            paddingVertical: 6, alignItems: 'center',
            marginHorizontal: 16, marginTop: -15, zIndex: 1,
        },
        goatDealBadgeText: { color: colour.white, fontSize: 10, fontWeight: 'bold' },
        exploreItemCard: {
            width: 140, marginRight: 12, backgroundColor: colour.white,
            borderRadius: 12, borderWidth: 1, borderColor: '#E8F8FA',
        },
        exploreItemImage: { width: '100%', height: 120, borderTopLeftRadius: 12, borderTopRightRadius: 12, resizeMode: 'cover' },
        cartBadge: {
            width: 24, height: 24, borderRadius: 6, backgroundColor: '#00B4D8', justifyContent: 'center', alignItems: 'center',
        },
        bestSellingContainer: {
            marginHorizontal: 16, backgroundColor: '#8ED2C9', borderRadius: 20, padding: 16, height: 260, position: 'relative', overflow: 'hidden'
        },
        bestSellingImage: { width: '100%', height: 180, zIndex: 1 },
        bestSellingTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, zIndex: 1 },
        bestSellingBrand: { fontFamily: 'Gilroy-Medium', fontSize: 16, color: colour.black },
        bestSellingPrice: { fontFamily: fonts.h1.fontFamily, fontSize: 16, color: colour.black },
        carouselArrowLeft: { position: 'absolute', left: 16, top: 110, width: 30, height: 30, borderRadius: 15, backgroundColor: colour.white, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
        carouselArrowRight: { position: 'absolute', right: 16, top: 110, width: 30, height: 30, borderRadius: 15, backgroundColor: colour.white, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
        arrowText: { fontSize: 14, color: colour.grey, fontWeight: 'bold' },
        brandItemCard: {
            width: (width - 32) / 3 - 10,
            height: 120,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#E8F8FA',
            backgroundColor: '#F5FCFD',
            overflow: 'hidden',
            marginHorizontal: 4,
        },
        brandItemImage: { width: '100%', height: '100%' },
        gShockContainer: { backgroundColor: colour.black, marginTop: 20, paddingBottom: 20 },
        gShockMainImage: { width: width, height: 220 },
        gShockTitle: { color: colour.white, fontSize: 28, fontWeight: 'bold', letterSpacing: 2, position: 'absolute', top: 150, left: 20 },
        gShockSmallCard: {
            width: (width - 32 - 16) / 2, backgroundColor: '#1A1A1A', borderRadius: 8, padding: 10, marginBottom: 16, position: 'relative'
        },
        gShockSmallImage: { width: '100%', height: 80 },
        gShockBadge: { position: 'absolute', right: 10, top: 10, paddingVertical: 2, paddingHorizontal: 6, backgroundColor: colour.white, borderRadius: 12, opacity: 0.8 },
        gShockBadgeText: { color: colour.black, fontSize: 10, fontWeight: 'bold' },
        superSaleBanner: { width: width - 32, height: 100, marginHorizontal: 16, borderRadius: 12 },
        dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D1D1D1', marginHorizontal: 4 },
        flashSaleContainer: { backgroundColor: '#458B86', paddingVertical: 20, paddingBottom: 40, marginTop: 10 },
        flashSaleTitle: { color: colour.white, fontSize: 32, fontWeight: 'bold', paddingHorizontal: 16, opacity: 0.8 },
        podiumImageBackground: { width: width, height: 200, resizeMode: 'cover', opacity: 0.6, marginTop: -30 },
        flashSaleItemCard: { alignItems: 'center', marginRight: 16, width: 100 },
        flashSaleImage: { width: 100, height: 100, borderRadius: 50, backgroundColor: colour.white },
        flashSaleBadge: { backgroundColor: colour.black, borderRadius: 12, paddingVertical: 4, paddingHorizontal: 8, marginTop: -15, zIndex: 1 },
        flashSaleBadgeText: { color: colour.white, fontSize: 10, fontWeight: 'bold' },
        flashSalePrice: { color: colour.white, fontSize: 12, marginTop: 4, fontWeight: 'bold' },
        bottomTabMenu: { position: 'absolute', bottom: 0, width: width, height: 60, backgroundColor: colour.white, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: colour.lightGrey },

        // Client Module Styles
        // Shared header styles for all Client screens

        // Calculator Screen Styles

        // Profile Styles

        // ClientList specific styles

        // ClientDetails specific styles


        // ClientAdd specific styles


        // Common Utils

        // Refactored Order History Styles


    })
}