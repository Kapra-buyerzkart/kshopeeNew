import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { styles } from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../assets/theme/colours';
import { filterOptions } from './dummyData';
import LinearGradient from 'react-native-linear-gradient';
import { useCommonStyles } from '../../assets/styles';
import { AppIcons } from '../../assets/icons';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (selectedFilters: Record<string, string[]>) => void;
  categoryName?: string;
  categoryImage?: any;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  categoryName,
  categoryImage,
}) => {
  const tabs = Object.keys(filterOptions);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const homeStyles = useCommonStyles();

  const toggleFilter = (category: string, option: string) => {
    setSelectedFilters(prev => {
      const currentSelected = prev[category] || [];

      if (category === 'Prize' || category === 'Sort by') {
        return {
          ...prev,
          [category]: currentSelected.includes(option) ? [] : [option],
        };
      }

      if (currentSelected.includes(option)) {
        return {
          ...prev,
          [category]: currentSelected.filter(item => item !== option),
        };
      } else {
        return { ...prev, [category]: [...currentSelected, option] };
      }
    });
  };

  const handleReset = () => {
    setSelectedFilters({});
  };

  const handleSave = () => {
    console.log('Selected filters--->', selectedFilters);
    onApply(selectedFilters);
    onClose();
  };

  const renderOption = ({ item }: { item: string }) => {
    const isSelected = selectedFilters[activeTab]?.includes(item);

    return (
      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => toggleFilter(activeTab, item)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
          {isSelected && (
            <Ionicons name="checkmark" size={16} color={colors.themeTeal} />
          )}
        </View>
        <Text style={styles.checkboxLabel}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Top Drawer Header */}
              <View style={styles.modalTopHeader}>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons
                    name="arrow-back"
                    size={28}
                    color={colors.themeBlack}
                  />
                </TouchableOpacity>
                <Text style={styles.modalTopTitle}>Fashion</Text>
              </View>

              {/* Category Profile */}
              <View style={styles.modalCategoryProfile}>
                {categoryImage && (
                  <Image
                    source={categoryImage}
                    style={styles.modalCategoryImage}
                  />
                )}
                <Text style={styles.modalCategoryName}>{categoryName}</Text>
              </View>

              {/* Filter Sub-Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLeft}>
                  <Ionicons
                    name="options-outline"
                    size={20}
                    color={colors.themeBlack}
                    onPress={onClose}
                  />
                  <Text style={styles.modalTitle}>Filter</Text>
                </View>
                <Ionicons
                  name="funnel-outline"
                  size={20}
                  color={colors.themeBlack}
                />
              </View>

              {/* Body */}
              <View style={styles.modalBody}>
                {/* Left Sidebar */}
                <View style={styles.modalSidebar}>
                  {tabs.map(tab => {
                    const isActive = activeTab === tab;
                    const count = selectedFilters[tab]?.length || 0;
                    return (
                      <TouchableOpacity
                        key={tab}
                        style={[
                          styles.modalTab,
                          isActive && styles.modalTabActive,
                        ]}
                        onPress={() => setActiveTab(tab)}
                      >
                        <Text
                          style={[
                            styles.modalTabText,
                            isActive && styles.modalTabTextActive,
                          ]}
                        >
                          {tab}
                        </Text>
                        {count > 0 && !isActive && (
                          <View style={styles.modalTabBadge}>
                            <Text style={styles.modalTabBadgeText}>
                              {count}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Right Content */}
                <View style={styles.modalContent}>
                  <FlatList
                    data={
                      filterOptions[activeTab as keyof typeof filterOptions] ||
                      []
                    }
                    keyExtractor={item => item}
                    renderItem={renderOption}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              </View>

              {/* Footer */}
              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                  <Ionicons
                    name="refresh-outline"
                    size={20}
                    color={colors.themeBlack}
                  />
                  <Text style={styles.resetBtnText}>Reset</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                                    <Ionicons name="arrow-up-outline" size={20} color={colors.themeWhite} />
                                    <Text style={styles.saveBtnText}>Save</Text>
                                </TouchableOpacity> */}

                <LinearGradient
                  colors={[colors.themeTeal, colors.themeDarkTeal]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    homeStyles.reviewFilterPillActiveGradient,
                    { borderRadius: 0, flexDirection: 'row' },
                  ]}
                >
                  <AppIcons.ArrowUpBold color={colors.white} size={20} />
                  <TouchableOpacity onPress={handleSave} style={{ padding: 4 }}>
                    <Text
                      style={[
                        homeStyles.reviewFilterText,
                        homeStyles.reviewFilterTextActive,
                      ]}
                    >
                      Filter
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default FilterModal;
