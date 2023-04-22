import { StyleSheet } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalStyles.main_color
    },
    image: {
        marginTop: '30%',
        height: 250,
        width: 250
    },
    text_title: {
        marginTop: '2%',
        fontFamily: 'Montserrat-Bold',
        fontSize: 26,
        color: '#000'
    },
    button1: {
        justifyContent: 'center',
        marginTop: '11%',
        marginBottom: 25,
        width: 200,
        height: 50,
        borderRadius: 20,
        backgroundColor: '#343434'
    },
    button2: {
        justifyContent: 'center',
        width: 200,
        height: 50,
        borderRadius: 20,
        backgroundColor: '#343434'
    },
    text: {
        width: '100%',
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: '#ffff',
    },
    safeAreaC: {
        marginTop: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    safeAreaCfinaliza: {
        marginTop: '30%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputC: {
        marginTop: 10,
        width: '70%',
        height: 55,
        backgroundColor: '#404040',
    },
    btnCadastro: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        marginBottom: 25,
    },
    imageCadastro: {
        padding: "6%",
        width: "100%",
        height: 13
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
        marginTop: 20,
        width: 110,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#05A94E'
    }
});