import { StyleSheet } from 'react-native'
import globalStyles from '../../globalStyles';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalStyles.main_color,
        paddingTop: 50,
    },
    item: {
        padding: 20,
        marginTop: 25,
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
    },
    textItem: {
        fontSize: 18, 
        fontFamily: 'Montserrat-Bold', 
        marginBottom: 35
    },
    buttonItem: {
        alignContent: "center", 
        alignItems: "center", 
        justifyContent: "center", 
        paddingHorizontal: 15, 
        marginTop: '15%'
    },
    viewItem: {
        flexDirection: 'row',
    	alignItems: 'center',
    	backgroundColor: '#404040',
    	height: 40,
    	width: 100,
    	paddingHorizontal: 10,
		borderRadius: 10
    },
    viewItemText: {
        flex: 1,
        textAlign: 'center',
        color: '#ffff'
    }
});