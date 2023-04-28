import { StyleSheet, Dimensions } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 100,
        backgroundColor: globalStyles.main_color
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
    input: {
        marginTop: 10,
        width: '70%',
        height: 55,
        backgroundColor: '#404040',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        width: 150,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#0096FF'
    },
});