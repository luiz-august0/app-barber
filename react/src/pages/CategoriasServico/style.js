import { StyleSheet } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 45,
        backgroundColor: globalStyles.main_color
    }, 
    text: {
        width: '100%',
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: '#ffff',
    },
    button: {
        justifyContent: 'center',
        marginTop: 55,
        width: 300,
        height: 50,
        borderRadius: 10,
        backgroundColor: '#343434'
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
    input: {
        marginTop: 10,
        width: '70%',
        height: 40,
        borderRadius: 10,
        backgroundColor: '#404040',
    },
});