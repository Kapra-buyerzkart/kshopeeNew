import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import { HOME_FONTS, fs, s } from '../../../Home/redesign/theme';
import { PDP_COLORS } from '../theme';
import type { JewelleryDetails } from '../data/selectors';

type Props = {
  jewellery: JewelleryDetails;
  pincode?: string;
  onPincodeCheck?: (pincode: string) => void;
  onCustomizePress?: () => void;
  onSizeGuidePress?: () => void;
  onSelectSize?: (size: string) => void;
};

export const SpecDetailsRow: React.FC<Props> = ({
  jewellery,
  pincode: initialPincode = '',
  onPincodeCheck,
  onCustomizePress,
  onSizeGuidePress,
  onSelectSize,
}) => {
  const [selectedSize, setSelectedSize] = useState(
    jewellery.selectedSize || (jewellery.availableSizes?.[0] ?? ''),
  );
  const [inputPincode, setInputPincode] = useState(initialPincode);
  const [checkedPincode, setCheckedPincode] = useState(false);

  useEffect(() => {
    if (jewellery.selectedSize) {
      setSelectedSize(jewellery.selectedSize);
    } else if (jewellery.availableSizes && jewellery.availableSizes.length > 0) {
      setSelectedSize(prev =>
        jewellery.availableSizes.includes(prev)
          ? prev
          : jewellery.availableSizes[0],
      );
    }
  }, [jewellery.selectedSize, jewellery.availableSizes]);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    onSelectSize?.(size);
  };

  const handlePincodeCheck = () => {
    if (inputPincode.trim().length >= 5) {
      setCheckedPincode(true);
      onPincodeCheck?.(inputPincode.trim());
    }
  };

  // Build Gold, KT & Diamond pills according to whether data exists from backend
  const pills: { id: string; text: string; hasBullet?: boolean }[] = [];
  if (jewellery.goldPurity) {
    pills.push({
      id: 'gold_purity',
      text: jewellery.goldPurity,
      hasBullet: true,
    });
  }
  if (jewellery.goldType) {
    pills.push({
      id: 'gold_type',
      text: jewellery.goldType,
      hasBullet: false,
    });
  }
  if (jewellery.netWeight) {
    pills.push({
      id: 'net_weight',
      text: jewellery.netWeight,
      hasBullet: false,
    });
  }
  if (jewellery.hasDiamond) {
    if (jewellery.diamondWeight) {
      pills.push({
        id: 'diamond_weight',
        text: jewellery.diamondWeight,
        hasBullet: true,
      });
    }
    if (jewellery.diamondClarity) {
      pills.push({
        id: 'diamond_clarity',
        text: jewellery.diamondClarity,
        hasBullet: false,
      });
    }
  }

  const hasSizes = jewellery.availableSizes && jewellery.availableSizes.length > 0;

  return (
    <View style={styles.container}>
      {/* 1. Ring Size Row (only for rings / jewellery with sizes from backend) */}
      {hasSizes ? (
        <View style={styles.sizeSection}>
          <Text style={styles.sectionTitleSerif}>Ring Size</Text>
          <View style={styles.sizePillsRow}>
            {jewellery.availableSizes.map(size => {
              const active = String(size) === String(selectedSize);
              return (
                <TouchableOpacity
                  key={size}
                  activeOpacity={0.8}
                  onPress={() => handleSizeSelect(size)}
                  style={[styles.sizePill, active && styles.sizePillActive]}
                >
                  <Text
                    style={[
                      styles.sizePillText,
                      active && styles.sizePillTextActive,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : null}

      {/* Divider */}
      {pills.length > 0 && hasSizes ? <View style={styles.horizontalLine} /> : null}

      {/* 2. Gold, KT & Diamond Details Heading & Pills (only if backend pills exist) */}
      {pills.length > 0 ? (
        <>
          <View style={styles.detailsHeaderRow}>
            <Text style={styles.specsHeading}>
              {jewellery.hasDiamond
                ? 'GOLD, KT & DIAMOND DETAILS'
                : 'GOLD & KT DETAILS'}
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.specsScrollContent}
          >
            {pills.map(item => (
              <View key={item.id} style={styles.specPill}>
                {item.hasBullet ? <View style={styles.specBullet} /> : null}
                <Text style={styles.specPillText}>{item.text}</Text>
              </View>
            ))}
          </ScrollView>
        </>
      ) : null}

      {/* 3. Select Size & Size Guide Row (only if backend sizes exist) */}
      {hasSizes ? (
        <View style={styles.selectSizeSection}>
          <Text style={styles.selectSizeHeading}>SELECT SIZE</Text>
          <View style={styles.selectSizeRow}>
            {/* Dropdown Container */}
            <View style={styles.dropdownBox}>
              <Text style={styles.dropdownText} numberOfLines={1}>
                {`${selectedSize || jewellery.availableSizes[0]} • Ready to Ship`}
              </Text>
            </View>

            {/* Size Guide Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onSizeGuidePress}
              style={styles.sizeGuideBtn}
            >
              <Text style={styles.sizeGuideText}>Size Guide</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: s(14),
    paddingBottom: s(10),
    backgroundColor: '#FFFFFF',
  },
  sizeSection: {
    paddingHorizontal: s(16),
    marginBottom: s(14),
  },
  sectionTitleSerif: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(17),
    color: '#1A1A1A',
    marginBottom: s(8),
  },
  sizePillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    width: '100%',
  },
  sizePill: {
    flex: 1,
    height: s(32),
    borderRadius: s(16),
    // backgroundColor: '#F7F7F7',
    // borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizePillActive: {
    backgroundColor: '#0C382E',
    borderColor: '#0C382E',
  },
  sizePillText: {
    fontFamily: HOME_FONTS.lexendMedium,
    fontSize: fs(13),
    color: '#1A1A1A',
  },
  sizePillTextActive: {
    color: '#FFFFFF',
    fontFamily: HOME_FONTS.lexendMedium,
  },
  pincodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingVertical: s(10),
    backgroundColor: '#FAF7F2',
    marginHorizontal: s(16),
    borderRadius: s(10),
    marginBottom: s(12),
  },
  pinIcon: {
    marginRight: s(10),
  },
  pincodeTextCol: {
    flex: 1,
  },
  pincodeTitle: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(12),
    color: '#1A1A1A',
  },
  pincodeInput: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(11),
    color: '#555555',
    padding: 0,
    marginTop: s(2),
  },
  pincodeCheckBtn: {
    backgroundColor: '#0C382E',
    paddingHorizontal: s(14),
    paddingVertical: s(6),
    borderRadius: s(6),
  },
  pincodeCheckedBtn: {
    backgroundColor: '#1E6F5C',
  },
  pincodeCheckBtnText: {
    fontFamily: HOME_FONTS.bold,
    fontSize: fs(11),
    color: '#FFFFFF',
  },
  horizontalLine: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#EBE5DB',
    marginHorizontal: s(16),
    marginVertical: s(8),
  },
  detailsHeaderRow: {
    paddingHorizontal: s(16),
    marginBottom: s(8),
  },
  specsHeading: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(11),
    letterSpacing: 0.6,
    color: '#55605C',
    textTransform: 'uppercase',
  },
  specsScrollContent: {
    paddingHorizontal: s(16),
    gap: s(8),
    paddingBottom: s(10),
  },
  specPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(13),
    paddingVertical: s(6),
    borderRadius: s(20),
    borderWidth: 1,
    borderColor: '#DFD7CB',
    backgroundColor: '#FFFFFF',
  },
  specBullet: {
    width: s(5),
    height: s(5),
    borderRadius: s(2.5),
    backgroundColor: '#C59B27',
    marginRight: s(6),
  },
  specPillText: {
    fontFamily: HOME_FONTS.lexendMedium,
    fontSize: fs(11),
    color: '#1A1A1A',
  },
  customizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: s(16),
    marginTop: s(2),
    marginBottom: s(14),
    paddingVertical: s(10),
    borderWidth: 1,
    borderColor: '#0C382E',
    borderRadius: s(8),
    backgroundColor: '#FFFFFF',
    gap: s(6),
  },
  customizeIcon: {
    marginRight: s(2),
  },
  customizeText: {
    fontFamily: HOME_FONTS.lexendMedium,
    fontSize: fs(11.5),
    color: '#0C382E',
    letterSpacing: 0.6,
  },
  selectSizeSection: {
    paddingHorizontal: s(16),
    marginTop: s(4),
  },
  selectSizeHeading: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(11),
    letterSpacing: 0.6,
    color: '#55605C',
    marginBottom: s(8),
  },
  selectSizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  dropdownBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E2ECE6',
    borderWidth: 1,
    borderColor: '#C3D9CD',
    borderRadius: s(8),
    paddingHorizontal: s(12),
    paddingVertical: s(10),
  },
  dropdownText: {
    fontFamily: HOME_FONTS.lexendMedium,
    fontSize: fs(11.5),
    color: '#1A1A1A',
    flex: 1,
  },
  sizeGuideBtn: {
    paddingHorizontal: s(14),
    paddingVertical: s(10),
    borderWidth: 1,
    borderColor: '#DFD7CB',
    borderRadius: s(8),
    backgroundColor: '#FFFFFF',
  },
  sizeGuideText: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(11.5),
    color: '#1A1A1A',
  },
});

export default SpecDetailsRow;
