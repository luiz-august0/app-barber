import { Dimensions, StatusBar, StyleSheet } from 'react-native'
import { Platform } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 30,
        backgroundColor: "#2B513B"
    }, 
    image: {
        marginTop: '40%'
    },
    text: {
        fontSize: 16,
        fontFamily: 'Manrope-Bold',
        textAlign: 'center',
        color: '#FDEBDD',
    },
    button: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        width: Dimensions.get('window').width / 1.5,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: "#BA6213"
    },
    viewButtons: {
        flex: 1, 
        alignItems: 'center',
        gap: 20,
        marginTop: 50
    }
});