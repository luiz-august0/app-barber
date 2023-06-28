import { StyleSheet, Dimensions } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 100,
        backgroundColor: globalStyles.main_color
    }, 
    text: {
        width: '100%',
        fontSize: 18,
        fontFamily: 'Manrope-Regular',
        textAlign: 'center',
        color: '#FFCA9F'
    },
    textTitle: {
        width: '100%',
        fontSize: 30,
        fontFamily: 'Manrope-Regular',
        textAlign: 'center',
        color: '#2B513B',
        marginTop: '15%',
        marginBottom: 5
    },
    textSubtitle: {
        fontSize: 12,
        textAlign: 'center',
        fontFamily: 'Manrope-Regular',
        color: '#2B513B',
        marginBottom: 30
    },
    textButtom: {
        width: '100%',
        fontSize: 14,
        fontFamily: 'Manrope-Regular',
        textAlign: 'right',
        color: '#ffff',
        marginBottom: 10
    },
    input: {
        marginTop: 10,
        width: '70%',
        height: 55,
        backgroundColor: '#2B513B',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35,
        marginBottom: 20,
        width: 250,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#2B513B'
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
        backgroundColor: '#BA6213', 
        borderRadius: 5, 
        width: '70%', 
        height: 50, 
        marginTop: 10 
    }
});