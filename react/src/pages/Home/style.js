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
    text: {
        width: '100%',
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: '#ffff',
    },
    button: {
        justifyContent: 'center',
        marginTop: '11%',
        marginBottom: '-5%',
        width: 200,
        height: 50,
        borderRadius: 10,
        backgroundColor: '#343434'
    },
});