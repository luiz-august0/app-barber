import { StyleSheet } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalStyles.main_color,
        paddingTop: 50,
    },
    item: {
        flexDirection: 'row',
        padding: 20,
        marginTop: 25,
        justifyContent: 'space-between'
    },
    textTitle: {
        width: '100%',
        fontSize: 27,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: '#ffff',
        marginTop: 10,
        marginBottom: 40
    },
    text: {
        width: '100%',
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: '#ffff',
    },
    button: {
        marginTop: 10,
        marginBottom: 10,
        justifyContent: 'center',
        width: 250,
        height: 60,
        borderRadius: 10,
        backgroundColor: '#343434'
    }
});