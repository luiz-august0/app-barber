import { StyleSheet, Dimensions } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 100,
        alignItems: 'center',
        backgroundColor: globalStyles.main_color
    }, 
    textTitleName: {
        width: '90%',
        fontSize: 27,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: '#000',
        marginTop: 10,
    },
    textTitleEspec: {
        width: '90%',
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
        width: '50%',
        height: Dimensions.get('window').width / 2,
        marginTop: 10
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        borderRadius: 50
    },
    viewButtons: { 
        flexDirection: "row", 
        justifyContent: "space-evenly", 
        alignItems: 'center',
        marginTop: 10,
    }
});