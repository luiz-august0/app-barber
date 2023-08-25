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
    textSubTitle: {
        fontSize: 22,
        fontFamily: 'Manrope-Bold',
        textAlign: 'left',
        color: '#2B513B',
        marginTop: 20,
        marginBottom: 10
    },
    textCenter: {
        fontSize: 18,
        fontFamily: 'Manrope-Bold',
        textAlign: 'center',
        color: '#BA6213',
    },
    textComment: {
        fontSize: 14,
        fontFamily: 'Manrope-Regular',
        color: '#343434',
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
    imageUsuario: {
        width: 50,
        height: 50,
        borderRadius: 50
    },
    centerView: {
        alignItems: "center", 
        justifyContent: "center",
        marginBottom: 10
    },
    separatedComponent: {
        height: 2, 
        backgroundColor: '#2B513B',
        marginBottom: 10
    },
    contatosView: {
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "center"
    },
    avaliacoesView: {
        flexDirection: "row", 
        flexWrap: "wrap", 
        alignItems: "center", 
        justifyContent: "center",
        marginBottom: 30
    },
    resumoAvaliacoesView: {
        alignItems: "center", 
        justifyContent: "center",
        marginLeft: 10
    },
    commentView: {
        padding: 10, 
        backgroundColor: "#FDEBDD", 
        marginVertical: 10
    },
    commentComponentView: {
        flexDirection: "row", 
        alignItems: "center", 
        marginBottom: 10
    }
});