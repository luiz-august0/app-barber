import { Dimensions, StyleSheet } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
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
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width / 2.2,
        height: 150,
        borderRadius: 20,
        backgroundColor: '#343434'
    },
    viewButtons: {
        flex: 1, 
        flexDirection: "row", 
        justifyContent: "space-evenly", 
        marginTop: 50
    }
});