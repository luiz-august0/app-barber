import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 50 : 0,
        backgroundColor: globalStyles.main_color
    }, 
    textTitle: {
        fontSize: 27,
        fontFamily: 'Manrope-Bold',
        textAlign: 'center',
        color: '#BA6213',
        marginTop: 10,
        marginBottom: 40
    },
    text: {
        fontSize: 18,
        fontFamily: 'Manrope-Regular',
        textAlign: 'center',
        color: '#FFCA9F'
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width / 1.5,
        padding: 5,
        borderRadius: 5,
        backgroundColor: '#BA6213'
    },
    image: {
        width: Dimensions.get('window').width,
        height: 200,
    },
    viewButtons: { 
        flexDirection: "row", 
        justifyContent: "space-evenly", 
        alignItems: 'center',
        marginTop: 10,
    }
});