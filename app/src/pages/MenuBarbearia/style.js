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
        width: '90%',
        fontSize: 18,
        fontFamily: 'Manrope-Bold',
        textAlign: 'center',
        color: '#BA6213',
    },
    textButtonDelete: {
        fontSize: 16,
        fontFamily: 'Manrope-Bold',
        textAlign: 'center',
        color: '#BA6213',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width / 2.2,
        height: 150,
        borderRadius: 20,
        marginHorizontal: 5,
        backgroundColor: '#FDEBDD'
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
    },
    buttonDelete: {
        marginTop: 50, 
        marginBottom: 50, 
        alignItems: "center", 
        justifyContent: "center", 
        width: 200
    }
});