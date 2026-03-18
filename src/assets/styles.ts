import { Dimensions, StyleSheet } from "react-native";
import { colors } from "./theme/colours";
import { fonts } from "./theme/typography";

// Export a function that returns the styles
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

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
        // Generic Text Styles
        heading1: {
            fontSize: 22,
            fontWeight: 'bold',
            color: colour.text,
        },
        heading2: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colour.text,
        },
        heading3: {
            fontSize: 16,
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
        label2: {
            fontSize: 14,
            fontWeight: '600',
            color: colour.text,
        },

        // Text Utilities
        textPrimary: { color: colour.primary },
        textWhite: { color: colour.white },
        textGrey: { color: colour.grey },
        textCenter: { textAlign: 'center' },
        textBold: { fontWeight: 'bold' },
        
        cardExample: {
            padding: 30,
            marginTop: 10,
            color: colour.text
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
        productContainer: {
            flex: 1,
            backgroundColor: '#F5F6F8',
        },
        productHeaderContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#EEE',
        },
        productCategoryContainer: {
            flex: 1,
        },
        productCategoryButton: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        productSearchContainer: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F0F0F0',
            borderRadius: 8,
            paddingHorizontal: 10,
            height: 40,
            marginRight: 10,
        },
        productSearchInput: {
             paddingVertical: 0,
             fontSize: 14,
             color: colour.text,
        },
        productHeaderActions: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        productIconButton: {
            padding: 8,
            marginLeft: 4,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: '#EEE',
        },
        productListContent: {
            padding: 16,
            paddingBottom: 100,
        },
        productColumnWrapper: {
            justifyContent: 'space-between',
        },
        productCard: {
            backgroundColor: 'white',
            borderRadius: 12,
            width: (width / 2) - 24,
            marginBottom: 16,
            overflow: 'hidden',
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 3,
        },
        productImageContainer: {
            height: 120,
            width: '100%',
            position: 'relative',
        },
        productImage: {
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
        },
        productQtyBadge: {
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: colour.primary,
            borderRadius: 4,
            paddingHorizontal: 8,
            paddingVertical: 4,
        },
        productRemoveButton: {
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: colour.red,
            borderRadius: 12,
            width: 24,
            height: 24,
            justifyContent: 'center',
            alignItems: 'center',
        },
        productInfo: {
            padding: 12,
        },
        productPriceRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 4,
        },
        productAddButton: {
            backgroundColor: colour.primary,
            borderRadius: 8,
            padding: 6,
        },
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
        productDropdownList: {
            position: 'absolute',
            top: 40,
            left: 0,
            backgroundColor: colour.white,
            borderRadius: 8,
            padding: 4,
            width: 200,
            shadowColor: colour.black,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            zIndex: 2000,
        },
        productDropdownItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0',
        },

        specialItemsSection: {
            paddingHorizontal: 16,
            paddingTop: 8,
        },
        specialItemsCard: {
            backgroundColor: 'white',
            borderRadius: 12,
            width: (width / 2) - 24,
            marginBottom: 16,
            overflow: 'hidden',
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 3,
        },

        specialItemsAddCard: {
            backgroundColor: 'white',
            borderRadius: 12,
            width: (width / 2) - 24,
            height: 220,
            marginBottom: 16,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: colour.primary,
            borderStyle: 'dashed',
        },
        specialItemsAddButton: {
            alignItems: 'center',
        },
        specialItemsAddIcon: {
            marginBottom: 8,
        },
        // Order Details Screen Styles
        orderDetailsContainer: {
            flex: 1,
            backgroundColor: '#F5F6F8',
        },
        orderDetailsHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#EEE',
            width:'100%'
        },
        orderDetailsSection: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            paddingHorizontal: 16,
            paddingVertical: 16,
            marginTop: 16,
        },
        orderTypeContainer: {
            flexDirection: 'row',
            paddingHorizontal: 16,
            paddingTop: 16,
            gap: 12,
        },
        orderTypeButton: {
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 25,
            backgroundColor: '#E8E8E8',
            alignItems: 'center',
        },
        orderTypeButtonSelected: {
            backgroundColor: colour.primary,
        },
        orderItemRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            backgroundColor: 'white',
            marginTop: 16,
            paddingHorizontal: 16,
            borderRadius: 8,
        },
        orderItemQuantityBadge: {
            width: 40,
            height: 40,
            borderRadius: 8,
            backgroundColor: colour.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        orderSubtotalRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 16,
            marginTop: 16,
        },
        deleteOrderButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 16,
            marginTop: 16,
            marginHorizontal: 16,
            gap: 8,
        },
        orderBottomBar: {
            backgroundColor: 'white',
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 16,
            borderTopWidth: 1,
            borderTopColor: '#EEE',
        },
        orderBottomSubtotal: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
        },
        placeOrderButton: {
            backgroundColor: colour.primary,
            paddingVertical: 16,
            borderRadius: 8,
            alignItems: 'center',
        },

        // Transaction Success Screen Styles
        successCard: {
            backgroundColor: colour.white,
            borderRadius: 10,
            width: '100%',
            paddingVertical: 30,
            paddingHorizontal: 20,
            alignItems: 'center',
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            marginBottom: 30, 
        },
        successContentContainer: {
            flex: 1,
            padding: 20,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
        },
        iconContainer: {
            marginBottom: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        iconCircleOuter: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: '#E6F0FF', 
            alignItems: 'center',
            justifyContent: 'center',
        },
        iconCircleInner: {
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: colour.primary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        transactionDetailsBox: {
            backgroundColor: colour.primary,
            borderRadius: 8,
            width: '100%',
            padding: 15,
            marginBottom: 20,
        },
        detailRow: {
            paddingVertical: 8,
        },
        transactionDivider: {
            height: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            width: '100%',
        },
        emailContainer: {
            width: '100%',
            marginBottom: 10,
        },
        receiptInput: {
            borderWidth: 1,
            borderColor: colour.lightGrey,
            borderRadius: 4,
            padding: 10,
            width: '100%',
            fontSize: 14,
            color: colour.text,
            textAlign: 'center',
        },
        receiptButton: {
            backgroundColor: '#E6F0FF',
            borderRadius: 4,
            paddingVertical: 12,
            width: '100%',
            alignItems: 'center',
        },
        bottomButtons: {
            width: '100%',
            gap: 15,
        },
        printButton: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: colour.white,
            borderRadius: 4,
            paddingVertical: 15,
            width: '100%',
            alignItems: 'center',
        },
        nextOrderButton: {
            backgroundColor: colour.white,
            borderRadius: 4,
            paddingVertical: 15,
            width: '100%',
            alignItems: 'center',
        },
        // Order History Screen Styles
        historyCard: {
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        },
        historyHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
        },
        historyDetails: {
            borderTopWidth: 1,
            borderTopColor: '#f0f0f0',
            paddingTop: 8,
        },
        historyRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 4,
        },
        historyEmptyContainer: {
            alignItems: 'center',
            marginTop: 40,
        },
        
        // Filter Button
        historyFilterButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            paddingHorizontal: 16,
            paddingVertical: 14,
            marginHorizontal: 16,
            marginTop: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#ddd',
            width: '100%',
        },
        historyFilterButtonLeft: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        
        // Filter Modal
        filterModalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
        },
        filterModalContent: {
            backgroundColor: colour.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: 40,
        },
        filterModalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0',
        },
        filterModalCloseButton: {
            padding: 4,
        },
        filterModalBody: {
            paddingHorizontal: 20,
            paddingVertical: 20,
        },
        
        // Radio Buttons
        filterRadioOption: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 24,
        },
        filterRadioCircle: {
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: '#E0E0E0',
            marginRight: 12,
            alignItems: 'center',
            justifyContent: 'center',
        },
        filterRadioCircleSelected: {
            borderColor: colour.primary,
        },
        filterRadioInner: {
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: colour.primary,
        },
        
        // Date Inputs
        filterDateSection: {
            marginTop: 0,
            paddingLeft: 36,
        },
        filterDateRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
        },
        filterDateInput: {
            flex: 1,
            backgroundColor: '#F5F6F8',
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        
        // Filter Action Button
        filterApplyButton: {
            backgroundColor: colour.primary,
            borderRadius: 8,
            paddingVertical: 16,
            marginHorizontal: 20,
            marginTop: 40,
            alignItems: 'center',
            shadowColor: colour.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
        },

        
        // Section Headers for Daily Grouping
        historySectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: '#F5F6F8',
            width: '100%',
        },

        
        // Updated Transaction Cards
        historyTransactionCard: {
            backgroundColor: 'white',
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 5,
            margin:6
        },
        historyTransactionTop: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
        },

        historyTransactionBottom: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        historyStatusBadge: {
            backgroundColor: colour.primary,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 4,
        },

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

        // Client Module Styles
        // Shared header styles for all Client screens
        clientHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: colour.background,
            borderBottomWidth: 1,
            borderBottomColor: colour.border,
        },
        clientBackButton: {
            padding: 4,
        },
        clientContainer: {
            flex: 1,
            backgroundColor: '#F5F6F8',
        },
        
        // Calculator Screen Styles
        calcContainer: {
            flex: 1,
            backgroundColor: '#F5F6F8',
        },
        calcHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 16,
            paddingHorizontal: 20,
            backgroundColor: colour.white,
            borderBottomWidth: 1,
            borderBottomColor: '#F0F0F0',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
            zIndex: 10,
        },
        calcMenuIcon: {
            position: 'absolute',
            left: 20,
        },
        calcHeaderTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colour.primary,
        },
        calcContent: {
            flex: 1,
            padding: 16,
        },
        calcDisplayContainer: {
            backgroundColor: colour.white,
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            height: 250,
            justifyContent: 'flex-start',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
        },
        calcDisplayLabel: {
            fontSize: 16,
            color: '#444',
            marginBottom: 8,
            fontWeight: '500',
        },
        calcDisplayValue: {
            fontSize: 28,
            fontWeight: 'bold',
            color: '#BACDE1',
        },
        calcKeypadContainer: {
            flexDirection: 'row',
        },
        calcKeypadLeftColumn: {
            flex: 3,
        },
        calcKeypadRightColumn: {
            flex: 1,
            marginLeft: 8,
        },
        calcRow: {
            flexDirection: 'row',
            marginBottom: 8,
        },
        calcButton: {
            backgroundColor: colour.white,
            borderRadius: 8,
            flex: 1,
            height: 70,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 1,
            elevation: 2,
        },
        calcButtonMargin: {
            marginRight: 8,
        },
        calcButtonText: {
            fontSize: 24,
            color: '#333',
            fontWeight: '400',
        },
        calcButtonTextBlue: {
            fontSize: 24,
            color: colour.primary,
        },
        calcButtonTall: {
            backgroundColor: colour.white,
            borderRadius: 8,
            height: 148, // 70 * 2 + 8
            marginBottom: 8,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 1,
            elevation: 2,
        },
        calcButtonTallPrimary: {
            backgroundColor: colour.primary,
            borderRadius: 8,
            height: 148,
            marginBottom: 8,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 3,
        },
        calcButtonRight: {
            backgroundColor: colour.white,
            borderRadius: 8,
            height: 70,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 1,
            elevation: 2,
        },
        calcButtonTextWhite: {
            fontSize: 16,
            color: colour.white,
            fontWeight: 'bold',
        },

        // Profile Styles
        profileContainer: {
            flex: 1,
            backgroundColor: colour.background,
        },
        profileHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: colour.background,
            borderBottomWidth: 1,
            borderBottomColor: colour.border,
        },
        profileAvatarBase: {
            alignItems: 'center',
            marginTop: 32,
            marginBottom: 24,
        },
        profileAvatarCircle: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: colour.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
        },
        profileInfoCard: {
            backgroundColor: colour.white,
            borderRadius: 12,
            marginHorizontal: 16,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            marginBottom: 24,
        },
        profileInfoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#F0F0F0',
        },
        profileInfoTextContainer: {
            marginLeft: 16,
            flex: 1,
        },
        profileEditButton: {
            backgroundColor: colour.primary,
            marginHorizontal: 16,
            paddingVertical: 16,
            borderRadius: 8,
            alignItems: 'center',
        },
        profileInputContainer: {
            backgroundColor: colour.white,
            paddingHorizontal: 16,
            paddingVertical: 24,
            flex: 1,
        },
        clientContent: {
            padding: 20,
        },

        // ClientList specific styles
        clientSearchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            margin: 16,
            paddingHorizontal: 12,
            height: 48,
            backgroundColor: colour.background,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colour.border,
        },
        clientSearchInput: {
            flex: 1,
            fontSize: 14,
            color: colour.text,
        },
        clientSearchIcon: {
            marginLeft: 8,
        },
        clientListContent: {
            paddingBottom: 80,
        },
        clientItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: colour.border,
            backgroundColor: colour.background,
        },
        clientFooter: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
            backgroundColor: colour.background,
            borderTopWidth: 1,
            borderTopColor: colour.border,
        },
        clientAddButton: {
            backgroundColor: colour.primary,
            borderRadius: 8,
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
        },

        // ClientDetails specific styles
        clientCenter: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        clientAvatarContainer: {
            alignItems: 'center',
            marginBottom: 30,
        },
        clientAvatar: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colour.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
        },
        clientDetailsCard: {
            backgroundColor: colour.background,
            borderRadius: 12,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
        },

        clientDetailRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
        },
        clientDetailIconContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colour.background,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
        },
        clientDetailContent: {
            flex: 1,
        },
        
        // ClientAdd specific styles
        clientFieldContainer: {
            marginBottom: 20,
        },
        clientInput: {
            backgroundColor: colour.background,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            fontSize: 14,
            color: colour.text,
        },
        clientTextArea: {
            height: 120,
            borderWidth: 1,
            borderColor: colour.primary,
            backgroundColor: colour.background,
            textAlignVertical: 'top',
        },
        clientSaveButton: {
            backgroundColor: colour.background,
            borderRadius: 8,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
        },


        // Common Utils
        flex1: {
            flex: 1,
        },
        centerSelf: {
            alignSelf: 'center',
        },
        disabledOpacity: {
            opacity: 0.7,
        },
        headerSpacer: {
            width: 40,
        },
        headerSpacerSmall: {
            width: 24,
        },
        
        // Refactored Order History Styles
        filterModalApplyButton: {
            width: '90%',
            alignSelf: 'center',
        },
        headerBackButton: {
            padding: 8,
            alignSelf: 'flex-start',
            alignItems: 'flex-start',
        },
        listContentContainer: {
            paddingBottom: 16,
        },
        
        // Refactored Order Details Styles
        paddingHorizontal16: {
            paddingHorizontal: 16,
        },
        accordionArrow: {
             flexDirection: 'row',
             alignItems: 'center',
             gap: 8,
        },
        productHeaderWithZIndex: {
            zIndex: 1000,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#EEE',
        },
        productCategoryStart: {
             marginStart: 5,
        },
        searchIconMargin: {
            marginRight: 8,
        },
    })
}