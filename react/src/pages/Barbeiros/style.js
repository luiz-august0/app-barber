import { Platform, StatusBar, StyleSheet } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 50 : 0,
        backgroundColor: globalStyles.main_color
    }, 
    text: {
        width: '100%',
        fontSize: 14,
        fontFamily: 'Manrope-Regular',
        textAlign: 'center',
        color: '#000'
    },
    viewBarbeiro: {
        flex: 1, 
        padding: 10
    },
    textDetails: {
        fontSize: 14,
        fontFamily: 'Manrope-Regular',
        color: '#000',
        margin: 2
    },
    textButtonAdd: {
        fontSize: 16,
        fontFamily: 'Manrope-Regular',
        textAlign: 'center',
        color: '#2B513B',
    },
    textTitle: {
        width: '100%',
        fontSize: 24,
        fontFamily: 'Manrope-Bold',
        textAlign: 'center',
        color: '#2B513B',
        marginTop: '20%',
        marginBottom: '5%'
    },
    button: {
        justifyContent: 'center',
        marginTop: 55,
        width: 300,
        height: 45,
        borderRadius: 5,
        backgroundColor: '#2B513B'
    },
    buttonAdd: {
        justifyContent: 'center',
        alignItems: "center", 
        width: 300,
        marginTop: 50
    },
    viewComponentBarbeiro: {
        backgroundColor: '#FDEBDD',
        width: '95%', 
        borderRadius: 20, 
        marginVertical: 10
    },
    image: {
        alignItems: "flex-start", 
        height: 80, 
        width: 80, 
        resizeMode: 'cover', 
        marginHorizontal: 10, 
        marginTop: 10, 
        borderRadius: 50
    },
    buttonComponent: {
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "center", 
        marginBottom: 10, 
        marginTop: 10
    },
    input: {
        marginTop: 10,
        width: '100%',
        height: 55,
        backgroundColor: '#2B513B',
    },
    buttonConfirma: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        marginBottom: 25,
        width: '70%',
        height: 45,
        borderRadius: 5,
        backgroundColor: '#BA6213'
    },
});