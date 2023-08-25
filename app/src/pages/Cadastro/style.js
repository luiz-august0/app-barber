import { Dimensions, Platform, StatusBar, StyleSheet } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalStyles.main_color
    },
    image: {
        height: 250,
        width: 350
    },
    text_title: {
        marginTop: '2%',
        fontFamily: 'Manrope-Bold',
        fontSize: 26,
        color: '#000'
    },
    button1: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        width: '70%',
        height: 45,
        borderRadius: 5,
        backgroundColor: '#BA6213'
    },
    button2: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        width: '70%',
        height: 45,
        borderRadius: 5,
        backgroundColor: '#2B513B'
    },
    text: {
        fontSize: 14,
        fontFamily: 'Manrope-Regular',
        textAlign: 'center',
        color: '#FFCA9F',
    },
    safeAreaC: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 50 : 0,
        marginTop: Platform.OS === "android" ? Dimensions.get('window').height / 4 - 50 : Dimensions.get('window').height / 4
    },
    inputC: {
        marginTop: 10,
        width: '70%',
        height: 55,
        backgroundColor: '#2B513B',
    },
    btnCadastro: {
        marginTop: 25,
        marginBottom: 25,
    },
    imageCadastro: {
        width: 65,
        height: 65
    },
    inputAreaSenhaC: {
        marginTop: 20,
        flexDirection: "row",
        width: 220,
        backgroundColor: "#404040",
        borderRadius: 10,
        alignItems: "center",
        padding: 8,
    },  
    inputSenhaC: {
        width: "85%",
        color: "#FFF",
        fontSize: 14,
        fontWeight: 'bold',
    },
    iconEye: {
        width: "15%",
        justifyContent: "center",
        alignItems: "center",
    }, 
    btnRedefinir: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        marginBottom: 25,
        width: '70%',
        height: 45,
        borderRadius: 5,
        backgroundColor: '#2B513B'
    },
    textHeader: {
        color: '#BA6213', 
        textAlign: 'center', 
        marginBottom: 20,
        fontSize: 27, 
        fontFamily: 'Manrope-Regular'
    }
});