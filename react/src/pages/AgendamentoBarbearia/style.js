import { Dimensions, Platform, StyleSheet } from 'react-native';
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS !== 'ios'?'20%':0,
        backgroundColor: globalStyles.main_color
    }, 
    headerView: {
        flex:1, 
        padding: 10, 
        flexDirection: "row", 
        justifyContent: "space-between", 
        marginTop: 40 
    },
    text: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: '#ffff',
    },
    button: {
        justifyContent: 'center',
        width: Dimensions.get('window').width / 2.5,
        height: 50,
        borderRadius: 20,
        backgroundColor: '#343434'
    },
    buttonFilter: {
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "center", 
        height: 50, 
        borderRadius: 20, 
        width: 150, 
        borderColor: '#000',
        borderWidth: 3
    },
    textTitle: {
        fontSize: 27,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: '#000',
        marginTop: 20,
        marginBottom: 10
    },
    textSubTitle: {
        fontSize: 22,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'left',
        color: '#000',
        marginTop: 20,
        marginBottom: 10
    }
});