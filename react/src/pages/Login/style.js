import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCA311'
    }, 
    barberImage: {
        margin: "0%",
        width: "100%",
        height: "50%",
    },
    safeAreaL: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputL: {
        marginTop: 10,
        width: '70%',
        height: 40,
        borderRadius: 10,
        backgroundColor: '#404040',
    },
    inputAreaSenhaL: {
        marginTop: 10,
        flexDirection: "row",
        width: 220,
        backgroundColor: "#404040",
        borderRadius: 10,
        padding: 4,
    },  
    inputSenhaL: {
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
    btnLogin: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        marginBottom: 25,
        width: 80,
        height: 35,
        borderRadius: 10,
        backgroundColor: '#21BA9E'
    },
    btnCadastro: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        width: 150,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#fa8a5a'
    }
});