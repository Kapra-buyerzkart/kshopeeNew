// styles.ts
import { StyleSheet } from 'react-native';
import { fonts } from '../../assets/theme/typography';

export const getStyles = (colour: any) => StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        ...fonts.body2,
        fontSize: 14,
        color: colour.text,
        marginBottom: 5,
        fontWeight: '600',
    },
    input: {
        ...fonts.body2,
        height: 50,
        //backgroundColor: colour.inputBackground,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        color: colour.text,
        borderWidth: 1,
        borderColor: 'transparent',
        flex: 1,
    },
    focused: {
        borderColor: colour.secondary,
    },
    error: {
        borderColor: colour.red,
    },
    errorText: {
        ...fonts.body2,
        color: colour.red,
        fontSize: 12,
        marginTop: 5,
    },
    iconContainer: {
        paddingHorizontal: 10,
    },
    inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: colour.inputBackground,
},


});
