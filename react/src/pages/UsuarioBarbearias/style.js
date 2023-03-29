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
        color: '#ffff'
    },
    textTitle: {
        width: '100%',
        fontSize: 27,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: '#ffff',
        marginTop: '20%',
        marginBottom: '5%'
    },
    button: {
        justifyContent: 'center',
        marginTop: '11%',
        marginBottom: '-5%',
        width: 300,
        height: 50,
        borderRadius: 10,
        backgroundColor: '#343434'
    },
});