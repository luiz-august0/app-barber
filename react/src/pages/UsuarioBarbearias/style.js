import { Dimensions, Platform, StatusBar, StyleSheet } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 50 : 0,
        backgroundColor: globalStyles.main_color
    }, 
    text: {
        width: '100%',
        fontSize: 18,
        fontFamily: 'Manrope-Bold',
        textAlign: 'center',
        color: '#ffff'
    },
    textTitle: {
        width: '100%',
        fontSize: 27,
        fontFamily: 'Manrope-Bold',
        textAlign: 'center',
        color: '#000',
        marginTop: '20%',
        marginBottom: '5%'
    },
    button: {
        justifyContent: 'center',
        marginTop: 55,
        width: 300,
        height: 50,
        borderRadius: 20,
        backgroundColor: '#343434'
    },
});