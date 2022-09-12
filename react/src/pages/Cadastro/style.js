import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCA311'
    },
    safeAreaC: {
        marginTop: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputC: {
        marginTop: 20,
        color: '#fff',
        padding: 8,
        width: 220,
        fontSize: 14,
        fontWeight: 'bold',
        borderRadius: 10,
        backgroundColor: '#404040',
        textDecorationColor: "#ffff"
    },
    btnNext: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        marginBottom: 25,
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
    btnCadastro: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        width: 150,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#fa8a5a'
    },
    btnRedefinir: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        width: 110,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#246fff'
    }
});