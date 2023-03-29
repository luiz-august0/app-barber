import { StyleSheet, Dimensions } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 65,
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
        marginTop: '15%',
        marginBottom: '5%'
    },
    textSubtitle: {
        width: '100%',
        fontSize: 12,
        textAlign: 'center',
        color: '#ffff',
        marginBottom: 30
    },
    textButtom: {
        width: '100%',
        fontSize: 14,
        textAlign: 'right',
        color: '#ffff',
        marginBottom: 10
    },
    input: {
        marginTop: 10,
        width: '70%',
        height: 40,
        borderRadius: 10,
        backgroundColor: '#404040',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35,
        marginBottom: 20,
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
    viewCEP: {
        justifyContent: "center", 
        backgroundColor: '#FFB337', 
        borderRadius: 10, 
        width: '70%', 
        height: 50, 
        marginTop: 10 
    }
});