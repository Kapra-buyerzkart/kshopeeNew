import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { AppIcons } from '../../assets/icons';
import { colors, fontColors } from '../../assets/theme/colours';

interface AreaSelectionCardProps {
    areas: any[];
    selectedArea: any;
    onSelectArea: (area: any) => void;
}

const AreaSelectionCard: React.FC<AreaSelectionCardProps> = ({ areas, selectedArea, onSelectArea }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        if (!selectedArea) setIsExpanded(true);
    }, [selectedArea]);

    if (!areas || areas.length === 0) return null;

    if (selectedArea && !isExpanded) {
        return (
            <TouchableOpacity 
                style={styles.collapsedCard} 
                onPress={() => setIsExpanded(true)}
                activeOpacity={0.8}
            >
                <Text style={styles.collapsedText}>{selectedArea.areaName}</Text>
                
                <View style={styles.checkCircle}>
                    <AppIcons.Check color={colors.white} size={10} />
                </View>

                <View style={styles.chevronIcon}>
                    <AppIcons.ArrowDown color={fontColors.titleBlack} size={20} />
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.areaCard}>
            <Text style={styles.title}>Select your pin area</Text>
            
            {areas.map((area, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.row}
                    onPress={() => {
                        onSelectArea(area);
                        setIsExpanded(false);
                    }}
                >
                    <Text style={styles.areaText}>{area.areaName}</Text>
                    {selectedArea?.areaName !== area?.areaName ? (
                        <View style={styles.radioOuter} />
                    ) : (
                        <View style={styles.radioCheckedOuter}>
                            <View style={styles.radioCheckedInner} />
                        </View>
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default AreaSelectionCard;
