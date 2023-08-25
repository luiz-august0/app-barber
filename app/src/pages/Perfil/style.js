import { StyleSheet, Dimensions } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 90,
        backgroundColor: globalStyles.main_color
    }, 
    containerPassword: {
        flex: 1,
        marginTop: '50%',
        backgroundColor: globalStyles.main_color
    },
    textTitle: {
        width: '100%',
        fontSize: 27,
        fontFamily: 'Manrope-Bold',
        textAlign: 'center',
        color: '#000',
        marginBottom: 10
    },
    text: {
        fontSize: 12,
        textAlign: 'center',
        fontFamily: 'Manrope-Regular',
        color: '#2B513B',
        marginBottom: 30
    },
    inputC: {
        marginTop: 10,
        width: '70%',
        height: 55,
        backgroundColor: '#2B513B',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        width: 250,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#BA6213'
    },
    safeAreaC: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainer: {
        width: '50%',
        height: Dimensions.get('window').width / 2,
        marginTop: 10,
        marginBottom: 10
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        borderRadius: 15
    },
    containerIndicator: {
        flex: 1,
        justifyContent: 'center',
    },
    horizontalIndicator: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
});