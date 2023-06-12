import { StyleSheet, Dimensions } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: globalStyles.main_color
    }, 
    textTitleName: {
        fontSize: 27,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: '#000',
        marginTop: 10,
    },
    textTitleEspec: {
        fontSize: 18,
        fontFamily: 'Montserrat-Regular',
        textAlign: 'center',
        color: '#000',
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
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width / 2.2,
        height: 150,
        borderRadius: 20,
        marginHorizontal: 5,
        backgroundColor: '#343434'
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 10,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        borderRadius: 15
    },
    viewButtons: { 
        flexDirection: "row", 
        justifyContent: "space-evenly", 
        alignItems: 'center',
        marginTop: 10,
    }
});