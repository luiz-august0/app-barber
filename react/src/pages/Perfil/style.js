import { StyleSheet, Dimensions } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: globalStyles.main_color
    }, 
    containerPassword: {
        flex: 1,
        backgroundColor: globalStyles.main_color
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
    inputC: {
        marginTop: 10,
        width: '70%',
        height: 40,
        borderRadius: 10,
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
    safeAreaC: {
        marginTop: '20%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainer: {
        width: '50%',
        height: Dimensions.get('window').width / 2,
        backgroundColor: '#EEE',
        marginTop: 10,
        marginBottom: 10
    },
    image: {
        width: '100%',
        height: Dimensions.get('window').width / 2,
        resizeMode: 'center'
    },
});