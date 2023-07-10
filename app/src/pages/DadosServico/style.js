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
        fontFamily: 'Manrope-Regular',
        color: '#FFCA9F'
    },
    textTitle: {
        width: '100%',
        fontSize: 27,
        fontFamily: 'Manrope-Bold',
        textAlign: 'center',
        color: '#000',
        marginTop: '15%',
        marginBottom: '5%'
    },
    buttonPickImage: {
        flexDirection: "row", 
        backgroundColor: "#BA6213", 
        borderRadius: 5, 
        alignItems: "center", 
        padding: 10
    },
    input: {
        marginTop: 10,
        width: '70%',
        height: 55,
        backgroundColor: '#2B513B',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        marginBottom: 50,
        width: '60%',
        height: 45,
        borderRadius: 5,
        backgroundColor: '#BA6213'
    },
    buttonMinusAdd: {
        flexDirection: "row", 
        backgroundColor: "#2B513B", 
        borderRadius: 5, 
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