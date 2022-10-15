import { StyleSheet } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: globalStyles.main_color
    }, 
    image: {
        marginTop: '40%'
    },
    textTitle: {
        width: '100%',
        fontSize: 27,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: '#ffff',
        marginTop: 10
    },
    text: {
        width: '100%',
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: '#000',
        marginTop: 10
    },
    button: {
        marginTop: '11%',
        marginBottom: '-5%',
        width: '60%',
        height: '7%',
        borderRadius: 10,
        backgroundColor: '#343434'
    },
});