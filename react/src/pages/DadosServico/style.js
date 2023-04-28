import { StyleSheet } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 100,
        backgroundColor: globalStyles.main_color
    }, 
    itemImage: {
        width: 200, 
        height: 200, 
        padding: 20,
        marginBottom: 50,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'stretch'
    },
    text: {
        fontSize: 14,
        fontFamily: 'Montserrat-Bold',
        color: '#000'
    },
    textTitle: {
        width: '100%',
        fontSize: 27,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: '#000',
        marginTop: '15%',
        marginBottom: '5%'
    },
    buttonPickImage: {
        flexDirection: "row", 
        backgroundColor: "gray", 
        borderRadius: 10, 
        alignItems: "center", 
        padding: 10
    },
    input: {
        marginTop: 10,
        width: '70%',
        height: 55,
        backgroundColor: '#404040',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#0096FF'
    },
    buttonMinusAdd: {
        flexDirection: "row", 
        backgroundColor: "gray", 
        borderRadius: 10, 
        alignItems: "center", 
        padding: 10
    },
    viewSubmit: {
        flexDirection: "row", 
        justifyContent: "space-between", 
        marginTop: 100, 
        marginBottom: 50,
        width: "70%"
    }
});