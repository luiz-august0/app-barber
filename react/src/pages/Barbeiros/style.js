import { Platform, StatusBar, StyleSheet } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 50 : 0,
        backgroundColor: globalStyles.main_color
    }, 
    text: {
        width: '100%',
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: '#ffff',
    },
    viewBarbeiro: {
        flex: 1, 
        padding: 10
    },
    textDetails: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: '#ffff',
        margin: 2
    },
    textButtonAdd: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: '#000',
    },
    textTitle: {
        width: '100%',
        fontSize: 27,
        fontFamily: 'Montserrat-Bold',
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
    buttonAdd: {
        justifyContent: 'center',
        alignItems: "center", 
        width: 300,
        marginTop: 50
    },
    viewComponentBarbeiro: {
        backgroundColor: '#343434',
        width: '100%', 
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
        backgroundColor: '#404040',
    },
    buttonConfirma: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        width: 110,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#05A94E'
    },
});