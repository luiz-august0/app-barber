import { StyleSheet, Dimensions } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 100,
        backgroundColor: globalStyles.main_color
    }, 
    containerPassword: {
        flex: 1,
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
        width: '100%',
        fontSize: 12,
        textAlign: 'center',
        color: '#000',
        marginBottom: 30
    },
    textButton: {
        width: '100%',
        fontSize: 18,
        fontFamily: 'Manrope-Bold',
        textAlign: 'center',
        color: '#ffff',
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
        marginTop: 35,
        marginBottom: 100,
        width: 150,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#0096FF'
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